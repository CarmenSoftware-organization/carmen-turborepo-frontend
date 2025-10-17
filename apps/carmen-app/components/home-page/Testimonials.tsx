"use client";

import React from 'react';
import { Quote } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Testimonials() {
    const t = useTranslations('HomePage');

    const testimonials = [
        {
            id: "testimonial-1",
            key: "testimonial1"
        },
        {
            id: "testimonial-2",
            key: "testimonial2"
        },
        {
            id: "testimonial-3",
            key: "testimonial3"
        }
    ];

    return (
        <section id="testimonials" className="py-20 bg-muted relative">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16 section-transition">
                    <div className="inline-flex items-center bg-background px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                        {t('testimonials.badge')}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                        {t('testimonials.title')}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        {t('testimonials.description')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.id}
                            className={`bg-background border border-border rounded-xl p-8 shadow-sm transition-all duration-300 hover:shadow-md relative stagger-item stagger-delay-${index + 1}`}
                        >
                            <Quote className="h-10 w-10 text-primary/20 absolute -top-2 -left-2" />
                            <p className="text-muted-foreground mb-6 relative z-10">
                                {t(`testimonials.items.${testimonial.key}.quote`)}
                            </p>
                            <div>
                                <p className="font-medium text-foreground">
                                    {t(`testimonials.items.${testimonial.key}.author`)}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {t(`testimonials.items.${testimonial.key}.position`)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}