import { google } from "googleapis";
import { GmailToken, IGmailToken } from "../models/GmailToken";

const OAUTH_CLIENT_ID = process.env.GMAIL_CLIENT_ID || "";
const OAUTH_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || "";
const OAUTH_REDIRECT_URI = process.env.GMAIL_REDIRECT_URI || "";

function createOAuth2Client() {
  return new google.auth.OAuth2(OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_REDIRECT_URI);
}

/** Generate the Google OAuth URL */
export function getAuthUrl(): string {
  const oauth2Client = createOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/gmail.send",
      "https://www.googleapis.com/auth/gmail.modify",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

/** Exchange auth code for tokens and save them */
export async function exchangeCode(userId: string, code: string): Promise<{ email: string }> {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);

  if (!tokens.access_token || !tokens.refresh_token) {
    throw new Error("Failed to get tokens from Google");
  }

  // Get user email
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();

  if (!data.email) throw new Error("Could not get email from Google");

  // Upsert tokens
  await GmailToken.findOneAndUpdate(
    { userId },
    {
      userId,
      email: data.email,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate: tokens.expiry_date || Date.now() + 3600000,
      scope: tokens.scope || "",
    },
    { upsert: true, new: true }
  );

  return { email: data.email };
}

/** Get an authenticated Gmail client for a user */
async function getGmailClient(userId: string) {
  const tokenDoc = await GmailToken.findOne({ userId });
  if (!tokenDoc) throw new Error("Gmail not connected");

  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials({
    access_token: tokenDoc.accessToken,
    refresh_token: tokenDoc.refreshToken,
    expiry_date: tokenDoc.expiryDate,
  });

  // Auto-refresh if expired
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      await GmailToken.findOneAndUpdate(
        { userId },
        {
          accessToken: tokens.access_token,
          expiryDate: tokens.expiry_date || Date.now() + 3600000,
        }
      );
    }
  });

  return google.gmail({ version: "v1", auth: oauth2Client });
}

/** List recent messages */
export async function listMessages(userId: string, maxResults = 20, pageToken?: string) {
  const gmail = await getGmailClient(userId);
  const res = await gmail.users.messages.list({
    userId: "me",
    maxResults,
    pageToken,
    q: "in:inbox",
  });

  if (!res.data.messages) return { messages: [], nextPageToken: null };

  // Fetch full message details in parallel (batched)
  const messages = await Promise.all(
    res.data.messages.map(async (m) => {
      const detail = await gmail.users.messages.get({ userId: "me", id: m.id!, format: "metadata", metadataHeaders: ["From", "Subject", "Date"] });
      const headers = detail.data.payload?.headers || [];
      const from = headers.find((h) => h.name === "From")?.value || "Unknown";
      const subject = headers.find((h) => h.name === "Subject")?.value || "(no subject)";
      const date = headers.find((h) => h.name === "Date")?.value || "";
      const snippet = detail.data.snippet || "";
      const labelIds = detail.data.labelIds || [];
      const isUnread = !labelIds.includes("UNREAD");

      return { id: m.id!, threadId: detail.data.threadId, from, subject, date, snippet, isUnread, labelIds };
    })
  );

  return { messages, nextPageToken: res.data.nextPageToken || null };
}

/** Get full message detail */
export async function getMessage(userId: string, messageId: string) {
  const gmail = await getGmailClient(userId);
  const res = await gmail.users.messages.get({ userId: "me", id: messageId, format: "full" });

  // Mark as read
  await gmail.users.messages.modify({ userId: "me", id: messageId, requestBody: { removeLabelIds: ["UNREAD"] } });

  const headers = res.data.payload?.headers || [];
  const from = headers.find((h) => h.name === "From")?.value || "";
  const to = headers.find((h) => h.name === "To")?.value || "";
  const subject = headers.find((h) => h.name === "Subject")?.value || "";
  const date = headers.find((h) => h.name === "Date")?.value || "";

  // Extract body (prefer text/plain, fallback to text/html)
  let body = "";
  const parts = res.data.payload?.parts || [];
  const walkParts = (p: any[]): string => {
    for (const part of p) {
      if (part.mimeType === "text/plain" && part.body?.data) return Buffer.from(part.body.data, "base64").toString("utf-8");
      if (part.parts) {
        const found = walkParts(part.parts);
        if (found) return found;
      }
    }
    return "";
  };

  if (res.data.payload?.body?.data) {
    body = Buffer.from(res.data.payload.body.data, "base64").toString("utf-8");
  } else if (parts.length > 0) {
    body = walkParts(parts);
  }

  return { id: messageId, threadId: res.data.threadId, from, to, subject, date, body, snippet: res.data.snippet || "" };
}

/** Send an email */
export async function sendEmail(userId: string, to: string, subject: string, body: string, threadId?: string) {
  const gmail = await getGmailClient(userId);

  const profile = await GmailToken.findOne({ userId });
  const fromEmail = profile?.email || "me";

  const raw = makeEmailRaw(fromEmail, to, subject, body, threadId);

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw, threadId },
  });

  return { id: res.data.id, threadId: res.data.threadId };
}

/** Build RFC 2822 email raw string */
function makeEmailRaw(from: string, to: string, subject: string, body: string, inReplyTo?: string): string {
  const lines: string[] = [];
  lines.push(`From: ${from}`);
  lines.push(`To: ${to}`);
  lines.push(`Subject: ${subject}`);
  lines.push("MIME-Version: 1.0");
  lines.push('Content-Type: text/plain; charset="UTF-8"');
  if (inReplyTo) lines.push(`In-Reply-To: ${inReplyTo}`);
  lines.push("");
  lines.push(body);

  return Buffer.from(lines.join("\r\n")).toString("base64url");
}

/** Check if user has Gmail connected */
export async function getConnectionStatus(userId: string) {
  const token = await GmailToken.findOne({ userId });
  return token ? { connected: true, email: token.email } : { connected: false, email: null };
}

/** Disconnect Gmail */
export async function disconnectGmail(userId: string) {
  await GmailToken.deleteOne({ userId });
}
