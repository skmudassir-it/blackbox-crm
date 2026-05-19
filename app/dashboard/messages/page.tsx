"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope, faInbox, faSearch, faPlus, faPaperPlane,
  faArrowLeft, faTrash, faSync, faCheck, faTimes,
  faPaperclip, faExclamationTriangle, faChevronLeft, faChevronRight,
  faPlug, faCog, faServer, faShieldHalved, faEye, faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";

interface EmailMessage {
  id: string; threadId: string; from: string; subject: string;
  date: string; snippet: string; isUnread: boolean; labelIds: string[];
}

interface EmailDetail {
  id: string; threadId: string; from: string; to: string;
  subject: string; date: string; body: string; snippet: string;
}

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<{ connected: boolean; email: string | null } | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<EmailDetail | null>(null);
  const [msgLoading, setMsgLoading] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [compose, setCompose] = useState({ to: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"gmail" | "outlook" | "smtp">("gmail");
  // SMTP state
  const [smtpForm, setSmtpForm] = useState({ host: "", port: "587", user: "", pass: "", secure: "true" });
  const [smtpTesting, setSmtpTesting] = useState(false);
  const [smtpResult, setSmtpResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  // Outlook state
  const [outlookStatus, setOutlookStatus] = useState<{ connected: boolean; email?: string }>({ connected: false });

  // Check connection status
  const checkStatus = useCallback(async () => {
    const res = await api.get<{ connected: boolean; email: string | null }>("/api/gmail/status");
    if (res.ok && res.data) setStatus(res.data);
    setStatusLoading(false);
  }, []);

  useEffect(() => { checkStatus(); }, [checkStatus]);

  // Handle OAuth callback params
  useEffect(() => {
    const gmail = searchParams.get("gmail");
    const email = searchParams.get("email");
    const reason = searchParams.get("reason");
    if (gmail === "connected" && email) {
      setSuccess(`Gmail connected — ${email}`);
      checkStatus();
    } else if (gmail === "error" && reason) {
      setError(`Connection failed: ${reason}`);
    }
  }, [searchParams, checkStatus]);

  // Fetch inbox
  const fetchInbox = useCallback(async () => {
    setLoading(true);
    const res = await api.get<{ messages: EmailMessage[]; nextPageToken: string | null }>("/api/gmail/messages");
    if (res.ok && res.data) setMessages(res.data.messages);
    else if (res.error) setError(res.error);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status?.connected) fetchInbox();
  }, [status, fetchInbox]);

  // Read message
  async function openMessage(id: string) {
    setMsgLoading(true);
    setSelectedMsg(null);
    const res = await api.get<EmailDetail>(`/api/gmail/messages/${id}`);
    if (res.ok && res.data) setSelectedMsg(res.data);
    setMsgLoading(false);
    // Mark as read in list
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isUnread: false } : m)));
  }

  // Start OAuth
  async function startOAuth() {
    const res = await api.get<{ url: string }>("/api/gmail/auth");
    if (res.ok && res.data) {
      window.location.href = res.data.url;
    }
  }

  // Disconnect
  async function disconnect() {
    if (!confirm("Disconnect Gmail? You can reconnect anytime.")) return;
    await api.delete("/api/gmail/disconnect");
    setStatus({ connected: false, email: null });
    setMessages([]);
    setSelectedMsg(null);
  }

  // Send email (compose or reply)
  async function sendEmail(replyTo?: EmailDetail) {
    setSending(true);
    setError("");
    const body = replyTo
      ? { to: replyTo.from.match(/<(.+)>/) ? replyTo.from.match(/<(.+)>/)![1] : replyTo.from, subject: `Re: ${replyTo.subject}`, body: compose.body, threadId: replyTo.threadId }
      : compose;

    if (!body.to || !body.subject || !body.body) {
      setError("All fields are required");
      setSending(false);
      return;
    }

    const res = await api.post("/api/gmail/send", body);
    if (res.ok) {
      setSuccess("Email sent!");
      setShowCompose(false);
      setCompose({ to: "", subject: "", body: "" });
      setSelectedMsg(null);
      setTimeout(() => fetchInbox(), 1000);
    } else {
      setError(res.error || "Failed to send");
    }
    setSending(false);
  }

  function replyTo(msg: EmailDetail) {
    setCompose({ to: "", subject: "", body: `\n\n---\nOn ${msg.date}, ${msg.from} wrote:\n> ${msg.body.slice(0, 300).replace(/\n/g, "\n> ")}` });
    setShowCompose(true);
    setSelectedMsg(msg);
  }

  // Filter messages
  const filtered = search ? messages.filter((m) => m.subject.toLowerCase().includes(search.toLowerCase()) || m.from.toLowerCase().includes(search.toLowerCase())) : messages;

  if (statusLoading) return <div className="text-center py-12 text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      {/* Messages */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faExclamationTriangle} />{error}
          <button onClick={() => setError("")} className="ml-auto"><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 flex items-center gap-2">
          <FontAwesomeIcon icon={faCheck} />{success}
          <button onClick={() => setSuccess("")} className="ml-auto"><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      )}

      {!status?.connected ? (
        /* Not connected — show provider selection */
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Email Providers</h2>

          {/* Tab selector */}
          <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
            {(["gmail", "outlook", "smtp"] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>
                {tab === "gmail" ? "Gmail" : tab === "outlook" ? "Outlook" : "SMTP"}
              </button>
            ))}
          </div>

          {/* Gmail Card */}
          {activeTab === "gmail" && (
            <div className="bg-card rounded-2xl border border-border/50 p-8 text-center max-w-lg">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#EA433515" }}>
                <FontAwesomeIcon icon={faGoogle} className="h-8 w-8" style={{ color: "#EA4335" }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect Your Gmail</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Link your Gmail account to read, reply, and send emails directly from Blackbox CRM.
                Your credentials are secure — we use Google OAuth with read-only + send permissions.
              </p>
              <button onClick={startOAuth}
                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-white h-11 px-6 transition-all hover:opacity-90"
                style={{ backgroundColor: "#EA4335" }}>
                <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
                Connect Gmail
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                You'll be redirected to Google to authorize access. <br />
                <span className="text-amber-600">Requires Google Cloud Console setup — see guide below.</span>
              </p>
            </div>
          )}

          {/* Outlook Card */}
          {activeTab === "outlook" && (
            <div className="bg-card rounded-2xl border border-border/50 p-8 text-center max-w-lg">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#0078D415" }}>
                <FontAwesomeIcon icon={faMicrosoft} className="h-8 w-8" style={{ color: "#0078D4" }} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Connect Outlook / Microsoft 365</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Connect your Outlook or Microsoft 365 work account to sync emails.
                Uses Microsoft Graph API with mail.read + mail.send permissions.
              </p>
              <button onClick={() => setSuccess("Outlook integration coming soon — Microsoft Graph API setup guide in progress.")}
                className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold text-white h-11 px-6 transition-all hover:opacity-90"
                style={{ backgroundColor: "#0078D4" }}>
                <FontAwesomeIcon icon={faMicrosoft} className="h-4 w-4" />
                Connect Outlook
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Microsoft Graph API integration — available in next update
              </p>
            </div>
          )}

          {/* SMTP Card */}
          {activeTab === "smtp" && (
            <div className="bg-card rounded-2xl border border-border/50 p-6 max-w-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#6366f115" }}>
                  <FontAwesomeIcon icon={faServer} className="h-5 w-5" style={{ color: "#6366f1" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Custom SMTP Server</h3>
                  <p className="text-xs text-muted-foreground">Use any email provider via SMTP</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">SMTP Host</label>
                  <input value={smtpForm.host} onChange={(e) => setSmtpForm({ ...smtpForm, host: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Port</label>
                    <select value={smtpForm.port} onChange={(e) => setSmtpForm({ ...smtpForm, port: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="587">587 (TLS)</option>
                      <option value="465">465 (SSL)</option>
                      <option value="25">25</option>
                      <option value="2525">2525</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Security</label>
                    <select value={smtpForm.secure} onChange={(e) => setSmtpForm({ ...smtpForm, secure: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="true">STARTTLS</option>
                      <option value="ssl">SSL/TLS</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Username / Email</label>
                  <input value={smtpForm.user} onChange={(e) => setSmtpForm({ ...smtpForm, user: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@gmail.com" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Password / App Password</label>
                  <div className="relative">
                    <input type={showSmtpPass ? "text" : "password"} value={smtpForm.pass}
                      onChange={(e) => setSmtpForm({ ...smtpForm, pass: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background pl-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="App-specific password" />
                    <button onClick={() => setShowSmtpPass(!showSmtpPass)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                      <FontAwesomeIcon icon={showSmtpPass ? faEyeSlash : faEye} className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {smtpResult && (
                <div className={`mt-4 p-3 rounded-lg text-xs flex items-center gap-2 ${
                  smtpResult.ok ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  <FontAwesomeIcon icon={smtpResult.ok ? faCheck : faTimes} className="h-3 w-3 shrink-0" />
                  {smtpResult.msg}
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button onClick={async () => {
                  setSmtpTesting(true); setSmtpResult(null);
                  const res = await api.post<{ ok: boolean; msg: string }>("/api/smtp/test", smtpForm);
                  setSmtpResult(res.ok && res.data ? res.data : { ok: false, msg: res.error || "Connection failed" });
                  setSmtpTesting(false);
                }} disabled={smtpTesting || !smtpForm.host || !smtpForm.user || !smtpForm.pass}
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-5 transition-all disabled:opacity-50">
                  <FontAwesomeIcon icon={smtpTesting ? faSync : faPlug} className={`h-3.5 w-3.5 ${smtpTesting ? "animate-spin" : ""}`} />
                  {smtpTesting ? "Testing..." : "Test Connection"}
                </button>
                <button onClick={async () => {
                  if (!smtpResult?.ok) { setError("Test connection first"); return; }
                  const res = await api.post("/api/smtp/save", smtpForm);
                  if (res.ok) setSuccess("SMTP configuration saved — outgoing email ready!");
                  else setError(res.error || "Failed to save");
                }} disabled={!smtpResult?.ok}
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-medium border border-input bg-background text-foreground hover:bg-muted h-10 px-5 transition-all disabled:opacity-40">
                  <FontAwesomeIcon icon={faCog} className="h-3.5 w-3.5" />
                  Save Config
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <FontAwesomeIcon icon={faShieldHalved} className="h-3 w-3" />
                Credentials are encrypted at rest and never logged
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Connected — show inbox */
        <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: "calc(100vh - 12rem)" }}>
          {/* Inbox sidebar */}
          <div className="lg:w-96 shrink-0 bg-card rounded-2xl border border-border/50 flex flex-col">
            <div className="p-4 border-b border-border/50 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FontAwesomeIcon icon={faInbox} className="text-secondary" />
                  Inbox — <span className="text-muted-foreground font-normal text-xs">{status.email}</span>
                </h2>
                <div className="flex items-center gap-1">
                  <button onClick={fetchInbox} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Refresh">
                    <FontAwesomeIcon icon={faSync} className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button onClick={disconnect} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Disconnect">
                    <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <button onClick={() => { setCompose({ to: "", subject: "", body: "" }); setShowCompose(true); setSelectedMsg(null); }}
                className="w-full flex items-center justify-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 transition-all">
                <FontAwesomeIcon icon={faPlus} className="h-3.5 w-3.5" /> Compose
              </button>
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search..." />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-xs text-muted-foreground">Loading...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">No messages</div>
              ) : (
                filtered.map((msg) => (
                  <button key={msg.id} onClick={() => openMessage(msg.id)}
                    className={`w-full text-left px-4 py-3 border-b border-border/30 hover:bg-muted/30 transition-colors ${
                      selectedMsg?.id === msg.id ? "bg-primary/5" : ""
                    } ${msg.isUnread ? "font-semibold" : ""}`}>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs text-foreground truncate">{msg.from.replace(/<.*>/, "").trim()}</p>
                      <p className="text-[10px] text-muted-foreground shrink-0">{formatDate(msg.date)}</p>
                    </div>
                    <p className="text-xs mt-0.5 truncate">{msg.subject}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{msg.snippet}</p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Reading pane / Compose */}
          <div className="flex-1 bg-card rounded-2xl border border-border/50 min-h-[400px]">
            {showCompose ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-foreground">{selectedMsg ? "Reply" : "New Message"}</h3>
                  <button onClick={() => { setShowCompose(false); setSelectedMsg(null); }} className="p-1.5 rounded-lg hover:bg-muted">
                    <FontAwesomeIcon icon={faTimes} className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                {!selectedMsg && (
                  <>
                    <div><label className="block text-xs font-medium text-foreground mb-1">To</label>
                      <input value={compose.to} onChange={(e) => setCompose({ ...compose, to: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="recipient@email.com" /></div>
                    <div><label className="block text-xs font-medium text-foreground mb-1">Subject</label>
                      <input value={compose.subject} onChange={(e) => setCompose({ ...compose, subject: e.target.value })}
                        className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Subject" /></div>
                  </>
                )}
                {selectedMsg && (
                  <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                    Replying to: <span className="text-foreground font-medium">{selectedMsg.from}</span><br />
                    Subject: <span className="text-foreground">{selectedMsg.subject}</span>
                  </div>
                )}
                <div>
                  <textarea value={compose.body} onChange={(e) => setCompose({ ...compose, body: e.target.value })} rows={10}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder={selectedMsg ? "Write your reply..." : "Write your message..."} />
                </div>
                <button onClick={() => sendEmail(selectedMsg || undefined)} disabled={sending}
                  className="inline-flex items-center gap-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 transition-all disabled:opacity-50">
                  <FontAwesomeIcon icon={faPaperPlane} className="h-3.5 w-3.5" />
                  {sending ? "Sending..." : selectedMsg ? "Send Reply" : "Send"}
                </button>
              </div>
            ) : selectedMsg ? (
              <div className="p-6">
                <button onClick={() => setSelectedMsg(null)}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
                  <FontAwesomeIcon icon={faArrowLeft} className="h-3 w-3" /> Back to inbox
                </button>
                <h3 className="text-lg font-semibold text-foreground mb-1">{selectedMsg.subject}</h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                  <span className="font-medium text-foreground">{selectedMsg.from}</span>
                  <span>{formatDate(selectedMsg.date)}</span>
                </div>
                <div className="flex gap-2 mb-6">
                  <button onClick={() => replyTo(selectedMsg)}
                    className="inline-flex items-center gap-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 h-8 px-3 transition-colors">
                    <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" /> Reply
                  </button>
                </div>
                <div className="prose prose-sm max-w-none text-sm text-foreground leading-relaxed whitespace-pre-wrap border-t border-border/50 pt-4">
                  {selectedMsg.body || "(No content)"}
                </div>
              </div>
            ) : msgLoading ? (
              <div className="flex items-center justify-center h-full py-12 text-muted-foreground text-sm">Loading message...</div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground text-sm">
                <FontAwesomeIcon icon={faInbox} className="h-10 w-10 mb-3 opacity-30" />
                <p>Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}
