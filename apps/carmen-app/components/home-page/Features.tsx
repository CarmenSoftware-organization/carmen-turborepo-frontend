"use client";

import React from 'react';
import {
    LineChart, Clock, Shield, CreditCard, RefreshCw, Settings,
    CalendarCheck, Headphones, Smartphone, Briefcase, Building, UserCheck
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Features() {
    const t = useTranslations('HomePage');

    const features = [
        {
            icon: LineChart,
            titleKey: "performanceAnalytics",
        },
        {
            icon: Clock,
            titleKey: "automatedWorkflows",
        },
        {
            icon: Shield,
            titleKey: "secureAccess",
        },
        {
            icon: CreditCard,
            titleKey: "integratedPayments",
        },
        {
            icon: RefreshCw,
            titleKey: "continuousUpdates",
        },
        {
            icon: Settings,
            titleKey: "customConfiguration",
        },
        {
            icon: CalendarCheck,
            titleKey: "resourcePlanning",
        },
        {
            icon: Headphones,
            titleKey: "support247",
        },
        {
            icon: Smartphone,
            titleKey: "mobileAccessibility",
        },
        {
            icon: Briefcase,
            titleKey: "inventoryManagement",
        },
        {
            icon: Building,
            titleKey: "multiProperty",
        },
        {
            icon: UserCheck,
            titleKey: "guestProfiles",
        }
    ];
    return (
        <section id="features" className="bg-background relative pb-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 section-transition">
                    <div className="inline-flex items-center bg-muted px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                        {t('features.badge')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                        {t('features.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('features.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={feature.titleKey}
                            className={`bg-background border border-border rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1 stagger-item stagger-delay-${(index % 6) + 1}`}
                        >
                            <div className="bg-blue-600 p-3 rounded-lg inline-block mb-4">
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2 text-foreground">
                                {t(`features.items.${feature.titleKey}.title`)}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                                {t(`features.items.${feature.titleKey}.description`)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
