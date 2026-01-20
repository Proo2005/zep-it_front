"use client";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F4F6FB] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-8 text-[#1C1C1C]">
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

        <p className="text-sm text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <Section title="1. Acceptance of Terms">
          By accessing or using Zep-It, you agree to comply with and be bound by
          these Terms & Conditions. If you do not agree, please do not use the
          platform.
        </Section>

        <Section title="2. Eligibility">
          You must be at least 18 years old to use this service. By using Zep-It,
          you confirm that you meet this requirement.
        </Section>

        <Section title="3. Account Responsibilities">
          You are responsible for maintaining the confidentiality of your
          account credentials. Any activity under your account is your
          responsibility.
        </Section>

        <Section title="4. Orders & Payments">
          All orders placed through Zep-It are subject to availability and
          confirmation. Prices, offers, and delivery timelines may change
          without prior notice.
        </Section>

        <Section title="5. Wallet & Refunds">
          Wallet balances are non-transferable. Refunds, if applicable, will be
          processed according to our refund policy and may take time to reflect.
        </Section>

        <Section title="6. User Conduct">
          You agree not to misuse the platform, engage in fraudulent activities,
          or violate any applicable laws while using Zep-It.
        </Section>

        <Section title="7. Intellectual Property">
          All content, logos, designs, and software associated with Zep-It are
          the intellectual property of Zep-It and may not be copied or reused
          without permission.
        </Section>

        <Section title="8. Account Suspension or Termination">
          We reserve the right to suspend or terminate accounts that violate
          these terms or engage in harmful behavior.
        </Section>

        <Section title="9. Limitation of Liability">
          Zep-It shall not be liable for any indirect, incidental, or
          consequential damages arising from the use of the platform.
        </Section>

        <Section title="10. Privacy">
          Your use of Zep-It is also governed by our Privacy Policy, which
          explains how we collect and protect your data.
        </Section>

        <Section title="11. Changes to Terms">
          We may update these Terms & Conditions from time to time. Continued
          use of the service means you accept the updated terms.
        </Section>

        <Section title="12. Contact Us">
          If you have any questions regarding these Terms, please contact us
          through the support section of the app.
        </Section>

        <p className="text-xs text-gray-500 mt-10">
          © {new Date().getFullYear()} Zep-It. All rights reserved.
        </p>
      </div>
    </div>
  );
}

/* --------- REUSABLE SECTION COMPONENT --------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-700 leading-relaxed">{children}</p>
    </div>
  );
}
