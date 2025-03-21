'use client';
import { useTranslations } from 'next-intl';
import { Link } from "@/lib/navigation";

export default function PurchaseOrderPage() {
    const t = useTranslations('Modules');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-4">{t('Procurement.purchaseOrder')}</h1>
                <p className="text-lg mb-6">
                    {t('procurement')} &gt; {t('Procurement.purchaseOrder')}
                </p>
            </div>

            <div className="p-6 bg-card rounded-lg border border-border">
                <h2 className="text-xl font-semibold mb-4">
                    {t('Procurement.purchaseOrder')} {t('dashboard')}
                </h2>
                <p className="mb-4">
                    This is the Purchase Order page demonstrating translations with the modules list.
                </p>

                <div className="flex space-x-4 mt-6">
                    <Link
                        href="/procurement"
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md inline-block"
                    >
                        {t('procurement')}
                    </Link>
                    <Link
                        href="/dashboard"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md inline-block"
                    >
                        {t('dashboard')}
                    </Link>
                </div>
            </div>
        </div>
    );
} 