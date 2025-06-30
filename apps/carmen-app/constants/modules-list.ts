interface ModuleItem {
    labelKey: string;
    href: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    children?: ModuleItem[];
}

import { ShoppingCart, Settings, Package, Users, Store, CalendarClock, Factory, BarChart2, DollarSign, HelpCircle, User } from "lucide-react";

export const moduleItems: ModuleItem[] = [
    {
        labelKey: "Modules.procurement",
        href: "/procurement",
        icon: ShoppingCart,
        children: [
            {
                labelKey: "Modules.Procurement.dashboard",
                href: "/procurement/dashboard",
            },
            {
                labelKey: "Modules.Procurement.myApproval",
                href: "/procurement/my-approval",
            },
            {
                labelKey: "Modules.Procurement.purchaseRequest",
                href: "/procurement/purchase-request",
            },
            {
                labelKey: "Modules.Procurement.purchaseOrder",
                href: "/procurement/purchase-order",
            },
            {
                labelKey: "Modules.Procurement.goodsReceivedNote",
                href: "/procurement/goods-received-note",
            },
            {
                labelKey: "Modules.Procurement.creditNote",
                href: "/procurement/credit-note",
            },
            {
                labelKey: "Modules.Procurement.vendorComparison",
                href: "/procurement/vendor-comparison",
            },
            {
                labelKey: "Modules.Procurement.purchaseRequestApprovals",
                href: "/procurement/purchase-request-approval",
            },

            {
                labelKey: "Modules.Procurement.purchaseRequestTemplate",
                href: "/procurement/purchase-request-template",
            },
        ],
    },
    {
        labelKey: "Modules.productManagement",
        href: "/product-management",
        icon: Package,
        children: [
            {
                labelKey: "Modules.ProductManagement.product",
                href: "/product-management/product",
            },
            {
                labelKey: "Modules.ProductManagement.category",
                href: "/product-management/category",
            },
            {
                labelKey: "Modules.ProductManagement.report",
                href: "/product-management/report",
            },
            {
                labelKey: "Modules.ProductManagement.unit",
                href: "/product-management/unit",
            }
        ],
    },
    {
        labelKey: "Modules.vendorManagement",
        href: "/vendor-management",
        icon: Users,
        children: [
            {
                labelKey: "Modules.VendorManagement.manageVendors",
                href: "/vendor-management/vendor",
            },
            {
                labelKey: "Modules.VendorManagement.priceLists",
                href: "/vendor-management/price-list",
            },
            {
                labelKey: "Modules.VendorManagement.priceComparisons",
                href: "/vendor-management/price-comparison",
            },
        ],
    },
    {
        labelKey: "Modules.storeOperations",
        href: "/store-operation",
        icon: Store,
        children: [
            {
                labelKey: "Modules.StoreOperations.storeRequisitions",
                href: "/store-operation/store-requisition",
            },
            {
                labelKey: "Modules.StoreOperations.stockReplenishment",
                href: "/store-operation/stock-replenishment",
            },
            {
                labelKey: "Modules.StoreOperations.wastageReporting",
                href: "/store-operation/wastage-reporting",
            },
        ],
    },
    {
        labelKey: "Modules.inventoryManagement",
        href: "/inventory-management",
        icon: Package,
        children: [
            {
                labelKey: "Modules.InventoryManagement.inventoryAdjustments",
                href: "/inventory-management/inventory-adjustment",
            },
            {
                labelKey: "Modules.InventoryManagement.spotCheck",
                href: "/inventory-management/spot-check",
            },
            {
                labelKey: "Modules.InventoryManagement.physicalCountManagement",
                href: "/inventory-management/physical-count-management",
            },
            {
                labelKey: "Modules.InventoryManagement.periodEnd",
                href: "/inventory-management/period-end",
            },
            {
                labelKey: "Modules.InventoryManagement.stockOverview",
                href: "/inventory-management/stock-overview",
                children: [
                    {
                        labelKey: "Modules.InventoryManagement.stockOverview",
                        href: "/inventory-management/stock-overview/overview",
                    },
                    {
                        labelKey: "Modules.InventoryManagement.StockOverview.inventoryBalance",
                        href: "/inventory-management/stock-overview/inventory-balance",
                    },
                    {
                        labelKey: "Modules.InventoryManagement.StockOverview.inventoryAging",
                        href: "/inventory-management/stock-overview/inventory-aging",
                    },
                    {
                        labelKey: "Modules.InventoryManagement.StockOverview.stockCard",
                        href: "/inventory-management/stock-overview/stock-card",
                    },
                    {
                        labelKey: "Modules.InventoryManagement.StockOverview.slowMoving",
                        href: "/inventory-management/stock-overview/slow-moving",
                    },

                ]
            },
        ]
    },
    {
        labelKey: "Modules.operationalPlanning",
        href: "/operational-planning",
        icon: CalendarClock,
        children: [
            {
                labelKey: "Modules.OperationalPlanning.RecipesManagement.title",
                href: "/operational-planning/recipe-management",
                children: [
                    {
                        labelKey: "Modules.OperationalPlanning.RecipesManagement.recipe",
                        href: "/operational-planning/recipe-management/recipe",
                    },
                    {
                        labelKey: "Modules.OperationalPlanning.RecipesManagement.category",
                        href: "/operational-planning/recipe-management/category",
                    },
                    {
                        labelKey: "Modules.OperationalPlanning.RecipesManagement.cuisineType",
                        href: "/operational-planning/recipe-management/cuisine-type",
                    },

                ]
            },
            {
                labelKey: "Modules.OperationalPlanning.menuEngineering",
                href: "/operational-planning/menu-engineering",
            },
            {
                labelKey: "Modules.OperationalPlanning.demandForecasting",
                href: "/operational-planning/demand-forecasting",
            },
            {
                labelKey: "Modules.OperationalPlanning.inventoryPlanning",
                href: "/operational-planning/inventory-planning",
            }
        ]
    },
    {
        labelKey: "Modules.production",
        href: "/production",
        icon: Factory,
        children: [
            {
                labelKey: "Modules.Production.recipeExecution",
                href: "/production/recipe-execution",
            },
            {
                labelKey: "Modules.Production.batchProduction",
                href: "/production/batch-production",
            },
            {
                labelKey: "Modules.Production.wastageTracking",
                href: "/production/wastage-tracking",
            },
            {
                labelKey: "Modules.Production.qualityControl",
                href: "/production/quality-control",
            },
        ]
    },
    {
        labelKey: "Modules.reportingAndAnalytics",
        href: "/reporting-analytic",
        icon: BarChart2,
        children: [
            {
                labelKey: "Modules.ReportingAndAnalytics.operationalReports",
                href: "/reporting-analytic/operational-reports",
            },
            {
                labelKey: "Modules.ReportingAndAnalytics.financialReports",
                href: "/reporting-analytic/financial-reports",
            },
            {
                labelKey: "Modules.ReportingAndAnalytics.inventoryReports",
                href: "/reporting-analytic/inventory-reports",
            },
            {
                labelKey: "Modules.ReportingAndAnalytics.vendorPerformance",
                href: "/reporting-analytic/vendor-performance",
            },
            {
                labelKey: "Modules.ReportingAndAnalytics.costAnalysis",
                href: "/reporting-analytic/cost-analysis",
            },
            {
                labelKey: "Modules.ReportingAndAnalytics.salesAnalysis",
                href: "/reporting-analytic/sales-analysis",
            },
        ]
    },
    {
        labelKey: "Modules.finance",
        href: "/finance",
        icon: DollarSign,
        children: [
            {
                labelKey: "Modules.Finance.accountCodeMapping",
                href: "/finance/account-code-mapping",
            },
            {
                labelKey: "Modules.Finance.exchangeRates",
                href: "/finance/exchange-rates",
            },
            {
                labelKey: "Modules.Finance.budgetPlanningAndControl",
                href: "/finance/budget-planning-and-control",
            },
            {
                labelKey: "Modules.Finance.creditTerms",
                href: "/finance/credit-term",
            },
            {
                labelKey: "Modules.Finance.vat",
                href: "/finance/vat",
            },
        ]
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
                labelKey: "Modules.Configuration.exchangeRates",
                href: "/configuration/exchange-rate",
            },
            {
                labelKey: "Modules.Configuration.deliveryPoint",
                href: "/configuration/delivery-point",
            },
            {
                labelKey: "Modules.Configuration.storeLocation",
                href: "/configuration/location",
            },
            {
                labelKey: "Modules.Configuration.department",
                href: "/configuration/department",
            },
        ],
    },
    {
        labelKey: "Modules.SystemAdministration.systemAdministration",
        href: "/system-administration",
        icon: Settings,
        children: [
            {
                labelKey: "Modules.SystemAdministration.userManagement",
                href: "/system-administration/user-management",
            },
            {
                labelKey: "Modules.SystemAdministration.workflowManagement",
                href: "/system-administration/workflow-management",
            },
            {
                labelKey: "Modules.SystemAdministration.generalSettings",
                href: "/system-administration/general-setting",
            },
            {
                labelKey: "Modules.SystemAdministration.notificationPreferences",
                href: "/system-administration/notification-preferences",
            },
            {
                labelKey: "Modules.SystemAdministration.licenseManagement",
                href: "/system-administration/license-management",
            },
            {
                labelKey: "Modules.SystemAdministration.securitySettings",
                href: "/system-administration/security-setting",
            },
            {
                labelKey: "Modules.SystemAdministration.dataBackupAndRecovery",
                href: "/system-administration/data-backup-and-recovery",
            },
            {
                labelKey: "Modules.SystemAdministration.cluster",
                href: "/system-administration/cluster",
            },
            {
                labelKey: "Modules.SystemAdministration.businessUnit",
                href: "/system-administration/business-unit",
            },
            {
                labelKey: "Modules.SystemAdministration.user",
                href: "/system-administration/user",
            },
        ]
    },
    {
        labelKey: "Modules.helpAndSupport",
        href: "/help-support",
        icon: HelpCircle,
        children: [
            {
                labelKey: "Modules.HelpAndSupport.userManuals",
                href: "/help-support/user-manuals",
            },
            {
                labelKey: "Modules.HelpAndSupport.videoTutorials",
                href: "/help-support/video-tutorials",
            },
            {
                labelKey: "Modules.HelpAndSupport.faqs",
                href: "/help-support/faqs",
            },
            {
                labelKey: "Modules.HelpAndSupport.supportTicketSystem",
                href: "/help-support/support-ticket-system",
            },
            {
                labelKey: "Modules.HelpAndSupport.systemUpdatesAndReleaseNotes",
                href: "/help-support/system-updates-and-release-notes",
            },
        ]
    },
    {
        labelKey: "Modules.systemIntegration",
        href: "/system-integration",
        icon: Package,
        children: [
            {
                labelKey: "Modules.SystemIntegration.pos",
                href: "/system-integration/pos",
            },
        ]
    },
    {
        labelKey: "Modules.profile",
        href: "/profile",
        icon: User,
    }
];

