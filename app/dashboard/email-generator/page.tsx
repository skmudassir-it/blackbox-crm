"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWandMagicSparkles,
  faCopy,
  faCheck,
  faEnvelope,
  faSpinner,
  faPaperPlane,
  faChevronDown,
  faUser,
  faLightbulb,
} from "@fortawesome/free-solid-svg-icons";

interface EmailVariant {
  subject: string;
  body: string;
}

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

const SAMPLE_QUESTIONS = [
  {
    icon: "📅",
    label: "Follow up after a meeting",
    prompt:
      "Write a friendly follow-up email after a client meeting. Thank them for their time, summarize key points discussed, and suggest next steps.",
  },
  {
    icon: "💼",
    label: "Send a business proposal",
    prompt:
      "Write a professional email to send a business proposal. Mention the value we can bring, attach highlights of our services, and ask for a follow-up call.",
  },
  {
    icon: "🙏",
    label: "Thank-you after purchase",
    prompt:
      "Write a warm thank-you email to a customer who just purchased. Show genuine appreciation, mention key benefits they'll enjoy, and invite them to reach out with questions.",
  },
  {
    icon: "🚀",
    label: "Cold outreach to a lead",
    prompt:
      "Write a cold outreach email to a potential lead. Introduce our company briefly, highlight one key benefit, and ask if they'd be open to a quick chat.",
  },
  {
    icon: "📋",
    label: "Schedule a demo",
    prompt:
      "Write an email inviting a prospect to schedule a product demo. Briefly mention what we'll cover, offer 2-3 time slots, and make it easy for them to say yes.",
  },
  {
    icon: "🔄",
    label: "Check-in with existing client",
    prompt:
      "Write a check-in email to an existing client. Ask how things are going, if they need any help, and remind them we're here to support them.",
  },
];

