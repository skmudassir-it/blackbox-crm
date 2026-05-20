"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox, faExternalLink, faUserTie, faCode,
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
          Version, purpose, and who built it
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

      {/* What is Blackbox CRM? */}
      <div className="bg-card rounded-2xl border border-border/50 p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FontAwesomeIcon icon={faBox} className="text-primary h-4 w-4" />
          What is Blackbox CRM?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Blackbox CRM is a powerful, all-in-one customer relationship management platform
          designed specifically for insurance agents and small agencies. Manage clients,
          track communications, organize tasks with a Kanban board, and connect your email —
          all from one clean, modern interface.
        </p>
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

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-8">
        Blackbox CRM v1.2.7 — Built with ❤️ by{" "}
        <a href="https://amsitservices.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          AMS IT Services
        </a>
      </p>
    </div>
  );
}
