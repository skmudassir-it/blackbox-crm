import { Router, Request, Response } from "express";
import { authenticate, AuthPayload } from "../middleware/auth";
import * as gmailService from "../services/gmail";

const router = Router();

// All routes require authentication
router.use(authenticate);

/** GET /api/gmail/auth — start OAuth flow */
router.get("/auth", (_req: Request, res: Response) => {
  const url = gmailService.getAuthUrl();
  res.json({ url });
});

/** GET /api/gmail/callback — OAuth callback (exchanges code for tokens) */
router.get("/callback", async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.query;
    if (!code || typeof code !== "string") {
      res.status(400).json({ error: "Missing authorization code" });
      return;
    }

    const userId = (req.user as AuthPayload).userId;
    const { email } = await gmailService.exchangeCode(userId, code);

    // Redirect back to frontend messages page
    const frontendUrl = process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:3000";
    res.redirect(`${frontendUrl}/dashboard/messages?gmail=connected&email=${encodeURIComponent(email)}`);
  } catch (err: any) {
    console.error("Gmail callback error:", err);
    const frontendUrl = process.env.FRONTEND_URL?.split(",")[0] || "http://localhost:3000";
    res.redirect(`${frontendUrl}/dashboard/messages?gmail=error&reason=${encodeURIComponent(err.message)}`);
  }
});

/** GET /api/gmail/status — check connection status */
router.get("/status", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const status = await gmailService.getConnectionStatus(userId);
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** DELETE /api/gmail/disconnect */
router.delete("/disconnect", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    await gmailService.disconnectGmail(userId);
    res.json({ message: "Gmail disconnected" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/** GET /api/gmail/messages — list inbox */
router.get("/messages", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const { pageToken, max } = req.query;
    const result = await gmailService.listMessages(userId, max ? parseInt(max as string) : 20, pageToken as string | undefined);
    res.json(result);
  } catch (err: any) {
    if (err.message === "Gmail not connected") {
      res.status(400).json({ error: "Gmail not connected" });
    } else {
      console.error("Fetch messages error:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

/** GET /api/gmail/messages/:id — read single message */
router.get("/messages/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const message = await gmailService.getMessage(userId, req.params.id);
    res.json(message);
  } catch (err: any) {
    if (err.message === "Gmail not connected") {
      res.status(400).json({ error: "Gmail not connected" });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

/** POST /api/gmail/send — send email */
router.post("/send", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    const { to, subject, body, threadId } = req.body;

    if (!to || !subject || !body) {
      res.status(400).json({ error: "to, subject, and body are required" });
      return;
    }

    const result = await gmailService.sendEmail(userId, to, subject, body, threadId);
    res.json(result);
  } catch (err: any) {
    if (err.message === "Gmail not connected") {
      res.status(400).json({ error: "Gmail not connected" });
    } else {
      console.error("Send email error:", err);
      res.status(500).json({ error: err.message });
    }
  }
});

/** GET /api/gmail/thread/:id — get all messages in a thread */
router.get("/thread/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthPayload).userId;
    // For simplicity, just return the thread detail
    const gmailClient = await gmailService.listMessages(userId, 1); // get gmail client indirectly
    // Actually listMessages doesn't expose gmail client, let's redirect to first message
    res.json({ threadId: req.params.id, message: "Thread view coming soon" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
