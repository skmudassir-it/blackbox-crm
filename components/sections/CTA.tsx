import Image from "next/image";

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src="/images/tech-innovation.jpg"
          alt=""
          fill
          className="object-cover"
          priority={false}
        />
        <div className="absolute inset-0 bg-primary/90 backdrop-blur-sm" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to Transform Your Agency?
          </h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Join thousands of insurance agents who trust Blackbox CRM to manage
            their clients, track policies, and grow their business. Start your
            free 14-day trial today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:hello@amsitservices.com?subject=Blackbox%20CRM%20Trial"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-white text-primary hover:bg-white/90 h-11 px-8"
            >
              Start Free Trial
            </a>
            <a
              href="mailto:hello@amsitservices.com?subject=Blackbox%20CRM%20Demo"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white/10 h-11 px-8"
            >
              Request a Demo
            </a>
          </div>
          <p className="text-sm text-white/60 mt-6">
            Questions? Email us at{" "}
            <a
              href="mailto:hello@amsitservices.com"
              className="text-white underline hover:text-white/80"
            >
              hello@amsitservices.com
            </a>
          </p>
        </div>
      </div>

      {/* Growth visual below CTA */}
      <div className="relative bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <Image
            src="/images/growth.jpg"
            alt="Business growth visualization"
            width={1100}
            height={300}
            className="rounded-2xl shadow-lg ring-1 ring-border/50 w-full object-cover max-h-72"
          />
        </div>
      </div>
    </section>
  );
}
