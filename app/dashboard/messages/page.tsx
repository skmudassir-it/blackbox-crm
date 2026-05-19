"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faInbox,
  faPaperPlane,
  faSearch,
  faPlug,
  faCheck,
  faExternalLinkAlt,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const integrations = [
  {
    id: "gmail",
    name: "Gmail",
    icon: faGoogle,
    color: "#EA4335",
    description: "Connect your Gmail account to send and receive emails directly from Blackbox CRM. View client conversations, auto-log emails to client profiles, and use templates.",
    connected: false,
  },
  {
    id: "outlook",
    name: "Outlook / Microsoft 365",
    icon: faEnvelope,
    color: "#0078D4",
    description: "Link your Microsoft 365 email for seamless communication. Sync contacts, calendars, and emails with your CRM workflow.",
    connected: false,
  },
  {
    id: "smtp",
    name: "Custom SMTP",
    icon: faPaperPlane,
    color: "#6B7280",
    description: "Use your own email server or provider via SMTP. Configure custom sending domains and maintain full control over your email infrastructure.",
    connected: false,
  },
];

export default function MessagesPage() {
  const [search, setSearch] = useState("");
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (id: string) => {
    setConnecting(id);
    // Simulate connection attempt
    await new Promise((r) => setTimeout(r, 1500));
    setConnecting(null);
  };

  return (
    <div className="space-y-6">
      {/* Integration Cards */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Email Integrations
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-card rounded-2xl border border-border/50 p-6 flex flex-col hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${integration.color}15` }}
                >
                  <FontAwesomeIcon
                    icon={integration.icon}
                    className="h-5 w-5"
                    style={{ color: integration.color }}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {integration.connected ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                {integration.description}
              </p>

              <button
                onClick={() => handleConnect(integration.id)}
                disabled={connecting === integration.id || integration.connected}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium h-10 px-4 transition-all ${
                  integration.connected
                    ? "bg-muted text-muted-foreground cursor-default"
                    : "border-2 border-border hover:border-primary text-foreground hover:text-primary"
                }`}
              >
                {integration.connected ? (
                  <>
                    <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 text-green-500" />
                    Connected
                  </>
                ) : connecting === integration.id ? (
                  <>
                    <div className="animate-spin h-3.5 w-3.5 border-2 border-primary border-t-transparent rounded-full" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPlug} className="h-3.5 w-3.5" />
                    Connect {integration.name}
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Messages
          </h2>
          <div className="relative w-64">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3.5 w-3.5"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-lg border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faInbox} className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-2">
            No Messages Yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Connect your Gmail account above to see your emails here. Once
            connected, you can read, reply, and compose emails directly from
            Blackbox CRM.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
              Real-time sync
            </div>
            <div className="flex items-center gap-1.5">
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
              Auto-log to clients
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tip */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-2xl p-5 flex items-start gap-4">
        <FontAwesomeIcon
          icon={faEnvelope}
          className="h-5 w-5 text-secondary shrink-0 mt-0.5"
        />
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">
            Pro Tip: Gmail + Calendar Sync
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you connect Gmail, Blackbox CRM can automatically sync your
            calendar events and log email conversations to the relevant client
            profiles. No more switching between tabs to find client
            correspondence.
          </p>
        </div>
      </div>
    </div>
  );
}
