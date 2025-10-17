import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });

  return {
    title: t("termsOfServiceTitle"),
    description: t("termsOfServiceDescription"),
  };
}

export default function TermsOfServicePage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Header */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground">
          Last Updated: {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p>
          Welcome to Carmen Software. These Terms of Service ("Terms") govern your access to and use of
          Carmen, a multi-tenant hotel finance management and inventory management software ("Service").
          By accessing or using our Service, you agree to be bound by these Terms.
        </p>
        <p>
          If you are using the Service on behalf of an organization, you represent and warrant that you
          have the authority to bind that organization to these Terms, and your agreement to these Terms
          will be treated as the agreement of that organization.
        </p>
      </section>

      {/* Service Description */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
        <p>
          Carmen is a comprehensive enterprise software solution designed for the hospitality industry,
          providing the following core functionalities:
        </p>
        <ul>
          <li>Procurement Management (Purchase Requests, Purchase Orders, Goods Received Notes)</li>
          <li>Product and Inventory Management</li>
          <li>Vendor Management and Price Comparisons</li>
          <li>Financial Management and Budget Control</li>
          <li>Operational Planning and Recipe Management</li>
          <li>Workflow and Approval Management</li>
          <li>Multi-tenant Business Unit Administration</li>
        </ul>
        <p className="mt-4">
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time
          with reasonable notice to our customers.
        </p>
      </section>

      {/* Account Registration */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>

        <h3 className="text-xl font-semibold mb-3">3.1 Account Creation</h3>
        <p>
          To use the Service, you must create an account by providing accurate and complete information,
          including:
        </p>
        <ul>
          <li>Valid email address</li>
          <li>Full name</li>
          <li>Organization details</li>
          <li>Contact information</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Security</h3>
        <p>You are responsible for:</p>
        <ul>
          <li>Maintaining the confidentiality of your login credentials</li>
          <li>All activities that occur under your account</li>
          <li>Notifying us immediately of any unauthorized access</li>
          <li>Using a strong, unique password</li>
          <li>Not sharing your account with others</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Account Termination</h3>
        <p>
          We reserve the right to suspend or terminate your account if you violate these Terms or engage
          in any activity that may harm the Service or other users.
        </p>
      </section>

      {/* Subscription and Payments */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>

        <h3 className="text-xl font-semibold mb-3">4.1 Subscription Model</h3>
        <p>
          Carmen operates on a subscription-based B2B licensing model. Pricing is determined by:
        </p>
        <ul>
          <li>Number of business units</li>
          <li>Number of active users</li>
          <li>Selected features and modules</li>
          <li>Support tier</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Payment Terms</h3>
        <ul>
          <li>Subscription fees are billed in advance on a monthly or annual basis</li>
          <li>Payments are non-refundable except as required by law</li>
          <li>Failure to pay may result in service suspension or termination</li>
          <li>All fees are exclusive of applicable taxes</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Price Changes</h3>
        <p>
          We reserve the right to modify our pricing with 30 days' notice. Continued use of the Service
          after the price change constitutes acceptance of the new pricing.
        </p>
      </section>

      {/* User Responsibilities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities and Conduct</h2>
        <p>When using the Service, you agree NOT to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon intellectual property rights of others</li>
          <li>Upload malicious code, viruses, or harmful content</li>
          <li>Attempt to gain unauthorized access to the Service or other accounts</li>
          <li>Interfere with or disrupt the Service's operation</li>
          <li>Use the Service for any illegal or unauthorized purpose</li>
          <li>Reverse engineer, decompile, or disassemble the Service</li>
          <li>Remove or obscure any proprietary notices</li>
          <li>Use the Service to compete with us or develop a competing product</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>

        <h3 className="text-xl font-semibold mb-3">6.1 Our Intellectual Property</h3>
        <p>
          The Service, including its software, design, text, graphics, and all intellectual property
          rights therein, are owned by Carmen Software or its licensors. Your use of the Service does
          not grant you any ownership rights to the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">6.2 Your Content</h3>
        <p>
          You retain all rights to the data and content you submit to the Service ("Your Content"),
          including:
        </p>
        <ul>
          <li>Purchase orders and procurement data</li>
          <li>Product and vendor information</li>
          <li>Business documents and attachments</li>
          <li>Workflow configurations</li>
        </ul>
        <p className="mt-4">
          By using the Service, you grant us a limited license to use, store, and process Your Content
          solely for the purpose of providing the Service to you.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">6.3 Feedback</h3>
        <p>
          Any feedback, suggestions, or ideas you provide to us about the Service may be used by us
          without any obligation to you.
        </p>
      </section>

      {/* Data Protection and Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Data Protection and Privacy</h2>
        <p>
          Your privacy is important to us. Our collection, use, and protection of your personal data
          is governed by our{" "}
          <a href="/policy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          , which is incorporated into these Terms by reference.
        </p>
        <p className="mt-4">Key data protection commitments:</p>
        <ul>
          <li>
            <strong>Multi-tenant Isolation:</strong> Your data is strictly separated from other customers
          </li>
          <li>
            <strong>Encryption:</strong> All data is encrypted in transit and at rest
          </li>
          <li>
            <strong>PDPA Compliance:</strong> We comply with Thailand's Personal Data Protection Act
          </li>
          <li>
            <strong>Data Ownership:</strong> You own your business data
          </li>
          <li>
            <strong>Data Portability:</strong> You can export your data at any time
          </li>
        </ul>
      </section>

      {/* Service Level Agreement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Service Level and Availability</h2>

        <h3 className="text-xl font-semibold mb-3">8.1 Uptime Commitment</h3>
        <p>
          We strive to maintain a service availability of 99.5% uptime, excluding scheduled maintenance
          and circumstances beyond our reasonable control.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">8.2 Scheduled Maintenance</h3>
        <p>
          We may perform scheduled maintenance with advance notice. We will make reasonable efforts to
          schedule maintenance during off-peak hours.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">8.3 Support</h3>
        <p>Technical support is provided based on your subscription tier:</p>
        <ul>
          <li>
            <strong>Standard Support:</strong> Email support during business hours
          </li>
          <li>
            <strong>Premium Support:</strong> Priority email and phone support
          </li>
          <li>
            <strong>Enterprise Support:</strong> 24/7 dedicated support team
          </li>
        </ul>
      </section>

      {/* Data Backup and Recovery */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. Data Backup and Recovery</h2>
        <p>We implement the following data protection measures:</p>
        <ul>
          <li>Automated daily backups of all customer data</li>
          <li>Backup retention for 30 days</li>
          <li>Disaster recovery procedures</li>
          <li>Geographic redundancy for critical data</li>
        </ul>
        <p className="mt-4">
          However, you are responsible for maintaining your own backup copies of Your Content as an
          additional precaution.
        </p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law:
        </p>
        <ul>
          <li>
            The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind
          </li>
          <li>
            We are not liable for any indirect, incidental, special, or consequential damages
          </li>
          <li>
            Our total liability shall not exceed the fees paid by you in the 12 months preceding the claim
          </li>
          <li>
            We are not responsible for data loss caused by your actions or third-party services
          </li>
        </ul>
        <p className="mt-4">
          Some jurisdictions do not allow limitation of liability for personal injury or certain warranties,
          so some limitations may not apply to you.
        </p>
      </section>

      {/* Indemnification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
        <p>
          You agree to indemnify and hold Carmen Software harmless from any claims, damages, losses,
          liabilities, and expenses (including legal fees) arising from:
        </p>
        <ul>
          <li>Your use of the Service</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any rights of another party</li>
          <li>Your Content and its use by us in accordance with these Terms</li>
        </ul>
      </section>

      {/* Term and Termination */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Term and Termination</h2>

        <h3 className="text-xl font-semibold mb-3">12.1 Term</h3>
        <p>
          These Terms remain in effect for as long as you use the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Termination by You</h3>
        <p>
          You may terminate your account at any time by contacting our support team. Upon termination:
        </p>
        <ul>
          <li>Your access to the Service will be disabled</li>
          <li>You will have 90 days to export your data</li>
          <li>After 90 days, your data will be permanently deleted</li>
          <li>No refunds will be provided for any unused subscription period</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">12.3 Termination by Us</h3>
        <p>We may terminate or suspend your access immediately if:</p>
        <ul>
          <li>You breach these Terms</li>
          <li>You fail to pay subscription fees</li>
          <li>Your use poses a security risk</li>
          <li>Required by law or legal process</li>
        </ul>
      </section>

      {/* Changes to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Changes to These Terms</h2>
        <p>
          We may modify these Terms from time to time. We will notify you of material changes by:
        </p>
        <ul>
          <li>Posting the updated Terms on our website</li>
          <li>Sending an email to your registered email address</li>
          <li>Displaying a notice in the Service</li>
        </ul>
        <p className="mt-4">
          Your continued use of the Service after the effective date of the updated Terms constitutes
          acceptance of those changes.
        </p>
      </section>

      {/* Governing Law and Disputes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. Governing Law and Dispute Resolution</h2>

        <h3 className="text-xl font-semibold mb-3">14.1 Governing Law</h3>
        <p>
          These Terms are governed by and construed in accordance with the laws of Thailand, without
          regard to its conflict of law provisions.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">14.2 Dispute Resolution</h3>
        <p>
          In the event of any dispute arising from these Terms or the Service:
        </p>
        <ol>
          <li>The parties will attempt to resolve the dispute through good-faith negotiations</li>
          <li>If negotiations fail, the dispute may be submitted to mediation</li>
          <li>
            Any legal action must be brought in the courts of Thailand, and you consent to the
            exclusive jurisdiction of such courts
          </li>
        </ol>
      </section>

      {/* General Provisions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">15. General Provisions</h2>

        <h3 className="text-xl font-semibold mb-3">15.1 Entire Agreement</h3>
        <p>
          These Terms, together with our Privacy Policy, constitute the entire agreement between you
          and Carmen Software regarding the Service.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">15.2 Severability</h3>
        <p>
          If any provision of these Terms is found to be unenforceable, the remaining provisions will
          continue in full force and effect.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">15.3 Waiver</h3>
        <p>
          Our failure to enforce any right or provision of these Terms will not be considered a waiver
          of those rights.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">15.4 Assignment</h3>
        <p>
          You may not assign or transfer these Terms without our prior written consent. We may assign
          these Terms without restriction.
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">15.5 Force Majeure</h3>
        <p>
          We will not be liable for any failure or delay in performance due to circumstances beyond
          our reasonable control, including natural disasters, war, terrorism, pandemics, or
          government actions.
        </p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us:
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">Carmen Software</p>
          <p>Legal Department</p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:legal@carmen-software.com" className="text-primary hover:underline">
              legal@carmen-software.com
            </a>
          </p>
          <p>
            Support:{" "}
            <a href="mailto:support@carmen-software.com" className="text-primary hover:underline">
              support@carmen-software.com
            </a>
          </p>
          <p>
            Address: [Your Company Address]
          </p>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Acknowledgment</h2>
        <p>
          By using Carmen Software, you acknowledge that you have read, understood, and agree to be
          bound by these Terms of Service and our Privacy Policy.
        </p>
      </section>
    </div>
  );
}
