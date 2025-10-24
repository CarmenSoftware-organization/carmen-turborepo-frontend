"use client";

import { CheckCircle2, ArrowRight, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function ContactSection() {
    const t = useTranslations('HomePage');

    const benefits = [
        { id: "benefit-1", key: "benefit1" },
        { id: "benefit-2", key: "benefit2" },
        { id: "benefit-3", key: "benefit3" },
        { id: "benefit-4", key: "benefit4" },
        { id: "benefit-5", key: "benefit5" }
    ];
    return (
        <section id="contact" className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="container mx-auto w-full max-w-5xl px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="section-transition">
                            <div className="inline-flex items-center bg-primary/10 px-4 py-1.5 rounded-full text-xs font-medium text-foreground border border-border mb-5">
                                {t('contact.badge')}
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-6">
                                {t('contact.title')}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                {t('contact.description')}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {benefits.map((benefit) => (
                                    <li key={benefit.id} className="flex items-start">
                                        <CheckCircle2 className="h-5 w-5 text-primary mr-3 flex-shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground">
                                            {t(`contact.benefits.${benefit.key}`)}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Mail className="h-5 w-5 text-muted-foreground mr-3" />
                                    <a href={`mailto:${t('contact.contactInfo.email')}`} className="text-foreground hover:text-primary transition-colors">
                                        {t('contact.contactInfo.email')}
                                    </a>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="h-5 w-5 text-muted-foreground mr-3" />
                                    <a href={`tel:${t('contact.contactInfo.phone')}`} className="text-foreground hover:text-primary transition-colors">
                                        {t('contact.contactInfo.phone')}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background border border-border rounded-xl p-8 shadow-sm section-transition">
                            <h3 className="text-xl font-semibold mb-6 text-foreground">{t('contact.form.heading')}</h3>
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                                        {t('contact.form.fullName.label')}
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder={t('contact.form.fullName.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                                        {t('contact.form.email.label')}
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder={t('contact.form.email.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-1">
                                        {t('contact.form.company.label')}
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder={t('contact.form.company.placeholder')}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="size" className="block text-sm font-medium text-muted-foreground mb-1">
                                        {t('contact.form.rooms.label')}
                                    </label>
                                    <select
                                        id="size"
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                    >
                                        <option value="">{t('contact.form.rooms.placeholder')}</option>
                                        <option value="1-20">{t('contact.form.rooms.options.option1')}</option>
                                        <option value="21-50">{t('contact.form.rooms.options.option2')}</option>
                                        <option value="51-100">{t('contact.form.rooms.options.option3')}</option>
                                        <option value="101+">{t('contact.form.rooms.options.option4')}</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                                        {t('contact.form.message.label')}
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={3}
                                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all bg-background text-foreground"
                                        placeholder={t('contact.form.message.placeholder')}
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-all duration-300"
                                >
                                    {t('contact.form.submit')}
                                    <ArrowRight className="h-4 w-4" />
                                </button>

                                <p className="text-xs text-muted-foreground text-center">
                                    {t('contact.form.privacy')} <Link href="/policy" className="text-blue-600 hover:underline">{t('contact.form.privacyLink')}</Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
