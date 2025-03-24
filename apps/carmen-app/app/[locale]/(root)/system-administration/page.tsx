'use client';

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import {
    Users,
    Settings,
    MapPin,
    GitBranch,
    Sliders,
    Bell,
    Key,
    Shield,
    Database,
    Link
} from "lucide-react";

export default function SystemAdministrationPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('SystemAdministration.userManagement'),
            href: '/system-administration/user-management',
            icon: Users
        },
        {
            name: t('SystemAdministration.config'),
            href: '/system-administration/config',
            icon: Settings
        },
        {
            name: t('SystemAdministration.locationManagement'),
            href: '/system-administration/location-management',
            icon: MapPin
        },
        {
            name: t('SystemAdministration.workflowManagement'),
            href: '/system-administration/workflow-management',
            icon: GitBranch
        },
        {
            name: t('SystemAdministration.generalSettings'),
            href: '/system-administration/general-settings',
            icon: Sliders
        },
        {
            name: t('SystemAdministration.notificationPreferences'),
            href: '/system-administration/notification-preferences',
            icon: Bell
        },
        {
            name: t('SystemAdministration.licenseManagement'),
            href: '/system-administration/license-management',
            icon: Key
        },
        {
            name: t('SystemAdministration.securitySettings'),
            href: '/system-administration/security-settings',
            icon: Shield
        },
        {
            name: t('SystemAdministration.dataBackupAndRecovery'),
            href: '/system-administration/data-backup-and-recovery',
            icon: Database
        },
        {
            name: t('SystemAdministration.systemIntegrations'),
            href: '/system-administration/system-integrations',
            icon: Link
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('systemAdministration')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
