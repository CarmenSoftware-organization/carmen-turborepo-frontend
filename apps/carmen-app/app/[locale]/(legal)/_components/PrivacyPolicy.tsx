"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPolicy() {
  const t = useTranslations("Legal");
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {/* Header */}
      <div className="mb-8 pb-6 border-b">
        <h1 className="text-4xl font-bold mb-2">{t("privacy.title")}</h1>
      </div>

      {/* Introduction */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. {t("privacy.intro.title")}</h2>
        <p>{t("privacy.intro.para1")}</p>
        <p>{t("privacy.intro.para2")}</p>
      </section>

      {/* Information We Collect */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. {t("privacy.infoCollect.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">
          2.1 {t("privacy.infoCollect.personal.title")}
        </h3>
        <p>{t("privacy.infoCollect.personal.intro")}</p>
        <ul>
          <li>{t("privacy.infoCollect.personal.email")}</li>
          <li>{t("privacy.infoCollect.personal.name")}</li>
          <li>{t("privacy.infoCollect.personal.phone")}</li>
          <li>{t("privacy.infoCollect.personal.department")}</li>
          <li>{t("privacy.infoCollect.personal.businessUnit")}</li>
          <li>{t("privacy.infoCollect.personal.roles")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          2.2 {t("privacy.infoCollect.usage.title")}
        </h3>
        <p>{t("privacy.infoCollect.usage.intro")}</p>
        <ul>
          <li>{t("privacy.infoCollect.usage.loginHistory")}</li>
          <li>{t("privacy.infoCollect.usage.session")}</li>
          <li>{t("privacy.infoCollect.usage.buContext")}</li>
          <li>{t("privacy.infoCollect.usage.workflow")}</li>
          <li>{t("privacy.infoCollect.usage.transactions")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          2.3 {t("privacy.infoCollect.business.title")}
        </h3>
        <p>{t("privacy.infoCollect.business.intro")}</p>
        <ul>
          <li>{t("privacy.infoCollect.business.company")}</li>
          <li>{t("privacy.infoCollect.business.vendors")}</li>
          <li>{t("privacy.infoCollect.business.products")}</li>
          <li>{t("privacy.infoCollect.business.orders")}</li>
          <li>{t("privacy.infoCollect.business.pricing")}</li>
          <li>{t("privacy.infoCollect.business.documents")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          2.4 {t("privacy.infoCollect.technical.title")}
        </h3>
        <ul>
          <li>{t("privacy.infoCollect.technical.ip")}</li>
          <li>{t("privacy.infoCollect.technical.browser")}</li>
          <li>{t("privacy.infoCollect.technical.device")}</li>
          <li>{t("privacy.infoCollect.technical.cookies")}</li>
          <li>{t("privacy.infoCollect.technical.performance")}</li>
        </ul>
      </section>

      {/* How We Use Your Information */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. {t("privacy.howWeUse.title")}</h2>

        <h3 className="text-xl font-semibold mb-3">3.1 {t("privacy.howWeUse.service.title")}</h3>
        <ul>
          <li>{t("privacy.howWeUse.service.auth")}</li>
          <li>{t("privacy.howWeUse.service.access")}</li>
          <li>{t("privacy.howWeUse.service.isolation")}</li>
          <li>{t("privacy.howWeUse.service.workflow")}</li>
          <li>{t("privacy.howWeUse.service.reports")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          3.2 {t("privacy.howWeUse.improvement.title")}
        </h3>
        <ul>
          <li>{t("privacy.howWeUse.improvement.errors")}</li>
          <li>{t("privacy.howWeUse.improvement.performance")}</li>
          <li>{t("privacy.howWeUse.improvement.ux")}</li>
          <li>{t("privacy.howWeUse.improvement.features")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          3.3 {t("privacy.howWeUse.security.title")}
        </h3>
        <ul>
          <li>{t("privacy.howWeUse.security.fraud")}</li>
          <li>{t("privacy.howWeUse.security.audit")}</li>
          <li>{t("privacy.howWeUse.security.session")}</li>
          <li>{t("privacy.howWeUse.security.incident")}</li>
        </ul>

        <h3 className="text-xl font-semibold mb-3 mt-6">
          3.4 {t("privacy.howWeUse.communication.title")}
        </h3>
        <ul>
          <li>{t("privacy.howWeUse.communication.notifications")}</li>
          <li>{t("privacy.howWeUse.communication.workflow")}</li>
          <li>{t("privacy.howWeUse.communication.approvals")}</li>
          <li>{t("privacy.howWeUse.communication.updates")}</li>
        </ul>
      </section>

      {/* Third-Party Services */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. {t("privacy.thirdParty.title")}</h2>
        <p>{t("privacy.thirdParty.intro")}</p>
        <ul>
          <li>
            <strong>{t("privacy.thirdParty.sentry.title")}:</strong>{" "}
            {t("privacy.thirdParty.sentry.description")}
          </li>
          <li>
            <strong>{t("privacy.thirdParty.hosting.title")}:</strong>{" "}
            {t("privacy.thirdParty.hosting.description")}
          </li>
        </ul>
      </section>

      {/* Data Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. {t("privacy.security.title")}</h2>
        <p>{t("privacy.security.intro")}</p>
        <ul>
          <li>
            <strong>{t("privacy.security.encryption.title")}:</strong>{" "}
            {t("privacy.security.encryption.description")}
          </li>
          <li>
            <strong>{t("privacy.security.authentication.title")}:</strong>{" "}
            {t("privacy.security.authentication.description")}
          </li>
          <li>
            <strong>{t("privacy.security.isolation.title")}:</strong>{" "}
            {t("privacy.security.isolation.description")}
          </li>
          <li>
            <strong>{t("privacy.security.accessControl.title")}:</strong>{" "}
            {t("privacy.security.accessControl.description")}
          </li>
          <li>
            <strong>{t("privacy.security.auditLog.title")}:</strong>{" "}
            {t("privacy.security.auditLog.description")}
          </li>
          <li>
            <strong>{t("privacy.security.backups.title")}:</strong>{" "}
            {t("privacy.security.backups.description")}
          </li>
        </ul>
      </section>

      {/* Your Rights (PDPA) */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. {t("privacy.rights.title")}</h2>
        <p>{t("privacy.rights.intro")}</p>
        <ul>
          <li>
            <strong>{t("privacy.rights.access.title")}:</strong>{" "}
            {t("privacy.rights.access.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.rectification.title")}:</strong>{" "}
            {t("privacy.rights.rectification.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.erasure.title")}:</strong>{" "}
            {t("privacy.rights.erasure.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.restrict.title")}:</strong>{" "}
            {t("privacy.rights.restrict.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.portability.title")}:</strong>{" "}
            {t("privacy.rights.portability.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.object.title")}:</strong>{" "}
            {t("privacy.rights.object.description")}
          </li>
          <li>
            <strong>{t("privacy.rights.withdraw.title")}:</strong>{" "}
            {t("privacy.rights.withdraw.description")}
          </li>
        </ul>
        <p className="mt-4">{t("privacy.rights.contact")}</p>
      </section>

      {/* Data Retention */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. {t("privacy.retention.title")}</h2>
        <p>{t("privacy.retention.intro")}</p>
        <ul>
          <li>{t("privacy.retention.service")}</li>
          <li>{t("privacy.retention.legal")}</li>
          <li>{t("privacy.retention.disputes")}</li>
          <li>{t("privacy.retention.agreements")}</li>
        </ul>
        <p className="mt-4">{t("privacy.retention.termination")}</p>
      </section>

      {/* Cookies and Tracking */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">8. {t("privacy.cookies.title")}</h2>
        <p>{t("privacy.cookies.intro")}</p>
        <ul>
          <li>{t("privacy.cookies.session")}</li>
          <li>{t("privacy.cookies.language")}</li>
          <li>{t("privacy.cookies.businessUnit")}</li>
          <li>{t("privacy.cookies.performance")}</li>
        </ul>
        <p className="mt-4">{t("privacy.cookies.control")}</p>
      </section>

      {/* International Transfers */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">9. {t("privacy.international.title")}</h2>
        <p>{t("privacy.international.description")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">10. {t("privacy.children.title")}</h2>
        <p>{t("privacy.children.description")}</p>
      </section>

      {/* Changes to This Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">11. {t("privacy.changes.title")}</h2>
        <p>{t("privacy.changes.description")}</p>
      </section>

      {/* Contact Us */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">12. {t("privacy.contact.title")}</h2>
        <p>{t("privacy.contact.intro")}</p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold">{t("privacy.contact.company")}</p>
          <p>{t("privacy.contact.department")}</p>
          <p className="mt-2">
            {t("privacy.contact.email")}:{" "}
            <a href="mailto:privacy@carmen-software.com" className="text-primary hover:underline">
              privacy@carmen-software.com
            </a>
          </p>
          <p>{t("privacy.contact.address")}</p>
        </div>
      </section>

      {/* Governing Law */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">13. {t("privacy.governingLaw.title")}</h2>
        <p>{t("privacy.governingLaw.description")}</p>
      </section>
    </div>
  );
}
