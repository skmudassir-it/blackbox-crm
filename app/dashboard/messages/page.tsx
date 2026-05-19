"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faInbox, faSearch, faPlug, faCheck, faExternalLinkAlt, faClock, faServer, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons";

interface EmailConfig {
  id: string;
  provider: "gmail" | "outlook" | "smtp";
  email: string;
  connected: boolean;
  createdAt: string;
}

// Simulated email configurations (in real app, stored in DB)
let mockConfigs: EmailConfig[] = [];

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [showConfig, setShowConfig] = useState<string | null>(null);
  const [configForm, setConfigForm] = useState({ email: "", smtpHost: "", smtpPort: "587", smtpUser: "", smtpPass: "" });
  const [configs, setConfigs] = useState<EmailConfig[]>(mockConfigs);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const connectedGmail = configs.find((c) => c.provider === "gmail" && c.connected);
  const connectedOutlook = configs.find((c) => c.provider === "outlook" && c.connected);
  const connectedSmtp = configs.filter((c) => c.provider === "smtp" && c.connected);

  function startConfig(provider: string) {
    setShowConfig(provider);
    setConfigForm({ email: "", smtpHost: "smtp.gmail.com", smtpPort: "587", smtpUser: "", smtpPass: "" });
    setMessage(null);
  }

  async function handleConnect() {
    setConnecting(true);
    setMessage(null);

    try {
      // Simulate OAuth / SMTP connection
      await new Promise((r) => setTimeout(r, 2000));

      const newConfig: EmailConfig = {
        id: Date.now().toString(),
        provider: showConfig as EmailConfig["provider"],
        email: configForm.email || `${showConfig}@connected.com`,
        connected: true,
        createdAt: new Date().toISOString(),
      };

      // Replace existing config for same provider
      const updated = configs.filter((c) => c.provider !== showConfig).concat(newConfig);
      setConfigs(updated);
      mockConfigs = updated;
      setShowConfig(null);
      setMessage({ type: "success", text: `Successfully connected to ${showConfig === "gmail" ? "Gmail" : showConfig === "outlook" ? "Outlook" : "SMTP server"}!` });
    } catch {
      setMessage({ type: "error", text: "Connection failed. Please check your credentials." });
    }
    setConnecting(false);
  }

  function handleDisconnect(id: string) {
    const updated = configs.filter((c) => c.id !== id);
    setConfigs(updated);
    mockConfigs = updated;
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 ${
          message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          <FontAwesomeIcon icon={message.type === "success" ? faCheck : faEnvelope} className="shrink-0" />
          {message.text}
        </div>
      )}

      {/* Integration Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Email Integrations</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Gmail */}
          <div className={`bg-card rounded-2xl border p-6 flex flex-col hover:shadow-md transition-all ${connectedGmail ? "border-green-300 bg-green-50/30" : "border-border/50"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#EA433515" }}>
                <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" style={{ color: "#EA4335" }} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gmail</h3>
                <p className="text-xs text-muted-foreground">{connectedGmail ? connectedGmail.email : "Not connected"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
              Connect Gmail to send/receive emails, auto-log conversations to client profiles, and sync your calendar.
            </p>
            {connectedGmail ? (
              <button onClick={() => handleDisconnect(connectedGmail.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 h-10 px-4 transition-all">
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" /> Disconnect
              </button>
            ) : showConfig === "gmail" ? (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Gmail Address</label>
                  <input value={configForm.email} onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@gmail.com" />
                </div>
                <p className="text-xs text-muted-foreground">Google OAuth will open in a popup to authorize access.</p>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfig(null)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-9 transition-all">Cancel</button>
                  <button onClick={handleConnect} disabled={connecting}
                    className="flex-1 rounded-lg text-sm font-semibold text-white h-9 transition-all disabled:opacity-50"
                    style={{ backgroundColor: "#EA4335" }}>
                    {connecting ? "Connecting..." : "Authorize"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => startConfig("gmail")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border-2 border-border hover:border-primary text-foreground hover:text-primary h-10 px-4 transition-all">
                <FontAwesomeIcon icon={faPlug} className="h-3.5 w-3.5" /> Connect Gmail
              </button>
            )}
          </div>

          {/* Outlook */}
          <div className={`bg-card rounded-2xl border p-6 flex flex-col hover:shadow-md transition-all ${connectedOutlook ? "border-blue-300 bg-blue-50/30" : "border-border/50"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#0078D415" }}>
                <FontAwesomeIcon icon={faMicrosoft} className="h-5 w-5" style={{ color: "#0078D4" }} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Outlook</h3>
                <p className="text-xs text-muted-foreground">{connectedOutlook ? connectedOutlook.email : "Not connected"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
              Link Microsoft 365 for seamless email, calendar, and contact sync with your CRM.
            </p>
            {connectedOutlook ? (
              <button onClick={() => handleDisconnect(connectedOutlook.id)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 h-10 px-4 transition-all">
                <FontAwesomeIcon icon={faTrash} className="h-3.5 w-3.5" /> Disconnect
              </button>
            ) : showConfig === "outlook" ? (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Outlook Email</label>
                  <input value={configForm.email} onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@outlook.com" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfig(null)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-9 transition-all">Cancel</button>
                  <button onClick={handleConnect} disabled={connecting}
                    className="flex-1 rounded-lg text-sm font-semibold text-white h-9 transition-all disabled:opacity-50"
                    style={{ backgroundColor: "#0078D4" }}>
                    {connecting ? "Connecting..." : "Authorize"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => startConfig("outlook")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border-2 border-border hover:border-primary text-foreground hover:text-primary h-10 px-4 transition-all">
                <FontAwesomeIcon icon={faPlug} className="h-3.5 w-3.5" /> Connect Outlook
              </button>
            )}
          </div>

          {/* Custom SMTP */}
          <div className={`bg-card rounded-2xl border p-6 flex flex-col hover:shadow-md transition-all ${connectedSmtp.length > 0 ? "border-gray-400 bg-gray-50/30" : "border-border/50"}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-muted">
                <FontAwesomeIcon icon={faServer} className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Custom SMTP</h3>
                <p className="text-xs text-muted-foreground">{connectedSmtp.length > 0 ? `${connectedSmtp.length} server(s)` : "Not connected"}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
              Use your own email server. Configure custom sending domains and maintain full control.
            </p>
            {connectedSmtp.length > 0 ? (
              <div className="space-y-2">
                {connectedSmtp.map((c) => (
                  <div key={c.id} className="flex items-center justify-between text-xs bg-background rounded-lg px-3 py-2 border border-border/40">
                    <span className="text-foreground font-medium">{c.email}</span>
                    <button onClick={() => handleDisconnect(c.id)} className="text-red-500 hover:text-red-700"><FontAwesomeIcon icon={faTrash} className="h-3 w-3" /></button>
                  </div>
                ))}
                <button onClick={() => startConfig("smtp")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-xs font-medium border border-input bg-background hover:bg-muted h-8 transition-all">
                  <FontAwesomeIcon icon={faPlus} style={{ fontSize: '10px' }} /> Add Server
                </button>
              </div>
            ) : showConfig === "smtp" ? (
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">SMTP Host</label>
                  <input value={configForm.smtpHost} onChange={(e) => setConfigForm({ ...configForm, smtpHost: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="smtp.gmail.com" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Port</label>
                    <input value={configForm.smtpPort} onChange={(e) => setConfigForm({ ...configForm, smtpPort: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="587" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                    <input value={configForm.email} onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="you@domain.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Username</label>
                  <input value={configForm.smtpUser} onChange={(e) => setConfigForm({ ...configForm, smtpUser: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="SMTP username" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Password / App Password</label>
                  <input type="password" value={configForm.smtpPass} onChange={(e) => setConfigForm({ ...configForm, smtpPass: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="••••••••" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfig(null)} className="flex-1 rounded-lg text-sm font-medium border border-input bg-background hover:bg-accent h-9 transition-all">Cancel</button>
                  <button onClick={handleConnect} disabled={connecting}
                    className="flex-1 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-9 transition-all disabled:opacity-50">
                    {connecting ? "Testing..." : "Connect"}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => startConfig("smtp")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium border-2 border-border hover:border-primary text-foreground hover:text-primary h-10 px-4 transition-all">
                <FontAwesomeIcon icon={faPlug} className="h-3.5 w-3.5" /> Configure SMTP
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Messages</h2>
          <div className="relative w-64">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Search messages..." />
          </div>
        </div>
        {configs.filter((c) => c.connected).length === 0 ? (
          <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faInbox} className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">No Messages Yet</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Connect an email account above to see your messages here.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="h-3 w-3" /> Real-time sync</span>
              <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" /> Auto-log to clients</span>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-2xl border border-border/50 p-6 text-center text-sm text-muted-foreground">
            Email sync active — messages will appear here as they arrive.
          </div>
        )}
      </div>

      {/* Tip */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 flex items-start gap-4">
        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Pro Tip</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Connect Gmail for automatic email-to-client logging and calendar sync. Use SMTP for custom domains and white-labeled email delivery.
          </p>
        </div>
      </div>
    </div>
  );
}
