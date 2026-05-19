import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Blackbox CRM. Start your free trial, request a demo, or ask us anything. We're here to help insurance agents succeed.",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              Get Started
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Let&apos;s{" "}
              <span className="text-secondary">Talk</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Ready to transform how you manage your insurance agency? Fill out
              the form below or reach out directly — we&apos;ll get back to you
              within one business day.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Options */}
      <section>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Email */}
            <Card className="border-border/50 hover:border-secondary/50 transition-colors text-center">
              <CardContent className="pt-8 pb-6">
                <span className="text-4xl mb-4 block">📧</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Email Us
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Reach out for trials, demos, or questions.
                </p>
                <a
                  href="mailto:hello@amsitservices.com"
                  className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors"
                >
                  hello@amsitservices.com
                </a>
              </CardContent>
            </Card>

            {/* Trial */}
            <Card className="border-secondary bg-secondary/5 text-center shadow-lg shadow-secondary/10">
              <CardContent className="pt-8 pb-6">
                <span className="text-4xl mb-4 block">🚀</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start Free Trial
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  14 days free. No credit card required.
                </p>
                <a
                  href="mailto:hello@amsitservices.com?subject=Blackbox%20CRM%20-%20Start%20Free%20Trial"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 w-full"
                >
                  Start Trial
                </a>
              </CardContent>
            </Card>

            {/* Demo */}
            <Card className="border-border/50 hover:border-secondary/50 transition-colors text-center">
              <CardContent className="pt-8 pb-6">
                <span className="text-4xl mb-4 block">🎥</span>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Request a Demo
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  See Blackbox CRM in action with a live walkthrough.
                </p>
                <a
                  href="mailto:hello@amsitservices.com?subject=Blackbox%20CRM%20-%20Request%20Demo"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 w-full"
                >
                  Book Demo
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-card rounded-2xl border border-border/50 p-8 sm:p-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground mb-2">
              Send Us a Message
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              Tell us about your agency and how we can help. We typically respond
              within a few hours during business days.
            </p>

            <form
              action="https://formspree.io/f/hello@amsitservices.com"
              method="POST"
              className="space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                    placeholder="john@agency.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="agency"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Agency Name
                </label>
                <input
                  type="text"
                  id="agency"
                  name="agency"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  placeholder="Smith Insurance Agency"
                />
              </div>

              <div>
                <label
                  htmlFor="clients"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Approximate Number of Clients
                </label>
                <select
                  id="clients"
                  name="clients"
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                >
                  <option value="">Select...</option>
                  <option value="1-50">1 – 50</option>
                  <option value="51-100">51 – 100</option>
                  <option value="101-250">101 – 250</option>
                  <option value="251-500">251 – 500</option>
                  <option value="501-1000">501 – 1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors resize-none"
                  placeholder="Tell us about your needs and how we can help..."
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 transition-colors"
              >
                Send Message
              </button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our{" "}
                <Link href="#" className="text-secondary hover:underline">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="#" className="text-secondary hover:underline">
                  Terms of Service
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Alternative Contact */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="text-sm text-muted-foreground">
            Prefer to reach out directly?{" "}
            <a
              href="mailto:hello@amsitservices.com"
              className="text-secondary hover:underline font-medium"
            >
              hello@amsitservices.com
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
