interface ModuleItem {
    labelKey: string;
    href: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: ModuleItem[];
}

import { LayoutDashboard, ShoppingCart, Settings } from "lucide-react";

export const moduleItems: ModuleItem[] = [
    {
        labelKey: "Modules.dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        labelKey: "Modules.procurement",
        href: "/procurement",
        icon: ShoppingCart,
        children: [
            {
                labelKey: "Modules.Procurement.myApproval",
                href: "/procurement/my-approval",
            },
            {
                labelKey: "Modules.Procurement.purchaseOrder",
                href: "/procurement/purchase-order",
            },
            {
                labelKey: "Modules.Procurement.purchaseRequest",
                href: "/procurement/purchase-request",
            },
            {
                labelKey: "Modules.Procurement.goodsReceivedNote",
                href: "/procurement/goods-received-note",
            },
            {
                labelKey: "Modules.Procurement.purchaseRequestApprovals",
                href: "/procurement/purchase-request-approvals",
            },
            {
                labelKey: "Modules.Procurement.creditNote",
                href: "/procurement/credit-note",
            },
            {
                labelKey: "Modules.Procurement.purchaseRequestTemplate",
                href: "/procurement/purchase-request-template",
            },
        ],
    },
    {
        labelKey: "Modules.configuration",
        href: "/configuration",
        icon: Settings,
        children: [
            {
                labelKey: "Modules.Configuration.currency",
                href: "/configuration/currency",
            },
            {
                labelKey: "Modules.Configuration.deliveryPoint",
                href: "/configuration/delivery-point",
            },
            {
                labelKey: "Modules.Configuration.storeLocation",
                href: "/configuration/store-location",
            },
            {
                labelKey: "Modules.Configuration.department",
                href: "/configuration/department",
            },
        ],
    },
];

