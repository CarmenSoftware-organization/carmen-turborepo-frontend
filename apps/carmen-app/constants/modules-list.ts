interface ModuleItem {
    label: string;
    href: string;
    children?: ModuleItem[];
}

export const moduleItems: ModuleItem[] = [
    {
        label: "Dashboard",
        href: "/dashboard",
    },
    {
        label: "Procurement",
        href: "/procurement",
        children: [
            {
                label: "My Approval",
                href: "/procurement/my-approval",
            },
            {
                label: "Purchase Order",
                href: "/procurement/purchase-order",
            },
            {
                label: "Purchase Request",
                href: "/procurement/purchase-request",
            },
            {
                label: "Goods Received Note",
                href: "/procurement/goods-received-note",
            },
            {
                label: "Purchase Request Approvals",
                href: "/procurement/purchase-request-approvals",
            },
            {
                label: "Credit Note",
                href: "/procurement/credit-note",
            },
            {
                label: "Purchase Request Template",
                href: "/procurement/purchase-request-template",
            },
        ],
    },
    {
        label: "Configuration",
        href: "/configuration",
        children: [
            {
                label: "Currency",
                href: "/configuration/currency",
            },
            {
                label: "Delivery Point",
                href: "/configuration/delivery-point",
            },
            {
                label: "Store Location",
                href: "/configuration/store-location",
            },
            {
                label: "Department",
                href: "/configuration/department",
            },
        ],
    },
];

