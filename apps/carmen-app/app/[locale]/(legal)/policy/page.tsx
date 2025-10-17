import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: "Legal" });

  return {
    title: t("privacyPolicyTitle"),
    description: t("privacyPolicyDescription"),
  };
}

export default function PrivacyPolicyPage() {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Header */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
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
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          Welcome to Carmen Software ("we," "our," or "us"). We are committed to protecting your personal
          information and your right to privacy. This Privacy Policy explains how we collect, use, disclose,
          and safeguard your information when you use our hotel finance management software and related services.
        </p>
        <p>
          Carmen is a multi-tenant inventory management application designed for the hospitality industry,
          including hotels, resorts, and restaurants. We provide comprehensive workflow management for
          procurement, product management, vendor operations, and financial management.
        </p>
      </section>

      {/* Information We Collect */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

        <h3 className="text-xl font-semibold mb-3">2.1 Personal Information</h3>
        <p>We collect the following personal information from users:</p>
        <ul>
          <li>Email address</li>
          <li>Full name</li>
          <li>Phone number</li>
          <li>Department and role within your organization</li>
          <li>Business unit assignment</li>
          <li>User roles and permissions</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Usage Data</h3>
        <p>We automatically collect certain information when you use our services:</p>
        <ul>
          <li>Login history (date and time)</li>
          <li>Session information</li>
          <li>Business unit context</li>
          <li>Workflow actions and approval history</li>
          <li>Transaction history</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Business Data</h3>
        <p>As part of providing our services, we process:</p>
        <ul>
          <li>Company and business unit information</li>
          <li>Vendor and supplier details</li>
          <li>Product and inventory data</li>
          <li>Purchase orders and transactions</li>
          <li>Pricing and payment terms</li>
          <li>Document attachments and files</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">2.4 Technical Data</h3>
        <ul>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Cookies and local storage data</li>
          <li>Performance metrics</li>
        </ul>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>

        <h3 className="text-xl font-semibold mb-3">3.1 Service Delivery</h3>
        <ul>
          <li>Authentication and identity verification</li>
          <li>Access control and authorization</li>
          <li>Multi-tenant data isolation</li>
          <li>Processing workflows and approvals</li>
          <li>Generating reports and analytics</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.2 System Improvement</h3>
        <ul>
          <li>Error monitoring and debugging (via Sentry)</li>
          <li>Performance tracking and optimization</li>
          <li>User experience improvements</li>
          <li>Feature development and enhancement</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Security</h3>
        <ul>
          <li>Fraud detection and prevention</li>
          <li>Audit logging and compliance</li>
          <li>Session management</li>
          <li>Security incident response</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.4 Communication</h3>
        <ul>
          <li>System notifications and alerts</li>
          <li>Workflow notifications</li>
          <li>Approval request emails</li>
          <li>Service updates and announcements</li>
        </ul>
      </section>

      {/* Third-Party Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
        <p>We use the following third-party services to operate our platform:</p>

        <h3 className="text-xl font-semibold mb-3">4.1 Sentry</h3>
        <p>
          We use Sentry for error monitoring and performance tracking. Sentry may collect technical data
          including error logs, performance metrics, and user interaction data. For more information,
          please visit{" "}
          <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
            Sentry's Privacy Policy
          </a>
          .
        </p>

        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Hosting and Infrastructure</h3>
        <p>
          Our application is hosted on secure cloud infrastructure. All data is encrypted in transit and at rest.
        </p>
      </section>

      {/* Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
        <p>We implement industry-standard security measures to protect your data:</p>
        <ul>
          <li>
            <strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at rest
          </li>
          <li>
            <strong>Authentication:</strong> JWT-based authentication with access and refresh tokens
          </li>
          <li>
            <strong>Multi-tenant Isolation:</strong> Strict data separation between business units
          </li>
          <li>
            <strong>Access Control:</strong> Role-based access control (RBAC) for all users
          </li>
          <li>
            <strong>Audit Logging:</strong> Comprehensive logging of all system activities
          </li>
          <li>
            <strong>Regular Backups:</strong> Automated backups with disaster recovery procedures
          </li>
        </ul>
      </section>

      {/* Your Rights (PDPA) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Your Rights Under PDPA</h2>
        <p>
          Under Thailand's Personal Data Protection Act (PDPA), you have the following rights:
        </p>
        <ul>
          <li>
            <strong>Right to Access:</strong> Request access to your personal data
          </li>
          <li>
            <strong>Right to Rectification:</strong> Request correction of inaccurate data
          </li>
          <li>
            <strong>Right to Erasure:</strong> Request deletion of your personal data
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> Request limitation of data processing
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Request transfer of your data
          </li>
          <li>
            <strong>Right to Object:</strong> Object to certain types of data processing
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Withdraw previously given consent
          </li>
        </ul>
        <p className="mt-4">
          To exercise any of these rights, please contact our Data Protection Officer using the contact
          information provided below.
        </p>
      </section>

      {/* Data Retention */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
        <p>We retain your personal data for as long as necessary to:</p>
        <ul>
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
          <li>Enforce our agreements</li>
        </ul>
        <p className="mt-4">
          When you terminate your subscription, we will retain your data for a period of 90 days to allow
          for potential reactivation. After this period, your data will be permanently deleted unless we
          are required to retain it by law.
        </p>
      </section>

      {/* Cookies and Tracking */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. Cookies and Local Storage</h2>
        <p>We use cookies and local storage to:</p>
        <ul>
          <li>Maintain your login session</li>
          <li>Remember your language preference</li>
          <li>Store your business unit selection</li>
          <li>Improve application performance</li>
        </ul>
        <p className="mt-4">
          You can control cookie settings through your browser preferences. However, disabling cookies may
          affect the functionality of our services.
        </p>
      </section>

      {/* International Transfers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
        <p>
          Our primary servers are located in Thailand. If you access our services from outside Thailand,
          your data may be transferred to and processed in Thailand. We ensure that all international data
          transfers comply with applicable data protection laws.
        </p>
      </section>

      {/* Children's Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
        <p>
          Our services are designed for business use and are not intended for individuals under 18 years
          of age. We do not knowingly collect personal information from children.
        </p>
      </section>

      {/* Changes to This Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any material changes
          by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage
          you to review this Privacy Policy periodically for any changes.
        </p>
      </section>

      {/* Contact Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy or our data practices, please contact us:
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">Carmen Software</p>
          <p>Data Protection Officer</p>
          <p className="mt-2">
            Email:{" "}
            <a href="mailto:privacy@carmen-software.com" className="text-primary hover:underline">
              privacy@carmen-software.com
            </a>
          </p>
          <p>
            Address: [Your Company Address]
          </p>
        </div>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
        <p>
          This Privacy Policy is governed by and construed in accordance with the laws of Thailand,
          including the Personal Data Protection Act B.E. 2562 (2019).
        </p>
      </section>
    </div>
  );
}
