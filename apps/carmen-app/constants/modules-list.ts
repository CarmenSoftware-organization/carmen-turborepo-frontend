interface ModuleItem {
    labelKey: string;
    href: string;
    children?: ModuleItem[];
}

export const moduleItems: ModuleItem[] = [
    {
        labelKey: "Modules.dashboard",
        href: "/dashboard",
    },
    {
        labelKey: "Modules.procurement",
        href: "/procurement",
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

