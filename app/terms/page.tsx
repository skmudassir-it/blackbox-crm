import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Blackbox CRM Terms & Conditions — the rules and guidelines for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Blackbox CRM (&ldquo;the Service&rdquo;), operated by AMS IT Services
              (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you agree to be bound by these Terms &amp;
              Conditions. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Description of Service</h2>
            <p>
              Blackbox CRM is a client relationship management platform designed for insurance professionals.
              It provides tools for managing clients, tracking policies, scheduling, email integration, and
              workflow automation.
            </p>
            <p className="mt-2">
              We reserve the right to modify, suspend, or discontinue any aspect of the Service at any time with
              reasonable notice.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. Account Registration</h2>
            <p>
              You must provide accurate, complete, and current information when creating your account. You are
              responsible for maintaining the confidentiality of your login credentials and for all activities
              that occur under your account.
            </p>
            <p className="mt-2">
              You must be at least 18 years old to create an account. You may not share your account credentials
              with others or allow unauthorized access to your account.
            </p>
            <p className="mt-2">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in
              fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. User Data &amp; Content</h2>
            <p>
              You retain ownership of all data and content you upload to Blackbox CRM (&ldquo;Your Data&rdquo;).
              By using the Service, you grant us a limited license to process Your Data solely for the purpose
              of providing and improving the Service.
            </p>
            <p className="mt-2">
              You are responsible for ensuring that Your Data complies with applicable laws and does not infringe
              on the rights of any third party. You represent that you have obtained all necessary consents from
              your clients to store and process their information through Blackbox CRM.
            </p>
            <p className="mt-2">
              We reserve the right to remove content that violates these Terms or applicable law, but we have no
              obligation to monitor user content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Use the Service for any illegal purpose or in violation of any law or regulation</li>
              <li>Upload or transmit viruses, malware, or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems or other users&apos; accounts</li>
              <li>Use the Service to send spam, unsolicited messages, or harass others</li>
              <li>Scrape, data-mine, or extract data from the Service without permission</li>
              <li>Resell, sublicense, or redistribute the Service without a written agreement</li>
              <li>Use the Service to process sensitive data in violation of privacy laws (HIPAA, GDPR, etc.)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Third-Party Integrations</h2>
            <p>
              Blackbox CRM may provide integrations with third-party services (Gmail, Outlook, etc.). Your use of
              these integrations is subject to the third party&apos;s terms and policies. We are not responsible
              for the availability, accuracy, or practices of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              Blackbox CRM, its branding, logo, design, code, and all related materials are the intellectual
              property of AMS IT Services. You may not copy, modify, distribute, or create derivative works
              without our prior written consent.
            </p>
            <p className="mt-2">
              Feedback, suggestions, and feature requests you provide become our property and may be used without
              obligation to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Payment &amp; Billing</h2>
            <p>
              Some features of Blackbox CRM may require a paid subscription. Pricing and billing terms will be
              displayed at the time of purchase. All fees are non-refundable unless otherwise stated or required
              by law.
            </p>
            <p className="mt-2">
              We reserve the right to change pricing with 30 days&apos; notice. Your continued use after a price
              change constitutes acceptance of the new pricing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Limitation of Liability</h2>
            <p>
              <strong>To the fullest extent permitted by law:</strong>
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
                kind, express or implied.
              </li>
              <li>
                We do not guarantee that the Service will be uninterrupted, error-free, or completely secure.
              </li>
              <li>
                AMS IT Services shall not be liable for any indirect, incidental, special, consequential, or
                punitive damages arising from your use of the Service.
              </li>
              <li>
                Our total liability for any claim shall not exceed the amount you paid us in the 12 months
                preceding the claim.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless AMS IT Services, its affiliates, and its personnel from
              any claims, damages, or expenses arising from your use of the Service, your violation of these
              Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">11. Termination</h2>
            <p>
              You may stop using the Service at any time. We may suspend or terminate your access to the Service
              at any time for violation of these Terms, with or without notice.
            </p>
            <p className="mt-2">
              Upon termination, your right to use the Service ceases immediately. We may retain your data for a
              reasonable period as described in our Privacy Policy. You may request data deletion by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. Any disputes
              arising from these Terms shall be resolved through good-faith negotiation, and if necessary, through
              binding arbitration.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via
              email or through the platform. Your continued use after changes take effect constitutes acceptance
              of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">14. Contact</h2>
            <p>
              For questions about these Terms &amp; Conditions, contact us at:
            </p>
            <p className="mt-2 space-y-1">
              <span className="block"><strong>Email:</strong>{" "}
                <a href="mailto:skmudassir.it@gmail.com" className="text-secondary hover:underline font-medium">
                  skmudassir.it@gmail.com
                </a>
              </span>
              <span className="block"><strong>Website:</strong>{" "}
                <a href="https://amsitservices.com" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline font-medium">
                  amsitservices.com
                </a>
              </span>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
