"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, faCode, faServer, faDatabase, faEnvelope,
  faPalette, faShieldHalved, faCheckCircle, faExternalLink,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faBox} className="text-primary h-5 w-5" />
          About Blackbox CRM
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Everything you need to know about the platform
        </p>
      </div>

      {/* Version card */}
      <div className="bg-card rounded-2xl border border-border/50 p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faBox} className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Blackbox CRM</h3>
            <p className="text-sm text-muted-foreground">
              Version <span className="font-mono font-semibold text-foreground">1.2.7</span>
              {" "}— Released May 2026
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faUserTie} className="text-secondary h-4 w-4" />
          What is Blackbox CRM?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Blackbox CRM is a powerful, all-in-one customer relationship management platform
          designed specifically for insurance agents and small agencies. Manage clients,
          track communications, organize tasks with a Kanban board, and connect your email —
          all from one clean, modern interface.
        </p>
      </div>

      {/* Features */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 h-4 w-4" />
          Core Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: faBox, label: "Dashboard", desc: "Overview of your CRM activity" },
            { icon: faUserTie, label: "Clients", desc: "Manage and track your client base" },
            { icon: faEnvelope, label: "Messages", desc: "Gmail, Outlook & SMTP integration" },
            { icon: faCheckCircle, label: "To-Do", desc: "Task management with priorities" },
            { icon: faPalette, label: "Kanban", desc: "Visual drag-and-drop workflow board" },
            { icon: faDatabase, label: "Dictionary", desc: "Document & resource library" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
              <FontAwesomeIcon icon={item.icon} className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faCode} className="text-primary h-4 w-4" />
          Tech Stack
        </h3>
        <div className="space-y-2">
          {[
            { label: "Frontend", value: "Next.js 16 + React + Tailwind CSS + shadcn/ui" },
            { label: "Backend", value: "Express.js + TypeScript" },
            { label: "Database", value: "MongoDB (via Mongoose)" },
            { label: "Storage", value: "MinIO S3-compatible object storage" },
            { label: "Auth", value: "JWT (JSON Web Tokens) + bcrypt" },
            { label: "Deployment", value: "Docker containers on Dokploy" },
            { label: "Email", value: "Google Gmail API + Nodemailer SMTP" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/30 transition-colors">
              <span className="text-sm font-medium text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground text-right ml-4">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Developer */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-3">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faCode} className="text-secondary h-4 w-4" />
          Developer
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <FontAwesomeIcon icon={faUserTie} className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Mudassir (AMS IT Services)</p>
            <a
              href="https://amsitservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              amsitservices.com
              <FontAwesomeIcon icon={faExternalLink} className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-2">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500 h-4 w-4" />
          Security & Privacy
        </h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-emerald-500 shrink-0" />
            All passwords are hashed with bcrypt (never stored in plain text)
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-emerald-500 shrink-0" />
            JWT-based authentication with automatic token verification
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-emerald-500 shrink-0" />
            Email credentials encrypted at rest and transmitted over HTTPS
          </li>
          <li className="flex items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="h-3 w-3 text-emerald-500 shrink-0" />
            Google OAuth 2.0 — we never see your Gmail password
          </li>
        </ul>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-8">
        Blackbox CRM v1.2.7 — Built with ❤️ by <a href="https://amsitservices.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">AMS IT Services</a>
      </p>
    </div>
  );
}
