"use client";

import { ArrowRight, BarChart3, Users, Calendar } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Hero() {
  const t = useTranslations("HomePage");

  return (
    <section id="home" className="min-h-screen pt-24 md:pt-32 relative bg-hotel-pattern">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-transparent to-background/80 z-0"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center section-transition">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            {t("hero.title")}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t("hero.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="#demo"
              className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground px-8 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {t("hero.requestDemo")}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#features"
              className="bg-background hover:bg-muted text-foreground px-8 py-3 rounded-md font-medium border border-border transition-all duration-300"
            >
              {t("hero.exploreFeatures")}
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-background/70 backdrop-blur-md border border-border shadow-sm rounded-xl p-6 transition-all duration-300 hover:bg-background/80 hover:shadow-md hover:-translate-y-1 stagger-item stagger-delay-1">
            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {t("hero.features.analytics.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("hero.features.analytics.description")}
            </p>
          </div>

          <div className="bg-background/70 backdrop-blur-md border border-border shadow-sm rounded-xl p-6 transition-all duration-300 hover:bg-background/80 hover:shadow-md hover:-translate-y-1 stagger-item stagger-delay-2">
            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {t("hero.features.staff.title")}
            </h3>
            <p className="text-muted-foreground text-sm">{t("hero.features.staff.description")}</p>
          </div>

          <div className="bg-background/70 backdrop-blur-md border border-border shadow-sm rounded-xl p-6 transition-all duration-300 hover:bg-background/80 hover:shadow-md hover:-translate-y-1 stagger-item stagger-delay-3">
            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              {t("hero.features.booking.title")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("hero.features.booking.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}
