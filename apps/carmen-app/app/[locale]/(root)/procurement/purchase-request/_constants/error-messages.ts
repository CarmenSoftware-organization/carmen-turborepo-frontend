export const PR_ERROR_MESSAGES = {
  // Validation Errors
  VALIDATION: {
    REQUIRED_FIELDS: "errors.validation.required_fields",
    LOCATION_REQUIRED: "errors.validation.location_required",
    PRODUCT_REQUIRED: "errors.validation.product_required",
    QUANTITY_REQUIRED: "errors.validation.quantity_required",
    QUANTITY_INVALID: "errors.validation.quantity_invalid",
    UNIT_REQUIRED: "errors.validation.unit_required",
  },

  // API Errors
  API: {
    CREATE_FAILED: "errors.api.create_failed",
    UPDATE_FAILED: "errors.api.update_failed",
    SUBMIT_FAILED: "errors.api.submit_failed",
    APPROVE_FAILED: "errors.api.approve_failed",
    REJECT_FAILED: "errors.api.reject_failed",
    REVIEW_FAILED: "errors.api.review_failed",
    SEND_BACK_FAILED: "errors.api.send_back_failed",
    PURCHASE_FAILED: "errors.api.purchase_failed",
    FETCH_FAILED: "errors.api.fetch_failed",
  },

  // Success Messages
  SUCCESS: {
    CREATED: "errors.success.created",
    UPDATED: "errors.success.updated",
    SUBMITTED: "errors.success.submitted",
    APPROVED: "errors.success.approved",
    REJECTED: "errors.success.rejected",
    REVIEWED: "errors.success.reviewed",
    SENT_BACK: "errors.success.sent_back",
    PURCHASED: "errors.success.purchased",
  },

  // Workflow Errors
  WORKFLOW: {
    STAGE_REQUIRED: "errors.workflow.stage_required",
    STAGE_FETCH_FAILED: "errors.workflow.stage_fetch_failed",
  },

  // Item Errors
  ITEM: {
    DELETE_FAILED: "errors.item.delete_failed",
    ADD_FAILED: "errors.item.add_failed",
    UPDATE_FAILED: "errors.item.update_failed",
  },

  // General Errors
  GENERAL: {
    UNAUTHORIZED: "errors.general.unauthorized",
    NETWORK_ERROR: "errors.general.network_error",
    UNKNOWN_ERROR: "errors.general.unknown_error",
  },
} as const;

export type ErrorMessageKey = keyof typeof PR_ERROR_MESSAGES;
