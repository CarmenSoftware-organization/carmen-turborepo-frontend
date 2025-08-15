"use client";

import { Link } from "@/i18n/routing";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HomeComponent() {
    const t = useTranslations();

    return (
        <div className="flex min-h-screen flex-col">
            <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 pb-16 pt-24 text-center md:pb-24 md:pt-32">
                <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-6xl">
                    {t("app.title")}
                </h1>
                <p className="mt-6 animate-fade-up text-center text-muted-foreground/80 md:text-xl">
                    {t("app.welcome")}
                </p>
                <div className="mt-8 flex animate-fade-up items-center justify-center gap-4">

                    <Button size="lg" asChild>
                        <Link href="/auth">
                            {t("home.cta.getStarted")}
                            <ArrowRight />
                        </Link>
                    </Button>
                    <Button size="lg" asChild variant={'secondary'}>
                        <Link href="/admin/dashboard">
                            {t("home.cta.contactSales")}
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-3 md:py-24">
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{t("home.features.cluster.title")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("home.features.cluster.description")}</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{t("home.features.report.title")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("home.features.report.description")}</p>
                </div>
                <div className="rounded-lg border bg-card p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold">{t("home.features.access.title")}</h3>
                    <p className="mt-2 text-muted-foreground">{t("home.features.access.description")}</p>
                </div>
            </div>

            <div className="border-t bg-muted/50">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold">100+</div>
                        <div className="mt-2 text-sm text-muted-foreground">{t("home.stats.enterpriseCustomers")}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">1000+</div>
                        <div className="mt-2 text-sm text-muted-foreground">{t("home.stats.businessUnits")}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">50M+</div>
                        <div className="mt-2 text-sm text-muted-foreground">{t("home.stats.reportsGenerated")}</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold">99.9%</div>
                        <div className="mt-2 text-sm text-muted-foreground">{t("home.stats.platformUptime")}</div>
                    </div>
                </div>
            </div>

            <footer className="border-t py-12">
                <div className="mx-auto max-w-7xl px-4">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">{t("home.footer.copyright")}</div>
                        <div className="flex gap-4">
                            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                                {t("home.footer.privacyPolicy")}
                            </Link>
                            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                                {t("home.footer.termsOfService")}
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}