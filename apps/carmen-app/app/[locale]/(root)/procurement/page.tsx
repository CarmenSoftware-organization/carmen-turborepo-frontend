'use client';
import { useTranslations } from 'next-intl';
import { Link } from "@/lib/navigation";
import { moduleItems } from '@/constants/modules-list';

export default function ProcurementPage() {
    const t = useTranslations('Modules');

    // Find the procurement module to access its children
    const procurementModule = moduleItems.find(
        (module) => module.labelKey === 'Modules.procurement'
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-4">{t('procurement')}</h1>
                <p className="text-lg mb-6">
                    {t('procurement')} {t('dashboard')}
                </p>
            </div>

            {/* Display procurement sub-modules as cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {procurementModule?.children?.map((subModule) => {
                    // Extract the translation key from subModule.labelKey
                    const translationKey = subModule.labelKey.replace('Modules.', '');

                    return (
                        <Link
                            key={subModule.labelKey}
                            href={subModule.href}
                            className="block p-6 bg-card rounded-lg border border-border hover:border-primary transition-colors"
                        >
                            <h3 className="text-xl font-semibold mb-2">
                                {t(translationKey)}
                            </h3>
                            <p className="text-muted-foreground">
                                {t('procurement')} - {t(translationKey)}
                            </p>
                        </Link>
                    );
                })}
            </div>

            <div className="mt-8">
                <Link
                    href="/dashboard"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block"
                >
                    {t('dashboard')}
                </Link>
            </div>
        </div>
    );
} 