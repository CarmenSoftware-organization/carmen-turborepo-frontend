'use client';

import { MenuCardGrid, MenuCardItem } from "@/components/ui/menu-card";
import { useTranslations } from "next-intl";
import { BookOpen, PlayCircle, HelpCircle, TicketCheck, FileText } from "lucide-react";

export default function HelpSupportPage() {
    const t = useTranslations('Modules');
    const subMenu: MenuCardItem[] = [
        {
            name: t('HelpAndSupport.userManuals'),
            href: '/help-support/user-manuals',
            icon: BookOpen
        },
        {
            name: t('HelpAndSupport.videoTutorials'),
            href: '/help-support/video-tutorials',
            icon: PlayCircle
        },
        {
            name: t('HelpAndSupport.faqs'),
            href: '/help-support/faqs',
            icon: HelpCircle
        },
        {
            name: t('HelpAndSupport.supportTicketSystem'),
            href: '/help-support/support-ticket-system',
            icon: TicketCheck
        },
        {
            name: t('HelpAndSupport.systemUpdatesAndReleaseNotes'),
            href: '/help-support/system-updates-and-release-notes',
            icon: FileText
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('helpAndSupport')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    )
}
