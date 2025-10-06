// Re-export from centralized data file
export { prDocs, poDocs, deliveryPointDocs, usersPermissionTest } from "./data/mock-data";

export const permissions = {
  procurement: {
    purchase_request: [
      "view_all",
      "view_dp",
      "view",
      "create",
      "update",
      "delete",
      "approve",
      "reject",
      "send_back",
      "submit"
    ],
    purchase_order: [
      "view_all",
      "view",
      "create",
      "update",
      "delete",
      "approve",
      "reject",
      "send_back",
      "submit"
    ],
  },

  configuration: {
    delivery_point: [
      "view_all",
      "view",
      "create",
      "update",
      "delete"
    ],
  },

} as const;

// Helper type to get all permission values
export type Permission = typeof permissions[keyof typeof permissions];