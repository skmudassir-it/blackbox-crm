import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    icon: "👥",
    title: "Client Profiles",
    description:
      "Store complete client information: contact details, policies, dependents, notes, and communication history in one place.",
  },
  {
    icon: "📋",
    title: "Policy Management",
    description:
      "Track every policy — life, auto, home, health. Monitor renewal dates, premiums, coverage limits, and never let a policy lapse.",
  },
  {
    icon: "🔄",
    title: "Automated Renewals",
    description:
      "Set up automatic reminders for policy renewals. Email and SMS notifications keep your clients informed and your retention high.",
  },
  {
    icon: "📊",
    title: "Commission Tracking",
    description:
      "Track every commission dollar. See projected earnings, paid vs pending, and carrier breakdowns at a glance.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    description:
      "Get smart recommendations: cross-sell opportunities, at-risk clients, and optimal outreach timing powered by machine learning.",
  },
  {
    icon: "📱",
    title: "Mobile Ready",
    description:
      "Access your entire book of business from any device. Responsive design means you can work from the office, home, or on the road.",
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Powerful Features
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Everything You Need to Run Your Agency
          </h2>
          <p className="text-lg text-muted-foreground">
            From client onboarding to commission tracking, Blackbox CRM handles
            the busywork so you can focus on building relationships.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="border-border/50 hover:border-secondary/50 transition-colors">
              <CardHeader>
                <span className="text-3xl mb-2 block">{f.icon}</span>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {f.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
