"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";

export default function Terms() {
  const t = useTranslations("Legal");

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Header */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-bold mb-2">{t("terms.title")}</h1>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. {t("terms.acceptance.title")}</h2>
        <p>{t("terms.acceptance.para1")}</p>
        <p>{t("terms.acceptance.para2")}</p>
      </section>

      {/* Service Description */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. {t("terms.serviceDescription.title")}</h2>
        <p>{t("terms.serviceDescription.intro")}</p>
        <ul>
          <li>{t("terms.serviceDescription.procurement")}</li>
          <li>{t("terms.serviceDescription.productInventory")}</li>
          <li>{t("terms.serviceDescription.vendor")}</li>
          <li>{t("terms.serviceDescription.financial")}</li>
          <li>{t("terms.serviceDescription.operational")}</li>
          <li>{t("terms.serviceDescription.workflow")}</li>
          <li>{t("terms.serviceDescription.multiTenant")}</li>
        </ul>
        <p className="mt-4">{t("terms.serviceDescription.disclaimer")}</p>
      </section>

      {/* Account Registration */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. {t("terms.account.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">3.1 {t("terms.account.creation.title")}</h3>
        <p>{t("terms.account.creation.intro")}</p>
        <ul>
          <li>{t("terms.account.creation.email")}</li>
          <li>{t("terms.account.creation.name")}</li>
          <li>{t("terms.account.creation.organization")}</li>
          <li>{t("terms.account.creation.contact")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">3.2 {t("terms.account.security.title")}</h3>
        <p>{t("terms.account.security.intro")}</p>
        <ul>
          <li>{t("terms.account.security.credentials")}</li>
          <li>{t("terms.account.security.activities")}</li>
          <li>{t("terms.account.security.unauthorized")}</li>
          <li>{t("terms.account.security.password")}</li>
          <li>{t("terms.account.security.sharing")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          3.3 {t("terms.account.termination.title")}
        </h3>
        <p>{t("terms.account.termination.description")}</p>
      </section>

      {/* Subscription and Payments */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. {t("terms.subscription.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">4.1 {t("terms.subscription.model.title")}</h3>
        <p>{t("terms.subscription.model.intro")}</p>
        <ul>
          <li>{t("terms.subscription.model.businessUnits")}</li>
          <li>{t("terms.subscription.model.users")}</li>
          <li>{t("terms.subscription.model.features")}</li>
          <li>{t("terms.subscription.model.support")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          4.2 {t("terms.subscription.payment.title")}
        </h3>
        <ul>
          <li>{t("terms.subscription.payment.advance")}</li>
          <li>{t("terms.subscription.payment.nonRefundable")}</li>
          <li>{t("terms.subscription.payment.suspension")}</li>
          <li>{t("terms.subscription.payment.taxes")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          4.3 {t("terms.subscription.priceChanges.title")}
        </h3>
        <p>{t("terms.subscription.priceChanges.description")}</p>
      </section>

      {/* User Responsibilities */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. {t("terms.userResponsibilities.title")}</h2>
        <p>{t("terms.userResponsibilities.intro")}</p>
        <ul>
          <li>{t("terms.userResponsibilities.laws")}</li>
          <li>{t("terms.userResponsibilities.ip")}</li>
          <li>{t("terms.userResponsibilities.malicious")}</li>
          <li>{t("terms.userResponsibilities.unauthorized")}</li>
          <li>{t("terms.userResponsibilities.disrupt")}</li>
          <li>{t("terms.userResponsibilities.illegal")}</li>
          <li>{t("terms.userResponsibilities.reverse")}</li>
          <li>{t("terms.userResponsibilities.notices")}</li>
          <li>{t("terms.userResponsibilities.compete")}</li>
        </ul>
      </section>

      {/* Intellectual Property */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. {t("terms.intellectualProperty.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">
          6.1 {t("terms.intellectualProperty.our.title")}
        </h3>
        <p>{t("terms.intellectualProperty.our.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          6.2 {t("terms.intellectualProperty.yourContent.title")}
        </h3>
        <p>{t("terms.intellectualProperty.yourContent.intro")}</p>
        <ul>
          <li>{t("terms.intellectualProperty.yourContent.orders")}</li>
          <li>{t("terms.intellectualProperty.yourContent.vendors")}</li>
          <li>{t("terms.intellectualProperty.yourContent.documents")}</li>
          <li>{t("terms.intellectualProperty.yourContent.workflow")}</li>
        </ul>
        <p className="mt-4">{t("terms.intellectualProperty.yourContent.license")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          6.3 {t("terms.intellectualProperty.feedback.title")}
        </h3>
        <p>{t("terms.intellectualProperty.feedback.description")}</p>
      </section>

      {/* Data Protection and Privacy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. {t("terms.dataProtection.title")}</h2>
        <p>
          {t("terms.dataProtection.intro")}{" "}
          <Link href="/policy" className="text-primary hover:underline">
            {t("terms.dataProtection.privacyPolicy")}
          </Link>
          {t("terms.dataProtection.incorporated")}
        </p>
        <p className="mt-4">{t("terms.dataProtection.commitments")}</p>
        <ul>
          <li>
            <strong>{t("terms.dataProtection.isolation.title")}:</strong>{" "}
            {t("terms.dataProtection.isolation.description")}
          </li>
          <li>
            <strong>{t("terms.dataProtection.encryption.title")}:</strong>{" "}
            {t("terms.dataProtection.encryption.description")}
          </li>
          <li>
            <strong>{t("terms.dataProtection.pdpa.title")}:</strong>{" "}
            {t("terms.dataProtection.pdpa.description")}
          </li>
          <li>
            <strong>{t("terms.dataProtection.ownership.title")}:</strong>{" "}
            {t("terms.dataProtection.ownership.description")}
          </li>
          <li>
            <strong>{t("terms.dataProtection.portability.title")}:</strong>{" "}
            {t("terms.dataProtection.portability.description")}
          </li>
        </ul>
      </section>

      {/* Service Level */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. {t("terms.serviceLevel.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">8.1 {t("terms.serviceLevel.uptime.title")}</h3>
        <p>{t("terms.serviceLevel.uptime.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          8.2 {t("terms.serviceLevel.maintenance.title")}
        </h3>
        <p>{t("terms.serviceLevel.maintenance.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          8.3 {t("terms.serviceLevel.support.title")}
        </h3>
        <p>{t("terms.serviceLevel.support.intro")}</p>
        <ul>
          <li>
            <strong>{t("terms.serviceLevel.support.standard.title")}:</strong>{" "}
            {t("terms.serviceLevel.support.standard.description")}
          </li>
          <li>
            <strong>{t("terms.serviceLevel.support.premium.title")}:</strong>{" "}
            {t("terms.serviceLevel.support.premium.description")}
          </li>
          <li>
            <strong>{t("terms.serviceLevel.support.enterprise.title")}:</strong>{" "}
            {t("terms.serviceLevel.support.enterprise.description")}
          </li>
        </ul>
      </section>

      {/* Data Backup and Recovery */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. {t("terms.backup.title")}</h2>
        <p>{t("terms.backup.intro")}</p>
        <ul>
          <li>{t("terms.backup.daily")}</li>
          <li>{t("terms.backup.retention")}</li>
          <li>{t("terms.backup.disaster")}</li>
          <li>{t("terms.backup.redundancy")}</li>
        </ul>
        <p className="mt-4">{t("terms.backup.userResponsibility")}</p>
      </section>

      {/* Limitation of Liability */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. {t("terms.liability.title")}</h2>
        <p>{t("terms.liability.intro")}</p>
        <ul>
          <li>{t("terms.liability.asIs")}</li>
          <li>{t("terms.liability.indirect")}</li>
          <li>{t("terms.liability.maxLiability")}</li>
          <li>{t("terms.liability.dataLoss")}</li>
        </ul>
        <p className="mt-4">{t("terms.liability.disclaimer")}</p>
      </section>

      {/* Indemnification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. {t("terms.indemnification.title")}</h2>
        <p>{t("terms.indemnification.intro")}</p>
        <ul>
          <li>{t("terms.indemnification.use")}</li>
          <li>{t("terms.indemnification.violation")}</li>
          <li>{t("terms.indemnification.rights")}</li>
          <li>{t("terms.indemnification.content")}</li>
        </ul>
      </section>

      {/* Term and Termination */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. {t("terms.termination.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">12.1 {t("terms.termination.term.title")}</h3>
        <p>{t("terms.termination.term.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          12.2 {t("terms.termination.byYou.title")}
        </h3>
        <p>{t("terms.termination.byYou.intro")}</p>
        <ul>
          <li>{t("terms.termination.byYou.access")}</li>
          <li>{t("terms.termination.byYou.export")}</li>
          <li>{t("terms.termination.byYou.deletion")}</li>
          <li>{t("terms.termination.byYou.noRefund")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          12.3 {t("terms.termination.byUs.title")}
        </h3>
        <p>{t("terms.termination.byUs.intro")}</p>
        <ul>
          <li>{t("terms.termination.byUs.breach")}</li>
          <li>{t("terms.termination.byUs.payment")}</li>
          <li>{t("terms.termination.byUs.security")}</li>
          <li>{t("terms.termination.byUs.legal")}</li>
        </ul>
      </section>

      {/* Changes to Terms */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. {t("terms.changes.title")}</h2>
        <p>{t("terms.changes.intro")}</p>
        <ul>
          <li>{t("terms.changes.posting")}</li>
          <li>{t("terms.changes.email")}</li>
          <li>{t("terms.changes.notice")}</li>
        </ul>
        <p className="mt-4">{t("terms.changes.acceptance")}</p>
      </section>

      {/* Governing Law and Disputes */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">14. {t("terms.governingLaw.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">14.1 {t("terms.governingLaw.law.title")}</h3>
        <p>{t("terms.governingLaw.law.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          14.2 {t("terms.governingLaw.dispute.title")}
        </h3>
        <p>{t("terms.governingLaw.dispute.intro")}</p>
        <ol>
          <li>{t("terms.governingLaw.dispute.negotiation")}</li>
          <li>{t("terms.governingLaw.dispute.mediation")}</li>
          <li>{t("terms.governingLaw.dispute.courts")}</li>
        </ol>
      </section>

      {/* General Provisions */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">15. {t("terms.general.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">15.1 {t("terms.general.entire.title")}</h3>
        <p>{t("terms.general.entire.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          15.2 {t("terms.general.severability.title")}
        </h3>
        <p>{t("terms.general.severability.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">15.3 {t("terms.general.waiver.title")}</h3>
        <p>{t("terms.general.waiver.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          15.4 {t("terms.general.assignment.title")}
        </h3>
        <p>{t("terms.general.assignment.description")}</p>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          15.5 {t("terms.general.forceMajeure.title")}
        </h3>
        <p>{t("terms.general.forceMajeure.description")}</p>
      </section>

      {/* Contact Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">16. {t("terms.contact.title")}</h2>
        <p>{t("terms.contact.intro")}</p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">{t("terms.contact.company")}</p>
          <p>{t("terms.contact.legal")}</p>
          <p className="mt-2">
            {t("terms.contact.email")}:{" "}
            <a href="mailto:legal@carmen-software.com" className="text-primary hover:underline">
              legal@carmen-software.com
            </a>
          </p>
          <p>
            {t("terms.contact.support")}:{" "}
            <a href="mailto:support@carmen-software.com" className="text-primary hover:underline">
              support@carmen-software.com
            </a>
          </p>
          <p>{t("terms.contact.address")}: [Your Company Address]</p>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="mb-8 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-3">{t("terms.acknowledgment.title")}</h2>
        <p>{t("terms.acknowledgment.description")}</p>
      </section>
    </div>
  );
}
