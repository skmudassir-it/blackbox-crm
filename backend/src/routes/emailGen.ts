import { Router, Request, Response } from "express";
import { authenticate } from "../middleware/auth";
import https from "https";

const router = Router();

router.use(authenticate);

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";

interface EmailVariant {
  subject: string;
  body: string;
}

function callDeepSeek(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an expert email copywriter. Generate professional business emails. Return ONLY valid JSON. No markdown, no explanation, no code fences.",
        },
        {
          role: "user",
          content: `Generate 3 email variations based on this prompt: "${prompt}"

Return ONLY a JSON array of objects — no markdown, no backticks, no explanation. Each object must have "subject" and "body" keys.

Example format:
[
  {"subject": "Subject line here", "body": "Dear [Name],\\n\\nEmail body here...\\n\\nBest regards,\\n[Your Name]"},
  {"subject": "Another subject", "body": "Dear [Name],\\n\\nAnother body...\\n\\nBest regards,\\n[Your Name]"},
  {"subject": "Third subject", "body": "Dear [Name],\\n\\nThird body...\\n\\nBest regards,\\n[Your Name]"}
]

IMPORTANT: Use "\\n" for line breaks. Return ONLY the JSON array. No other text.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    const req = https.request(
      DEEPSEEK_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(body);
            const content = json.choices?.[0]?.message?.content;
            if (!content) {
              reject(new Error("No content in DeepSeek response"));
              return;
            }
            resolve(content);
          } catch (e) {
            reject(new Error(`Failed to parse DeepSeek response: ${body.slice(0, 200)}`));
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(data);
    req.end();
  });
}

function parseEmails(raw: string): EmailVariant[] {
  // Strip markdown code fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  const parsed = JSON.parse(cleaned);

  if (!Array.isArray(parsed)) {
    throw new Error("Response is not an array");
  }

  return parsed.map((item: any, i: number) => {
    if (!item.subject || !item.body) {
      throw new Error(`Email variant ${i + 1} missing subject or body`);
    }
    return {
      subject: item.subject,
      body: item.body,
    };
  });
}

// POST /api/email-gen/generate — generate 3 email variants from a prompt
router.post("/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      res.status(400).json({ error: "Prompt is required" });
      return;
    }

    if (!DEEPSEEK_API_KEY) {
      res.status(500).json({ error: "DeepSeek API key not configured on server" });
      return;
    }

    const raw = await callDeepSeek(prompt.trim());
    const emails = parseEmails(raw);

    res.json({ emails });
  } catch (err: any) {
    console.error("Email generation error:", err);
    res.status(500).json({
      error: err.message || "Failed to generate emails",
    });
  }
});

export default router;
