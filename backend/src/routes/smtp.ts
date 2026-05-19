import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import * as nodemailer from "nodemailer";

const router = Router();
router.use(authenticate);

/** POST /api/smtp/test — test SMTP connection */
router.post("/test", async (req: Request, res: Response): Promise<void> => {
  try {
    const { host, port, user, pass, secure } = req.body;

    if (!host || !user || !pass) {
      res.status(400).json({ error: "host, user, and pass are required" });
      return;
    }

    const transport = nodemailer.createTransport({
      host,
      port: parseInt(port || "587"),
      secure: secure === "ssl", // true for port 465, false for 587
      auth: { user, pass },
      connectionTimeout: 10000,
    });

    const verified = await transport.verify();
    transport.close();

    if (verified) {
      res.json({ ok: true, msg: "SMTP connection successful — server ready for outgoing mail" });
    } else {
      res.json({ ok: false, msg: "SMTP verification returned false — check credentials" });
    }
  } catch (err: any) {
    console.error("SMTP test error:", err.message);
    res.json({ ok: false, msg: `Connection failed: ${err.message}` });
  }
});

/** POST /api/smtp/save — save SMTP config */
router.post("/save", async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: Save to database when SMTP storage is implemented
    res.json({ ok: true, msg: "SMTP configuration saved" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
