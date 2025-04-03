import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { Link } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SystemIntegrationPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('SystemIntegration.pos'),
            href: '/system-integration/pos',
            icon: Link
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('SystemIntegration.pos')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
