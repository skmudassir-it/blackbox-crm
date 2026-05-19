import type { Metadata } from "next";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import {
  faUsers,
  faClipboardCheck,
  faArrowsRotate,
  faChartBar,
  faRobot,
  faMobileScreen,
  faEnvelope,
  faChartLine,
  faLock,
  faPlug,
  faPeopleGroup,
  faFilePen,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore Blackbox CRM's powerful features built for insurance agents — client management, policy tracking, automated renewals, commission tracking, AI insights, and more.",
};

const allFeatures = [
  {
    icon: faUsers,
    title: "Client Profiles",
    description:
      "Store complete client information — contact details, policies, dependents, notes, communication history, and document attachments — all in one searchable place. Segment clients by policy type, life stage, or custom tags.",
  },
  {
    icon: faClipboardCheck,
    title: "Policy Management",
    description:
      "Track every policy across life, auto, home, health, and commercial lines. Monitor renewal dates, premium amounts, coverage limits, deductibles, and carrier details. Set custom alerts for upcoming expirations.",
  },
  {
    icon: faArrowsRotate,
    title: "Automated Renewals",
    description:
      "Set up automatic email and SMS reminders for policy renewals at 90, 60, 30, and 7 days before expiration. Customize message templates. Track renewal status and retention rates across your book of business.",
  },
  {
    icon: faChartBar,
    title: "Commission Tracking",
    description:
      "Track every commission dollar with precision. See projected vs. actual earnings, paid vs. pending breakdowns, carrier-level reporting, and year-over-year trends. Export commission data for accounting.",
  },
  {
    icon: faRobot,
    title: "AI-Powered Insights",
    description:
      "Get intelligent recommendations powered by machine learning. Identify cross-sell opportunities, flag at-risk clients, suggest optimal outreach timing, and predict policy lapse probability before it happens.",
  },
  {
    icon: faMobileScreen,
    title: "Mobile Ready",
    description:
      "Access your entire book of business from any device. Fully responsive design works seamlessly on phones, tablets, and desktops. Check client details, log notes, and review renewals on the go.",
  },
  {
    icon: faEnvelope,
    title: "Email & SMS Integration",
    description:
      "Send personalized emails and text messages directly from the CRM. Use templates for common communications. Track open rates and responses. Automate drip campaigns for new clients and renewals.",
  },
  {
    icon: faChartLine,
    title: "Advanced Analytics",
    description:
      "Visualize your agency's performance with interactive dashboards. Track client growth, revenue trends, policy mix, carrier performance, and agent productivity. Export custom reports as PDF or CSV.",
  },
  {
    icon: faLock,
    title: "Enterprise Security",
    description:
      "Bank-grade encryption for all client data. Role-based access controls for team members. Two-factor authentication. Full audit logs. SOC 2 compliant infrastructure. Your clients' data is safe with us.",
  },
  {
    icon: faPlug,
    title: "Integrations",
    description:
      "Connect Blackbox CRM with your existing tools. Integrate with popular insurance CRMs, accounting software, email providers, calendar apps, and more through our REST API and webhook system.",
  },
  {
    icon: faPeopleGroup,
    title: "Team Collaboration",
    description:
      "Work together seamlessly. Assign clients to team members, share notes, transfer policies, and track team performance. Real-time updates keep everyone on the same page.",
  },
  {
    icon: faFilePen,
    title: "Document Management",
    description:
      "Store and organize policy documents, applications, claims paperwork, and client correspondence. Search by client, policy number, or document type. Never dig through filing cabinets again.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              Powerful Features
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Built for Insurance Agents,{" "}
              <span className="text-secondary">Not Developers</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every feature in Blackbox CRM was designed with input from working
              insurance agents. No generic CRM bloat — just the tools you need to
              manage clients, track policies, and grow your business.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allFeatures.map((f) => (
              <Card key={f.title} className="border-border/50 hover:border-secondary/50 hover:shadow-md transition-all group">
                <CardHeader>
                  <Icon icon={f.icon} size="2xl" className="text-secondary mb-3 group-hover:text-primary transition-colors" />
                  <CardTitle className="text-lg font-semibold">{f.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {f.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start your free 14-day trial. No credit card required.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 transition-all"
          >
            Get Started Free <Icon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </>
  );
}
