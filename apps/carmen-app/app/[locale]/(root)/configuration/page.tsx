import { CreditCard, MapPin, Building2, Store } from "lucide-react";
import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Configuration",
};

export default function Configuration() {
    const t = useTranslations('Modules');

    const subMenu: MenuCardItem[] = [
        {
            name: t('Configuration.currency'),
            href: '/configuration/currency',
            icon: CreditCard
        },
        {
            name: t('Configuration.exchangeRates'),
            href: '/configuration/exchange-rate',
            icon: CreditCard
        },
        {
            name: t('Configuration.deliveryPoint'),
            href: '/configuration/delivery-point',
            icon: MapPin
        },
        {
            name: t('Configuration.department'),
            href: '/configuration/department',
            icon: Building2
        },
        {
            name: t('Configuration.storeLocation'),
            href: '/configuration/store-location',
            icon: Store
        }
    ];

    const title = t('configurationTitle');

    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
