import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Icon from "@/components/ui/icon";
import { faCheck, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple, transparent pricing for Blackbox CRM. Plans starting at $25/month. Includes client management, policy tracking, automated renewals, and AI-powered insights.",
};

const plans = [
  {
    name: "Starter",
    price: 25,
    clients: 100,
    extraPerClient: 2.0,
    description: "Perfect for solo agents just getting started.",
    features: [
      "Up to 100 clients",
      "Policy tracking",
      "Renewal reminders",
      "Basic reporting",
      "Email support",
      "Mobile app access",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: 45,
    clients: 250,
    extraPerClient: 1.5,
    description: "For growing agencies with an active client base.",
    features: [
      "Up to 250 clients",
      "Everything in Starter",
      "Commission tracking",
      "AI-powered insights",
      "SMS notifications",
      "Priority support",
      "Team access (up to 3)",
      "CSV import/export",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 65,
    clients: 1000,
    extraPerClient: 1.0,
    description: "For established agencies managing large books of business.",
    features: [
      "Up to 1,000 clients",
      "Everything in Professional",
      "Unlimited team members",
      "Custom integrations",
      "Dedicated account manager",
      "API access",
      "White-label option",
      "SSO & advanced security",
    ],
    popular: false,
  },
];

const faqs = [
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Upgrades take effect immediately, and downgrades apply at the next billing cycle. We'll prorate any difference.",
  },
  {
    q: "What counts as a 'client'?",
    a: "A client is any individual or business profile in your CRM. Each client can have multiple policies, notes, and documents. Additional clients beyond your plan limit are billed at the per-client rate shown above.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes! Every plan comes with a 14-day free trial. No credit card required. You get full access to all features during the trial period.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, you can cancel your subscription at any time. Your data will be available for export for 30 days after cancellation. No long-term contracts or hidden fees.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes! Switch to annual billing and save 20% on any plan. Contact our sales team for details on annual pricing.",
  },
  {
    q: "What kind of support do you offer?",
    a: "All plans include email support. Professional and Enterprise plans include priority support with faster response times. Enterprise customers get a dedicated account manager.",
  },
];

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              Simple Pricing
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Plans That Scale With{" "}
              <span className="text-secondary">Your Agency</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              No hidden fees. No surprise charges. Just straightforward pricing
              that grows with your business.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-8 flex flex-col gap-5 ${
                  plan.popular
                    ? "border-secondary bg-secondary/5 shadow-lg shadow-secondary/10"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground font-semibold">
                    Most Popular
                  </Badge>
                )}
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-foreground">
                    ${plan.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Includes up to{" "}
                  <span className="font-semibold text-foreground">
                    {plan.clients.toLocaleString()} clients
                  </span>
                  <br />
                  ${plan.extraPerClient.toFixed(2)} per additional client
                </p>
                <Separator />
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Icon icon={faCheck} className="text-secondary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold h-11 px-8 w-full text-center transition-all ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {plan.popular ? "Start Free Trial" : "Get Started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-border/40 rounded-xl p-6 hover:border-secondary/40 transition-colors">
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-4">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-6">
            We&apos;re happy to help you find the right plan for your agency.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 transition-all"
          >
            Contact Sales <Icon icon={faArrowRight} />
          </Link>
        </div>
      </section>
    </>
  );
}
