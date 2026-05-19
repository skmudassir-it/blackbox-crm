import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import {
  faUsers,
  faClipboardCheck,
  faChartBar,
  faRobot,
  faStar,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const highlights = [
  { icon: faUsers, title: "Client Profiles", desc: "Complete client info in one place." },
  { icon: faClipboardCheck, title: "Policy Tracking", desc: "Never miss a renewal date." },
  { icon: faChartBar, title: "Commissions", desc: "Track every dollar earned." },
  { icon: faRobot, title: "AI Insights", desc: "Smart cross-sell recommendations." },
];

const testimonials = [
  {
    quote:
      "Blackbox CRM transformed how I manage my client book. The automated renewal reminders alone have saved me from losing thousands in commissions.",
    name: "Sarah Mitchell",
    title: "Independent Insurance Agent, 8 years",
  },
  {
    quote:
      "My cross-sell rate is up 40% since using the AI insights. The commission tracking gives me complete visibility into my earnings.",
    name: "James Rodriguez",
    title: "Agency Owner, State Farm",
  },
  {
    quote:
      "As someone who manages over 500 clients, I needed something that just works. My team picked it up in a day.",
    name: "Dr. Lisa Chen",
    title: "Senior Agent, Allstate",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="flex flex-col gap-6">
              <Badge variant="secondary" className="w-fit text-xs font-medium px-3 py-1">
                <Icon icon={faRobot} className="mr-1.5 text-primary" /> Now in Public Beta
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Your Clients,{" "}
                <span className="text-primary">Organized</span>.
                Your Business,{" "}
                <span className="text-secondary">Growing</span>.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Blackbox CRM is the all-in-one client management platform built
                exclusively for insurance agents. Track policies, automate renewals,
                manage commissions, and never miss a follow-up again.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 shadow-sm transition-all"
                >
                  Start Free Trial <Icon icon={faArrowRight} />
                </Link>
                <Link
                  href="/features"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 transition-all"
                >
                  See Features
                </Link>
              </div>
              <p className="text-xs text-muted-foreground">
                No credit card required · 14-day free trial · Cancel anytime
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-2xl blur-3xl" />
              <Image
                src="/images/hero-dashboard.jpg"
                alt="Blackbox CRM Dashboard"
                width={720}
                height={480}
                className="relative rounded-2xl shadow-2xl ring-1 ring-border/50"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Everything You Need to Run Your Agency
            </h2>
            <p className="text-lg text-muted-foreground">
              From client onboarding to commission tracking — Blackbox handles
              the busywork so you can focus on relationships.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((f) => (
              <Card key={f.title} className="border-border/50 hover:border-secondary/50 hover:shadow-md transition-all group">
                <CardHeader>
                  <Icon icon={f.icon} size="2xl" className="text-secondary mb-2 group-hover:text-primary transition-colors" />
                  <CardTitle className="text-base font-semibold">{f.title}</CardTitle>
                  <CardDescription className="text-sm">{f.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/features"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
            >
              View all features <Icon icon={faArrowRight} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
              Trusted by Insurance Professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} icon={faStar} className="text-accent w-4 h-4" size="sm" />
                    ))}
                  </div>
                  <blockquote className="text-sm text-foreground leading-relaxed mb-3">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/tech-innovation.jpg" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Ready to Transform Your Agency?
            </h2>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Join thousands of insurance agents who trust Blackbox CRM. Start
              your free 14-day trial — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-white text-primary hover:bg-white/90 h-11 px-8 transition-all"
              >
                Start Free Trial <Icon icon={faArrowRight} />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold border border-white/30 text-white hover:bg-white/10 h-11 px-8 transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
