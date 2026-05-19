import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit text-xs font-medium px-3 py-1">
              🚀 Now in Public Beta
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1]">
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
<a href="#cta" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">Start Free Trial</a>
<a href="#features" className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">See How It Works</a>
            </div>
            <p className="text-xs text-muted-foreground">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>

          {/* Image */}
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
  );
}
