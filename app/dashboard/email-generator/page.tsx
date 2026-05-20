"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faCopy,
  faCheck,
  faEnvelope,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

interface EmailVariant {
  subject: string;
  body: string;
}

export default function EmailGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [emails, setEmails] = useState<EmailVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setError("");
    setLoading(true);
    setEmails([]);

    try {
      const res = await api.post<{ emails: EmailVariant[] }>("/api/email-gen/generate", {
        prompt: prompt.trim(),
      });

      if (res.ok && res.data) {
        setEmails(res.data.emails);
      } else {
        setError(res.error || "Failed to generate emails");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (email: EmailVariant, idx: number) => {
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Email Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered email drafts — describe what you need and get 3 professional variations
        </p>
      </div>

      {/* Prompt Input */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-foreground mb-2">
          What kind of email do you need?
        </label>
        <textarea
          rows={4}
          placeholder='e.g., "A friendly follow-up email to a client who requested a home insurance quote last week. Mention our competitive rates and ask if they have any questions."'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
          }}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
        />

        {error && (
          <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          className="mt-4 inline-flex items-center gap-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 px-6 transition-all disabled:opacity-50 shadow-sm"
        >
          {loading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
              Generate Emails
            </>
          )}
        </button>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: be specific about tone, audience, and purpose for best results.
        </p>
      </div>

      {/* Generated Emails */}
      {emails.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {emails.length} Variations
          </h2>

          {emails.map((email, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
            >
              {/* Subject */}
              <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="h-3.5 w-3.5 text-secondary shrink-0"
                  />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {email.subject}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(email, idx)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors shrink-0"
                >
                  <FontAwesomeIcon
                    icon={copiedIdx === idx ? faCheck : faCopy}
                    className="h-3 w-3"
                  />
                  {copiedIdx === idx ? "Copied!" : "Copy"}
                </button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <pre className="text-sm text-foreground/85 whitespace-pre-wrap font-sans leading-relaxed">
                  {email.body}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
