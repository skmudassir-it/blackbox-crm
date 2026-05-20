import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Blackbox CRM Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-muted-foreground mb-10">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <div className="prose prose-neutral max-w-none space-y-8 text-sm leading-relaxed text-foreground/85">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">1. Introduction</h2>
            <p>
              Blackbox CRM (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
              our platform at <strong>blackbox.amsitservices.com</strong> and any related services.
            </p>
            <p className="mt-2">
              By using Blackbox CRM, you agree to the collection and use of information in accordance with this policy.
              If you do not agree, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.1 Account Information</h3>
            <p>
              When you create an account, we collect your name, email address, agency name, and a password
              (hashed — we never store plain-text passwords).
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.2 Client Data You Provide</h3>
            <p>
              In using Blackbox CRM, you may upload or enter information about your clients, including names,
              contact details, policy information, communication history, and documents. This data belongs to you
              and is only processed to provide the service.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.3 Third-Party Integrations</h3>
            <p>
              If you connect third-party services (such as Gmail via OAuth), we access only the data necessary to
              provide the integration (e.g., reading and sending emails on your behalf). We do not store your
              Gmail password — we use secure OAuth tokens. You can revoke access at any time.
            </p>

            <h3 className="text-base font-semibold text-foreground mt-4 mb-2">2.4 Automatically Collected Data</h3>
            <p>
              We may collect standard server logs (IP address, browser type, pages visited, timestamps) for
              security and analytics purposes. We do not use third-party tracking cookies or advertising networks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Provide, maintain, and improve Blackbox CRM</li>
              <li>Authenticate your account and keep it secure</li>
              <li>Send service-related communications (password resets, billing notifications)</li>
              <li>Respond to your support requests</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-2">
              We <strong>do not</strong> sell your data or your clients&apos; data to third parties. We
              <strong>do not</strong> use your data for advertising purposes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">4. Data Storage and Security</h2>
            <p>
              Your data is stored on secure servers with encryption at rest and in transit. We use
              industry-standard security practices including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>HTTPS/TLS encryption for all data in transit</li>
              <li>Password hashing using bcrypt</li>
              <li>Token-based authentication (JWT)</li>
              <li>Regular security updates and monitoring</li>
            </ul>
            <p className="mt-2">
              While we take reasonable precautions, no method of electronic storage is 100% secure. We cannot
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">5. Data Retention</h2>
            <p>
              We retain your account information and client data for as long as your account is active. If you
              delete your account, we will delete your data within 30 days, except where we are required to
              retain it for legal or legitimate business purposes.
            </p>
            <p className="mt-2">
              You may export your data at any time by contacting support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">6. Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:skmudassir.it@gmail.com" className="text-secondary hover:underline font-medium">
                skmudassir.it@gmail.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">7. Third-Party Services</h2>
            <p>
              Blackbox CRM may integrate with third-party services (Google Gmail, Microsoft Outlook, etc.). These
              services have their own privacy policies, and we encourage you to review them. We are not
              responsible for the privacy practices of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">8. Children&apos;s Privacy</h2>
            <p>
              Blackbox CRM is not intended for use by anyone under the age of 18. We do not knowingly collect
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes via
              email or through the platform. Your continued use after changes take effect constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-foreground mb-3">10. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, contact us at:
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