export default function EmailGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [emails, setEmails] = useState<EmailVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Contacts for send-to
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  // Send state per email variant
  const [sendOpenIdx, setSendOpenIdx] = useState<number | null>(null);
  const [selectedContact, setSelectedContact] = useState<{[key: number]: string}>({});
  const [sendingIdx, setSendingIdx] = useState<number | null>(null);
  const [sentIdx, setSentIdx] = useState<number | null>(null);
  const [sendError, setSendError] = useState("");

  // Fetch contacts on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Contact[]>("/api/contacts?limit=200");
        if (res.ok && res.data) setContacts(res.data);
      } catch {
        // silent — contacts are optional
      } finally {
        setContactsLoading(false);
      }
    })();
  }, []);

  const handleSampleClick = (q: (typeof SAMPLE_QUESTIONS)[number]) => {
    setPrompt(q.prompt);
    setError("");
    setEmails([]);
    setSendOpenIdx(null);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt or pick a sample question above");
      return;
    }

    setError("");
    setLoading(true);
    setEmails([]);
    setSendOpenIdx(null);

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

  const handleSend = async (email: EmailVariant, idx: number) => {
    const contactId = selectedContact[idx];
    if (!contactId) {
      setSendError("Please select a recipient");
      return;
    }

    const contact = contacts.find((c) => c._id === contactId);
    if (!contact) {
      setSendError("Contact not found");
      return;
    }

    setSendError("");
    setSendingIdx(idx);

    try {
      const res = await api.post("/api/gmail/send", {
        to: contact.email,
        subject: email.subject,
        body: email.body,
      });

      if (res.ok) {
        setSentIdx(idx);
        setSendOpenIdx(null);
        setTimeout(() => setSentIdx(null), 5000);
      } else {
        setSendError(res.error || "Failed to send email");
      }
    } catch {
      setSendError("Something went wrong sending the email");
    } finally {
      setSendingIdx(null);
    }
  };

  const getContactName = (id: string) => {
    const c = contacts.find((c) => c._id === id);
    return c ? `${c.firstName} ${c.lastName} (${c.email})` : "Select recipient...";
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-foreground">Email Generator</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-powered email drafts — pick a sample question or write your own, then send directly to a contact
        </p>
      </div>

      {/* Sample Questions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FontAwesomeIcon icon={faLightbulb} className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-foreground">Sample questions (click to use)</span>
          <span className="text-xs text-muted-foreground">— or type your own below</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSampleClick(q)}
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full border transition-all ${
                prompt === q.prompt
                  ? "bg-secondary/20 border-secondary text-secondary"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span className="text-sm">{q.icon}</span>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
        <label className="block text-sm font-semibold text-foreground mb-2">
          What kind of email do you need?
        </label>
        <textarea
          rows={4}
          placeholder='e.g., "A friendly follow-up email to a client who requested a home insurance quote last week..."'
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setError("");
            setEmails([]);
            setSendOpenIdx(null);
          }}
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

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="inline-flex items-center gap-2 rounded-md text-sm font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/90 h-11 px-6 transition-all disabled:opacity-50 shadow-sm"
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
          <p className="text-xs text-muted-foreground">
            Tip: be specific about tone, audience, and purpose for best results
          </p>
        </div>
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
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="h-3.5 w-3.5 text-secondary shrink-0"
                  />
                  <span className="text-sm font-semibold text-foreground truncate">
                    {email.subject}
                  </span>
                  {/* Sent badge */}
                  {sentIdx === idx && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Sent ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Copy */}
                  <button
                    onClick={() => handleCopy(email, idx)}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
                  >
                    <FontAwesomeIcon
                      icon={copiedIdx === idx ? faCheck : faCopy}
                      className="h-3 w-3"
                    />
                    {copiedIdx === idx ? "Copied!" : "Copy"}
                  </button>

                  {/* Send */}
                  <div className="relative">
                    <button
                      onClick={() => setSendOpenIdx(sendOpenIdx === idx ? null : idx)}
                      disabled={sendingIdx === idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {sendingIdx === idx ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="h-3 w-3 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
                          Send to...
                        </>
                      )}
                    </button>

                    {/* Contact dropdown */}
                    {sendOpenIdx === idx && (
                      <div className="absolute right-0 top-full mt-1 w-72 bg-card rounded-xl border border-border/50 shadow-lg z-40 overflow-hidden">
                        <div className="p-2 border-b border-border/30">
                          <p className="text-xs font-semibold text-foreground px-3 py-1">
                            Select recipient
                          </p>
                        </div>
                        <div className="max-h-56 overflow-y-auto p-1">
                          {contactsLoading ? (
                            <p className="text-xs text-muted-foreground p-3 text-center">
                              Loading contacts...
                            </p>
                          ) : contacts.length === 0 ? (
                            <p className="text-xs text-muted-foreground p-3 text-center">
                              No contacts yet — add contacts first
                            </p>
                          ) : (
                            contacts.map((contact) => (
                              <button
                                key={contact._id}
                                onClick={() => {
                                  setSelectedContact({ ...selectedContact, [idx]: contact._id });
                                  setSendError("");
                                }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                  selectedContact[idx] === contact._id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                <FontAwesomeIcon
                                  icon={faUser}
                                  className="h-3 w-3 text-muted-foreground shrink-0"
                                />
                                <span className="truncate">
                                  {contact.firstName} {contact.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground truncate ml-auto">
                                  {contact.email}
                                </span>
                              </button>
                            ))
                          )}
                        </div>

                        {sendError && (
                          <p className="text-xs text-destructive px-3 py-2 border-t border-border/30">
                            {sendError}
                          </p>
                        )}

                        {/* Actions */}
                        {selectedContact[idx] && (
                          <div className="flex items-center gap-2 p-3 border-t border-border/30 bg-muted/20">
                            <button
                              onClick={() => handleSend(email, idx)}
                              disabled={sendingIdx === idx}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 transition-colors disabled:opacity-50"
                            >
                              <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3" />
                              Send to {contacts.find((c) => c._id === selectedContact[idx])?.firstName || "..."}
                            </button>
                            <button
                              onClick={() => setSendOpenIdx(null)}
                              className="text-xs text-muted-foreground hover:text-foreground px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
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
