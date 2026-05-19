import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "Blackbox CRM transformed how I manage my client book. The automated renewal reminders alone have saved me from losing thousands in commissions. I can't imagine running my agency without it.",
    name: "Sarah Mitchell",
    title: "Independent Insurance Agent, 8 years",
    location: "Austin, TX",
  },
  {
    quote:
      "I switched from a generic CRM to Blackbox and the difference is night and day. The commission tracking gives me complete visibility into my earnings. My cross-sell rate is up 40% since using the AI insights.",
    name: "James Rodriguez",
    title: "Agency Owner, State Farm",
    location: "Phoenix, AZ",
  },
  {
    quote:
      "As someone who manages over 500 clients, I needed something that just works. Blackbox is fast, intuitive, and my team picked it up in a day. The mobile app lets me check client details between appointments.",
    name: "Dr. Lisa Chen",
    title: "Senior Agent, Allstate",
    location: "Seattle, WA",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Trusted by Insurance Professionals
          </h2>
          <p className="text-lg text-muted-foreground">
            See why agents across the country are switching to Blackbox CRM.
          </p>
        </div>

        {/* Testimonials + Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Cards */}
          <div className="flex flex-col gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-border/50">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className="h-4 w-4 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-sm text-foreground leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t.title} &middot; {t.location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Image */}
          <div className="relative lg:sticky lg:top-24">
            <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 via-transparent to-primary/10 rounded-2xl blur-3xl" />
            <Image
              src="/images/client-meeting.jpg"
              alt="Insurance agent meeting with clients"
              width={600}
              height={500}
              className="relative rounded-2xl shadow-xl ring-1 ring-border/50 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
