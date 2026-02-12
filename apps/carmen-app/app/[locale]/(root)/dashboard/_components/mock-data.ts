// Mock data for dashboard

export const kpiData = {
  totalSpend: {
    value: 1245890,
    change: 12.5,
    comparison: "vs ฿1,107,458 last month",
  },
  activePOs: {
    value: 47,
    change: 8.2,
    subtitle: "23 pending approval",
  },
  lowStockItems: {
    value: 18,
    change: -3.1,
    subtitle: "5 critical, 13 warning",
  },
  vendorRating: {
    value: "4.6/5.0",
    change: 5.7,
    subtitle: "Based on 142 evaluations",
  },
};

export const monthlySpendData = [
  { month: "Jan", budget: 1000000, actual: 920000 },
  { month: "Feb", budget: 1000000, actual: 880000 },
  { month: "Mar", budget: 1050000, actual: 950000 },
  { month: "Apr", budget: 1050000, actual: 1020000 },
  { month: "May", budget: 1100000, actual: 1080000 },
  { month: "Jun", budget: 1100000, actual: 1050000 },
];

export const spendByCategoryData = [
  { name: "Food & Beverage", value: 46.6, color: "#3b82f6" },
  { name: "Maintenance", value: 21.3, color: "#f59e0b" },
  { name: "Cleaning", value: 14.4, color: "#10b981" },
  { name: "Utilities", value: 17.7, color: "#8b5cf6" },
];

export const pendingApprovals = [
  {
    id: "PR-2024-0156",
    description: "Kitchen Supplies",
    amount: 45890,
  },
  {
    id: "PR-2024-0157",
    description: "Cleaning Products",
    amount: 12340,
  },
  {
    id: "PR-2024-0158",
    description: "Beverages",
    amount: 67200,
  },
];

export const recentActivities = [
  {
    id: 1,
    icon: "approve" as const,
    title: "PO-2024-0234 approved",
    subtitle: "by Somchai Prasert • 15 minutes ago",
  },
  {
    id: 2,
    icon: "complete" as const,
    title: "GRN-2024-0445 completed",
    subtitle: "by Niran Sombat • 1 hour ago",
  },
  {
    id: 3,
    icon: "alert" as const,
    title: "Low stock alert: Rice (5kg)",
    subtitle: "System notification • 2 hours ago",
  },
  {
    id: 4,
    icon: "match" as const,
    title: "Invoice INV-2024-1234 matched",
    subtitle: "by Apinya Chaiwong • 3 hours ago",
  },
  {
    id: 5,
    icon: "vendor" as const,
    title: "New vendor added: Thai Food Co.",
    subtitle: "by Somchai Prasert • 5 hours ago",
  },
];

export const inventoryAlerts = [
  {
    key: "1",
    product: "Jasmine Rice 5kg",
    sku: "SKU-001234",
    currentStock: "15 bags",
    minLevel: "50 bags",
    status: "critical" as const,
    location: "Main Warehouse",
  },
  {
    key: "2",
    product: "Cooking Oil 5L",
    sku: "SKU-001567",
    currentStock: "8 bottles",
    minLevel: "30 bottles",
    status: "critical" as const,
    location: "Kitchen Storage",
  },
  {
    key: "3",
    product: "Drinking Water 24pk",
    sku: "SKU-002341",
    currentStock: "45 packs",
    minLevel: "60 packs",
    status: "warning" as const,
    location: "Main Warehouse",
  },
];
