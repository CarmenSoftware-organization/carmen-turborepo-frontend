interface ModuleItem {
  labelKey: string;
  href: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: ModuleItem[];
}

import {
  ShoppingCart,
  Settings,
  Package,
  Users,
  Store,
  CalendarClock,
  Factory,
  BarChart2,
  DollarSign,
  HelpCircle,
  User,
  ChartPie,
  FileText,
  ClipboardList,
  Truck,
  CreditCard,
  Scale,
  FileSpreadsheet,
  Box,
  Tag,
  BarChart3,
  Ruler,
  MapPin,
  Building,
  Receipt,
  Plus,
  AlertTriangle,
  Eye,
  Calendar,
  Calculator,
  TrendingUp,
  PieChart,
  Shield,
  Bell,
  Key,
  HardDrive,
  Network,
  Briefcase,
  BookOpen,
  Video,
  HelpCircle as HelpIcon,
  MessageCircle,
  Download,
  Zap,
  UserCheck,
  FileCheck,
  Hotel,
  Coins,
  Warehouse,
  File,
  ShieldCheck,
} from "lucide-react";

export const moduleItems: ModuleItem[] = [
  {
    labelKey: "Modules.dashboard",
    href: "/dashboard",
    icon: ChartPie,
  },
  {
    labelKey: "Modules.procurement",
    href: "/procurement",
    icon: ShoppingCart,
    children: [
      {
        labelKey: "Modules.Procurement.dashboard",
        href: "/procurement/dashboard",
        icon: PieChart,
      },
      {
        labelKey: "Modules.Procurement.myApproval",
        href: "/procurement/my-approval",
        icon: FileCheck,
      },
      {
        labelKey: "Modules.Procurement.purchaseRequest",
        href: "/procurement/purchase-request",
        icon: ClipboardList,
      },
      {
        labelKey: "Modules.Procurement.purchaseOrder",
        href: "/procurement/purchase-order",
        icon: FileText,
      },
      {
        labelKey: "Modules.Procurement.goodsReceivedNote",
        href: "/procurement/goods-received-note",
        icon: Truck,
      },
      {
        labelKey: "Modules.Procurement.creditNote",
        href: "/procurement/credit-note",
        icon: CreditCard,
      },
      {
        labelKey: "Modules.Procurement.purchaseRequestTemplate",
        href: "/procurement/purchase-request-template",
        icon: FileSpreadsheet,
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
        icon: Box,
      },
      {
        labelKey: "Modules.ProductManagement.category",
        href: "/product-management/category",
        icon: Tag,
      },
    ],
  },
  {
    labelKey: "Modules.vendorManagement",
    href: "/vendor-management",
    icon: Hotel,
    children: [
      {
        labelKey: "Modules.VendorManagement.manageVendors",
        href: "/vendor-management/vendor",
        icon: Hotel,
      },
      {
        labelKey: "Modules.VendorManagement.priceLists",
        href: "/vendor-management/price-list",
        icon: Coins,
      },
      {
        labelKey: "Modules.VendorManagement.priceListtemplate",
        href: "/vendor-management/price-list-template",
        icon: File,
      },
      {
        labelKey: "Modules.VendorManagement.request_for_price_list",
        href: "/vendor-management/request-price-list",
        icon: FileSpreadsheet,
      },
      {
        labelKey: "Modules.VendorManagement.vendorEntry",
        href: "/vendor-management/vendor-entry",
        icon: Factory,
      },
      // {
      //   labelKey: "Modules.VendorManagement.priceComparisons",
      //   href: "/vendor-management/price-comparison",
      //   icon: Scale,
      // },
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
        icon: ClipboardList,
      },
      {
        labelKey: "Modules.StoreOperations.stockReplenishment",
        href: "/store-operation/stock-replenishment",
        icon: Package,
      },
      {
        labelKey: "Modules.StoreOperations.wastageReporting",
        href: "/store-operation/wastage-reporting",
        icon: AlertTriangle,
      },
    ],
  },
  {
    labelKey: "Modules.inventoryManagement",
    href: "/inventory-management",
    icon: Ruler,
    children: [
      {
        labelKey: "Modules.InventoryManagement.inventoryAdjustments",
        href: "/inventory-management/inventory-adjustment",
        icon: Plus,
      },
      {
        labelKey: "Modules.InventoryManagement.spotCheck",
        href: "/inventory-management/spot-check",
        icon: Eye,
      },
      {
        labelKey: "Modules.InventoryManagement.physicalCountManagement",
        href: "/inventory-management/physical-count-management",
        icon: ClipboardList,
      },
      {
        labelKey: "Modules.InventoryManagement.periodEnd",
        href: "/inventory-management/period-end",
        icon: Calendar,
      },
      {
        labelKey: "Modules.InventoryManagement.stockOverview",
        href: "/inventory-management/stock-overview",
        icon: BarChart3,
        children: [
          {
            labelKey: "Modules.InventoryManagement.stockOverview",
            href: "/inventory-management/stock-overview/overview",
            icon: Eye,
          },
          {
            labelKey: "Modules.InventoryManagement.StockOverview.inventoryBalance",
            href: "/inventory-management/stock-overview/inventory-balance",
            icon: Calculator,
          },
          {
            labelKey: "Modules.InventoryManagement.StockOverview.inventoryAging",
            href: "/inventory-management/stock-overview/inventory-aging",
            icon: TrendingUp,
          },
          {
            labelKey: "Modules.InventoryManagement.StockOverview.stockCard",
            href: "/inventory-management/stock-overview/stock-card",
            icon: FileText,
          },
          {
            labelKey: "Modules.InventoryManagement.StockOverview.slowMoving",
            href: "/inventory-management/stock-overview/slow-moving",
            icon: AlertTriangle,
          },
        ],
      },
    ],
  },
  {
    labelKey: "Modules.operationalPlanning",
    href: "/operational-planning",
    icon: CalendarClock,
    children: [
      {
        labelKey: "Modules.OperationalPlanning.RecipesManagement.title",
        href: "/operational-planning/recipe-management",
        icon: BookOpen,
        children: [
          {
            labelKey: "Modules.OperationalPlanning.RecipesManagement.recipe",
            href: "/operational-planning/recipe-management/recipe",
            icon: FileText,
          },
          {
            labelKey: "Modules.OperationalPlanning.RecipesManagement.category",
            href: "/operational-planning/recipe-management/category",
            icon: Tag,
          },
          {
            labelKey: "Modules.OperationalPlanning.RecipesManagement.cuisineType",
            href: "/operational-planning/recipe-management/cuisine-type",
            icon: MapPin,
          },
        ],
      },
      {
        labelKey: "Modules.OperationalPlanning.menuEngineering",
        href: "/operational-planning/menu-engineering",
        icon: BarChart3,
      },
      {
        labelKey: "Modules.OperationalPlanning.demandForecasting",
        href: "/operational-planning/demand-forecasting",
        icon: TrendingUp,
      },
      {
        labelKey: "Modules.OperationalPlanning.inventoryPlanning",
        href: "/operational-planning/inventory-planning",
        icon: Package,
      },
    ],
  },
  // {
  //   labelKey: "Modules.production",
  //   href: "/production",
  //   icon: Factory,
  //   children: [
  //     {
  //       labelKey: "Modules.Production.recipeExecution",
  //       href: "/production/recipe-execution",
  //       icon: BookOpen,
  //     },
  //     {
  //       labelKey: "Modules.Production.batchProduction",
  //       href: "/production/batch-production",
  //       icon: Package,
  //     },
  //     {
  //       labelKey: "Modules.Production.wastageTracking",
  //       href: "/production/wastage-tracking",
  //       icon: AlertTriangle,
  //     },
  //     {
  //       labelKey: "Modules.Production.qualityControl",
  //       href: "/production/quality-control",
  //       icon: Shield,
  //     },
  //   ],
  // },
  {
    labelKey: "Modules.reportingAndAnalytics",
    href: "/reporting-analytic",
    icon: BarChart2,
    children: [
      {
        labelKey: "Modules.ReportingAndAnalytics.operationalReports",
        href: "/reporting-analytic/operational-reports",
        icon: BarChart3,
      },
      {
        labelKey: "Modules.ReportingAndAnalytics.financialReports",
        href: "/reporting-analytic/financial-reports",
        icon: DollarSign,
      },
      {
        labelKey: "Modules.ReportingAndAnalytics.inventoryReports",
        href: "/reporting-analytic/inventory-reports",
        icon: Package,
      },
      {
        labelKey: "Modules.ReportingAndAnalytics.vendorPerformance",
        href: "/reporting-analytic/vendor-performance",
        icon: Users,
      },
      {
        labelKey: "Modules.ReportingAndAnalytics.costAnalysis",
        href: "/reporting-analytic/cost-analysis",
        icon: Calculator,
      },
      {
        labelKey: "Modules.ReportingAndAnalytics.salesAnalysis",
        href: "/reporting-analytic/sales-analysis",
        icon: TrendingUp,
      },
    ],
  },
  {
    labelKey: "Modules.finance",
    href: "/finance",
    icon: DollarSign,
    children: [
      {
        labelKey: "Modules.Finance.accountCodeMapping",
        href: "/finance/account-code-mapping",
        icon: FileText,
      },
      {
        labelKey: "Modules.Finance.budgetPlanningAndControl",
        href: "/finance/budget-planning-and-control",
        icon: Calculator,
      },
      {
        labelKey: "Modules.Finance.creditTerms",
        href: "/finance/credit-term",
        icon: CreditCard,
      },
      // {
      //   labelKey: "Modules.Finance.vat",
      //   href: "/finance/vat",
      //   icon: Receipt,
      // },
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
        icon: DollarSign,
      },
      {
        labelKey: "Modules.Configuration.exchangeRates",
        href: "/configuration/exchange-rate",
        icon: TrendingUp,
      },
      {
        labelKey: "Modules.Configuration.deliveryPoint",
        href: "/configuration/delivery-point",
        icon: MapPin,
      },
      {
        labelKey: "Modules.Configuration.storeLocation",
        href: "/configuration/location",
        icon: Building,
      },
      {
        labelKey: "Modules.Configuration.department",
        href: "/configuration/department",
        icon: Warehouse,
      },
      {
        labelKey: "Modules.Configuration.tax_profile",
        href: "/configuration/tax-profile",
        icon: Receipt,
      },
      {
        labelKey: "Modules.Configuration.extra_cost",
        href: "/configuration/extra-cost",
        icon: DollarSign,
      },
      {
        labelKey: "Modules.Configuration.business_type",
        href: "/configuration/business-type",
        icon: Briefcase,
      },
      {
        labelKey: "Modules.ProductManagement.unit",
        href: "/configuration/unit",
        icon: Ruler,
      },
      {
        labelKey: "Modules.Configuration.adjustment_type",
        href: "/configuration/adjustment-type",
        icon: Ruler,
      },
    ],
  },
  {
    labelKey: "Modules.SystemAdministration.systemAdministration",
    href: "/system-administration",
    icon: Settings,
    children: [
      // {
      //   labelKey: "Modules.SystemAdministration.userManagement",
      //   href: "/system-administration/user-management",
      //   icon: Users,
      // },
      {
        labelKey: "Modules.SystemAdministration.workflowManagement",
        href: "/system-administration/workflow-management",
        icon: Network,
      },
      {
        labelKey: "Modules.SystemAdministration.role",
        href: "/system-administration/role",
        icon: ShieldCheck,
      },
      // {
      //   labelKey: "Modules.SystemAdministration.generalSettings",
      //   href: "/system-administration/general-setting",
      //   icon: Settings,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.notificationPreferences",
      //   href: "/system-administration/notification-preferences",
      //   icon: Bell,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.licenseManagement",
      //   href: "/system-administration/license-management",
      //   icon: Key,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.securitySettings",
      //   href: "/system-administration/security-setting",
      //   icon: Shield,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.dataBackupAndRecovery",
      //   href: "/system-administration/data-backup-and-recovery",
      //   icon: HardDrive,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.cluster",
      //   href: "/system-administration/cluster",
      //   icon: Network,
      // },
      // {
      //   labelKey: "Modules.SystemAdministration.businessUnit",
      //   href: "/system-administration/business-unit",
      //   icon: Briefcase,
      // },
      {
        labelKey: "Modules.SystemAdministration.user",
        href: "/system-administration/user",
        icon: UserCheck,
      },
      {
        labelKey: "Modules.SystemAdministration.documentManagement",
        href: "/system-administration/document-management",
        icon: FileCheck,
      },
    ],
  },
  // {
  //   labelKey: "Modules.helpAndSupport",
  //   href: "/help-support",
  //   icon: HelpCircle,
  //   children: [
  //     {
  //       labelKey: "Modules.HelpAndSupport.userManuals",
  //       href: "/help-support/user-manuals",
  //       icon: BookOpen,
  //     },
  //     {
  //       labelKey: "Modules.HelpAndSupport.videoTutorials",
  //       href: "/help-support/video-tutorials",
  //       icon: Video,
  //     },
  //     {
  //       labelKey: "Modules.HelpAndSupport.faqs",
  //       href: "/help-support/faqs",
  //       icon: HelpIcon,
  //     },
  //     {
  //       labelKey: "Modules.HelpAndSupport.supportTicketSystem",
  //       href: "/help-support/support-ticket-system",
  //       icon: MessageCircle,
  //     },
  //     {
  //       labelKey: "Modules.HelpAndSupport.systemUpdatesAndReleaseNotes",
  //       href: "/help-support/system-updates-and-release-notes",
  //       icon: Download,
  //     },
  //   ],
  // },
  // {
  //   labelKey: "Modules.systemIntegration",
  //   href: "/system-integration",
  //   icon: Package,
  //   children: [
  //     {
  //       labelKey: "Modules.SystemIntegration.pos",
  //       href: "/system-integration/pos",
  //       icon: Zap,
  //     },
  //   ],
  // },
  {
    labelKey: "Modules.profile",
    href: "/profile",
    icon: User,
  },
];
