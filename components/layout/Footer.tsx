import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin, faXTwitter } from "@fortawesome/free-brands-svg-icons";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Support", href: "mailto:hello@amsitservices.com" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/images/logo.jpg"
                alt="Blackbox CRM"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-lg font-extrabold tracking-tight text-primary">
                Blackbox<span className="text-secondary">CRM</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Intelligent client management for insurance professionals. Built
              with <Icon icon={faHeart} className="text-red-500" /> by{" "}
              <a
                href="https://amsitservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline font-medium"
              >
                AMS IT Services
              </a>
              .
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/skmudassir-it"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Icon icon={faGithub} className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Icon icon={faLinkedin} className="w-4 h-4" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <Icon icon={faXTwitter} className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-foreground mb-3">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Blackbox CRM. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Developed by Mudassir —{" "}
            <a
              href="https://amsitservices.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-secondary hover:underline font-medium"
            >
              amsitservices.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
