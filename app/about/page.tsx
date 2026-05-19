import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Blackbox CRM — the intelligent client management platform built for insurance agents. Developed by Mudassir at AMS IT Services.",
};

const values = [
  {
    icon: "🎯",
    title: "Insurance-First",
    desc: "Built exclusively for insurance agents, not a generic CRM with insurance slapped on. Every feature solves a real insurance workflow problem.",
  },
  {
    icon: "⚡",
    title: "Simple by Design",
    desc: "We believe powerful tools should be easy to use. No bloated interfaces, no 50-step workflows. Just what you need, where you need it.",
  },
  {
    icon: "🔒",
    title: "Trust & Security",
    desc: "Your clients' data is sacred. Bank-grade encryption, SOC 2 compliance, and a commitment to never sell or share your data — ever.",
  },
  {
    icon: "🤝",
    title: "Customer Success",
    desc: "Your success is our success. We provide onboarding support, training resources, and responsive support to help you get the most out of Blackbox.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 text-xs font-medium px-3 py-1">
              About Us
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
              Built for Insurance Agents,{" "}
              <span className="text-secondary">by People Who Understand</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Blackbox CRM was born from a simple observation: insurance agents
              deserve better tools. We&apos;re on a mission to help agents spend
              less time on paperwork and more time building relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
                Our Story
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                After years of watching insurance agents struggle with generic CRMs
                that weren&apos;t built for their workflow, we decided to build
                something better. Blackbox CRM combines deep insurance domain
                knowledge with modern technology to create a platform that actually
                makes agents&apos; lives easier.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We started by talking to hundreds of agents — independent brokers,
                captive agents, and agency owners. We learned about their pain
                points: missed renewals costing commissions, scattered client data
                across spreadsheets and sticky notes, and CRMs that required a
                computer science degree to operate.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Blackbox CRM is the answer. Purpose-built, intuitive, and powerful
                enough to handle books of business from 50 to 5,000 clients.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-bl from-secondary/20 via-transparent to-primary/10 rounded-2xl blur-3xl" />
              <Image
                src="/images/client-meeting.jpg"
                alt="Insurance agent meeting with clients"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-xl ring-1 ring-border/50 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-center mb-12">
            What We Believe
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((v) => (
              <Card key={v.title} className="border-border/50 text-center">
                <CardContent className="pt-6">
                  <span className="text-4xl mb-4 block">{v.icon}</span>
                  <h3 className="text-base font-semibold text-foreground mb-2">
                    {v.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Developer */}
      <section>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-4">
              Developed by Mudassir
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Blackbox CRM is built and maintained by Mudassir at{" "}
              <a
                href="https://amsitservices.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:underline font-medium"
              >
                AMS IT Services
              </a>
              , a technology consultancy specializing in web development, business
              automation, and digital transformation for small and medium
              businesses.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With expertise in full-stack development, cloud infrastructure, and
              AI/ML, AMS IT Services delivers production-grade software that
              businesses can rely on. Blackbox CRM represents our commitment to
              building tools that make a real difference in people&apos;s daily work.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
