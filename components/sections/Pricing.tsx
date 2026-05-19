import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Simple Pricing
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Plans That Scale With Your Agency
          </h2>
          <p className="text-lg text-muted-foreground">
            No hidden fees. No surprise charges. Just straightforward pricing that
            grows with your business.
          </p>
        </div>

        {/* Cards */}
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
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.description}
                </p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground">
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
                    <svg
                      className="h-5 w-5 text-secondary shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-11 px-8 w-full ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {plan.popular ? "Start Free Trial" : "Get Started"}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
