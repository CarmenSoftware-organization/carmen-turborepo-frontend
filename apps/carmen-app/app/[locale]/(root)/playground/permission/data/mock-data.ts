import type { ProcurementDocument, ConfigurationDocument, UserPermissions } from "../types/permission.types";

export const prDocs: ProcurementDocument[] = [
  { id: "pr-001", title: "Office Supplies - Q1 2025", status: "pending", ownerId: "1" },
  { id: "pr-002", title: "IT Equipment Upgrade", status: "approved", ownerId: "2" },
  { id: "pr-003", title: "Cafeteria Food Ingredients", status: "rejected", ownerId: "3" },
  { id: "pr-004", title: "Marketing Materials", status: "pending", ownerId: "4" },
  { id: "pr-005", title: "Cleaning Supplies - Monthly", status: "approved", ownerId: "1" },
  { id: "pr-006", title: "Furniture for New Office", status: "pending", ownerId: "2" },
  { id: "pr-007", title: "Software Licenses Renewal", status: "approved", ownerId: "3" },
  { id: "pr-008", title: "Safety Equipment PPE", status: "pending", ownerId: "4" },
  { id: "pr-009", title: "Raw Materials - Production Line A", status: "approved", ownerId: "1" },
  { id: "pr-010", title: "Training Books and Materials", status: "rejected", ownerId: "2" },
];

export const poDocs: ProcurementDocument[] = [
  { id: "po-001", title: "Office Supplies Order - Q1 2025", status: "pending", ownerId: "1" },
  { id: "po-002", title: "IT Equipment Purchase Order", status: "approved", ownerId: "2" },
  { id: "po-003", title: "Cafeteria Food Order", status: "rejected", ownerId: "3" },
  { id: "po-004", title: "Marketing Materials Order", status: "pending", ownerId: "4" },
  { id: "po-005", title: "Cleaning Supplies Monthly Order", status: "approved", ownerId: "1" },
  { id: "po-006", title: "Furniture Purchase for New Office", status: "pending", ownerId: "2" },
  { id: "po-007", title: "Software Licenses Order", status: "approved", ownerId: "3" },
  { id: "po-008", title: "Safety Equipment PPE Order", status: "pending", ownerId: "4" },
  { id: "po-009", title: "Raw Materials Order - Line A", status: "approved", ownerId: "1" },
  { id: "po-010", title: "Training Materials Purchase", status: "rejected", ownerId: "2" },
];

export const deliveryPointDocs: ConfigurationDocument[] = [
  { id: "dp-001", title: "Central Warehouse - Bangkok", status: "active" },
  { id: "dp-002", title: "Branch Office - Chiang Mai", status: "active" },
  { id: "dp-003", title: "Distribution Center - Phuket", status: "inactive" },
  { id: "dp-004", title: "Regional Hub - Pattaya", status: "active" },
  { id: "dp-005", title: "Warehouse - Samut Prakan", status: "active" },
  { id: "dp-006", title: "Logistics Center - Nakhon Ratchasima", status: "active" },
  { id: "dp-007", title: "Delivery Point - Hat Yai", status: "inactive" },
  { id: "dp-008", title: "Storage Facility - Khon Kaen", status: "active" },
  { id: "dp-009", title: "Distribution Hub - Rayong", status: "active" },
  { id: "dp-010", title: "Transit Center - Ayutthaya", status: "inactive" },
];

export const usersPermissionTest: UserPermissions[] = [
  {
    id: "1",
    name: "Alice",
    role: "admin",
    permissions: {
      procurement: {
        purchase_request: ["view_all", "view_dp", "view", "create", "update", "delete", "approve", "reject", "send_back", "submit"],
        purchase_order: ["view_all", "view", "create", "update", "delete", "approve", "reject", "send_back", "submit"],
      },
      configuration: {
        delivery_point: ["view_all", "view", "create", "update", "delete"],
      },
    },
  },
  {
    id: "2",
    name: "Bob",
    role: "header",
    permissions: {
      procurement: {
        purchase_request: ["view_all", "view_dp", "view", "create", "update", "approve", "reject", "send_back"],
        purchase_order: ["view_all", "view", "create", "update", "approve", "reject", "send_back"],
      },
      configuration: {
        delivery_point: ["view_all", "view"],
      },
    },
  },
  {
    id: "3",
    name: "Charlie",
    role: "approver",
    permissions: {
      procurement: {
        purchase_request: ["view_dp", "view", "approve", "reject", "send_back"],
        purchase_order: ["view", "approve", "reject", "send_back"],
      },
      configuration: {
        delivery_point: ["view"],
      },
    },
  },
  {
    id: "4",
    name: "David",
    role: "requester",
    permissions: {
      procurement: {
        purchase_request: ["view", "create", "update", "submit"],
        purchase_order: ["view", "create", "update", "submit"],
      },
      configuration: {
        delivery_point: ["view"],
      },
    },
  },
  {
    id: "5",
    name: "Eve",
    role: "guest",
    permissions: {
      procurement: {
        purchase_request: ["view"],
        purchase_order: ["view"],
      },
      configuration: {
        delivery_point: ["view"],
      },
    },
  },
];
