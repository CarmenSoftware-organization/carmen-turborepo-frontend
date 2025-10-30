"use client";

import { Hotel, X as TwitterX, Linkedin, Instagram, Facebook, Github } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function HomeFooter() {
  const t = useTranslations("HomePage");
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      id: "product",
      titleKey: "footer.columns.product.title",
      links: [
        { nameKey: "footer.columns.product.links.features", href: "#features" },
        { nameKey: "footer.columns.product.links.pricing", href: "#" },
        { nameKey: "footer.columns.product.links.caseStudies", href: "#" },
        { nameKey: "footer.columns.product.links.reviews", href: "#testimonials" },
        { nameKey: "footer.columns.product.links.updates", href: "#" },
      ],
    },
    {
      id: "company",
      titleKey: "footer.columns.company.title",
      links: [
        { nameKey: "footer.columns.company.links.aboutUs", href: "#" },
        { nameKey: "footer.columns.company.links.careers", href: "#" },
        { nameKey: "footer.columns.company.links.press", href: "#" },
        { nameKey: "footer.columns.company.links.partners", href: "#" },
        { nameKey: "footer.columns.company.links.contact", href: "#contact" },
      ],
    },
    {
      id: "resources",
      titleKey: "footer.columns.resources.title",
      links: [
        { nameKey: "footer.columns.resources.links.blog", href: "#" },
        { nameKey: "footer.columns.resources.links.support", href: "#" },
        { nameKey: "footer.columns.resources.links.documentation", href: "#" },
        { nameKey: "footer.columns.resources.links.api", href: "#" },
        { nameKey: "footer.columns.resources.links.community", href: "#" },
      ],
    },
  ];

  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="h-7 w-7 " />
              <span className="text-xl font-medium tracking-tight">{t("footer.brand.name")}</span>
            </div>
            <p className="/70 mb-6 max-w-md">{t("footer.brand.description")}</p>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Twitter">
                <TwitterX className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {footerLinks.map((column) => (
            <div key={column.id}>
              <h3 className="font-semibold text-lg mb-4">{t(column.titleKey)}</h3>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.nameKey}>
                    <a href={link.href} className="ttext-sm">
                      {t(link.nameKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="/60 text-sm mb-4 md:mb-0">
            &copy; {currentYear} {t("footer.copyright")}
          </p>
          <div className="flex space-x-6">
            <Link href="/policy" className="text-sm">
              {t("footer.legal.privacyPolicy")}
            </Link>
            <Link href="/terms" className="text-sm">
              {t("footer.legal.termsOfService")}
            </Link>
            <Link href="#" className="text-sm">
              {t("footer.legal.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
