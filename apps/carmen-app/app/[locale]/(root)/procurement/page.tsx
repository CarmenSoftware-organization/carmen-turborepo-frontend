'use client';
import { useTranslations } from 'next-intl';
import { MenuCardGrid, MenuCardItem } from '@/components/ui/menu-card';
import { ClipboardCheck, ShoppingCart, FileText, Package, UserCheck, Receipt, FileCode } from 'lucide-react';

export default function ProcurementPage() {
    const t = useTranslations('Modules');

    const subMenu: MenuCardItem[] = [
        {
            name: t('Procurement.myApproval'),
            href: '/procurement/my-approval',
            icon: ClipboardCheck
        },
        {
            name: t('Procurement.purchaseOrder'),
            href: '/procurement/purchase-order',
            icon: ShoppingCart
        },
        {
            name: t('Procurement.purchaseRequest'),
            href: '/procurement/purchase-request',
            icon: FileText
        },
        {
            name: t('Procurement.goodsReceivedNote'),
            href: '/procurement/goods-received-note',
            icon: Package
        },
        {
            name: t('Procurement.purchaseRequestApprovals'),
            href: '/procurement/purchase-request-approvals',
            icon: UserCheck
        },
        {
            name: t('Procurement.creditNote'),
            href: '/procurement/credit-note',
            icon: Receipt
        },
        {
            name: t('Procurement.purchaseRequestTemplate'),
            href: '/procurement/purchase-request-template',
            icon: FileCode
        }
    ]
    return (
        <div className="container">
            <h1 className="text-3xl font-bold mb-8">{t('procurement')}</h1>
            <MenuCardGrid items={subMenu} />
        </div>
    );
} 