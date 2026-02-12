// Procurement Dashboard Mock Data

export const procurementKpi = {
  purchaseRequests: {
    total: 156,
    change: 12.3,
    subtitle: "32 pending, 118 approved, 6 rejected",
  },
  purchaseOrders: {
    total: 89,
    change: 8.7,
    subtitle: "15 open, 68 completed, 6 partial",
  },
  goodsReceived: {
    total: 72,
    change: 15.2,
    subtitle: "This month completed",
  },
  pendingApprovals: {
    total: 14,
    change: -22.0,
    subtitle: "Awaiting your action",
  },
};

export const prStatusData = [
  { name: "Approved", value: 118, color: "#10b981" },
  { name: "Pending", value: 32, color: "#f59e0b" },
  { name: "Rejected", value: 6, color: "#ef4444" },
];

export const poStatusData = [
  { name: "Completed", value: 68, color: "#10b981" },
  { name: "Open", value: 15, color: "#3b82f6" },
  { name: "Partial", value: 6, color: "#f59e0b" },
];

export const monthlyProcurementData = [
  { month: "Jul", pr: 22, po: 14, grn: 10 },
  { month: "Aug", pr: 28, po: 18, grn: 15 },
  { month: "Sep", pr: 24, po: 16, grn: 13 },
  { month: "Oct", pr: 30, po: 20, grn: 17 },
  { month: "Nov", pr: 26, po: 19, grn: 16 },
  { month: "Dec", pr: 32, po: 22, grn: 18 },
  { month: "Jan", pr: 35, po: 24, grn: 20 },
  { month: "Feb", pr: 28, po: 18, grn: 15 },
];

export const recentPurchaseRequests = [
  {
    id: "PR-2024-0198",
    title: "Kitchen Equipment",
    requester: "Somchai Prasert",
    amount: 125000,
    status: "pending" as const,
    date: "12 Feb 2025",
  },
  {
    id: "PR-2024-0197",
    title: "Cleaning Supplies Q1",
    requester: "Apinya Chaiwong",
    amount: 34500,
    status: "approved" as const,
    date: "11 Feb 2025",
  },
  {
    id: "PR-2024-0196",
    title: "Fresh Produce - Weekly",
    requester: "Niran Sombat",
    amount: 28900,
    status: "approved" as const,
    date: "11 Feb 2025",
  },
  {
    id: "PR-2024-0195",
    title: "Office Stationery",
    requester: "Somchai Prasert",
    amount: 8750,
    status: "rejected" as const,
    date: "10 Feb 2025",
  },
  {
    id: "PR-2024-0194",
    title: "Beverage Restock",
    requester: "Apinya Chaiwong",
    amount: 67200,
    status: "approved" as const,
    date: "10 Feb 2025",
  },
];

export const recentPurchaseOrders = [
  {
    id: "PO-2024-0312",
    vendor: "Thai Food Supply Co.",
    amount: 245000,
    items: 12,
    status: "open" as const,
    date: "12 Feb 2025",
  },
  {
    id: "PO-2024-0311",
    vendor: "CleanPro Services",
    amount: 34500,
    items: 8,
    status: "completed" as const,
    date: "11 Feb 2025",
  },
  {
    id: "PO-2024-0310",
    vendor: "Fresh Market Ltd.",
    amount: 89200,
    items: 24,
    status: "completed" as const,
    date: "10 Feb 2025",
  },
  {
    id: "PO-2024-0309",
    vendor: "Kitchen World",
    amount: 156000,
    items: 5,
    status: "partial" as const,
    date: "09 Feb 2025",
  },
  {
    id: "PO-2024-0308",
    vendor: "Beverage Direct",
    amount: 67200,
    items: 15,
    status: "completed" as const,
    date: "08 Feb 2025",
  },
];

export const topVendors = [
  { name: "Thai Food Supply Co.", spend: 1250000, orders: 45, onTime: 96 },
  { name: "Fresh Market Ltd.", spend: 890000, orders: 38, onTime: 92 },
  { name: "Kitchen World", spend: 650000, orders: 22, onTime: 88 },
  { name: "CleanPro Services", spend: 420000, orders: 18, onTime: 95 },
  { name: "Beverage Direct", spend: 380000, orders: 28, onTime: 91 },
];

export const pendingApprovalItems = [
  {
    id: "PR-2024-0198",
    title: "Kitchen Equipment",
    requester: "Somchai Prasert",
    amount: 125000,
    submittedAt: "2 hours ago",
    priority: "high" as const,
  },
  {
    id: "PR-2024-0193",
    title: "Maintenance Tools",
    requester: "Niran Sombat",
    amount: 45600,
    submittedAt: "5 hours ago",
    priority: "medium" as const,
  },
  {
    id: "PR-2024-0191",
    title: "Guest Amenities",
    requester: "Apinya Chaiwong",
    amount: 18900,
    submittedAt: "1 day ago",
    priority: "low" as const,
  },
];
