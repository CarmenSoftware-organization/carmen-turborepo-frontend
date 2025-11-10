/**
 * Error Messages Constants for Purchase Request
 */

export const PR_ERROR_MESSAGES = {
  // Validation Errors
  VALIDATION: {
    REQUIRED_FIELDS: "Please fill in all required fields",
    LOCATION_REQUIRED: "Location is required",
    PRODUCT_REQUIRED: "Product is required",
    QUANTITY_REQUIRED: "Quantity is required",
    QUANTITY_INVALID: "Quantity must be a valid number and not negative",
    UNIT_REQUIRED: "Unit is required",
  },

  // API Errors
  API: {
    CREATE_FAILED: "Failed to create purchase request",
    UPDATE_FAILED: "Failed to update purchase request",
    SUBMIT_FAILED: "Failed to submit purchase request",
    APPROVE_FAILED: "Failed to approve purchase request",
    REJECT_FAILED: "Failed to reject purchase request",
    REVIEW_FAILED: "Failed to review purchase request",
    SEND_BACK_FAILED: "Failed to send back purchase request",
    PURCHASE_FAILED: "Failed to process purchase",
    FETCH_FAILED: "Failed to fetch purchase request data",
  },

  // Success Messages
  SUCCESS: {
    CREATED: "Purchase request created successfully",
    UPDATED: "Purchase request updated successfully",
    SUBMITTED: "Purchase request submitted successfully",
    APPROVED: "Purchase request approved successfully",
    REJECTED: "Purchase request rejected successfully",
    REVIEWED: "Purchase request reviewed successfully",
    SENT_BACK: "Purchase request sent back successfully",
    PURCHASED: "Purchase processed successfully",
  },

  // Workflow Errors
  WORKFLOW: {
    STAGE_REQUIRED: "Please select a stage for review",
    STAGE_FETCH_FAILED: "Failed to fetch workflow stages",
  },

  // Item Errors
  ITEM: {
    DELETE_FAILED: "Failed to delete item",
    ADD_FAILED: "Failed to add item",
    UPDATE_FAILED: "Failed to update item",
  },

  // General Errors
  GENERAL: {
    UNAUTHORIZED: "Unauthorized access",
    NETWORK_ERROR: "Network error. Please check your connection",
    UNKNOWN_ERROR: "An unexpected error occurred",
  },
} as const;

export type ErrorMessageKey = keyof typeof PR_ERROR_MESSAGES;
