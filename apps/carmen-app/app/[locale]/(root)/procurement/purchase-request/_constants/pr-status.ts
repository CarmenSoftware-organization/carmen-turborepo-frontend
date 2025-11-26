export const PR_STATUS = {
  DRAFT: "draft",
  SUBMIT: "submit",
  IN_PROGRESS: "in_progress",
  APPROVED: "approved",
  REJECTED: "rejected",
  COMPLETED: "completed",
  VOIDED: "voided",
} as const;

export type PrStatus = (typeof PR_STATUS)[keyof typeof PR_STATUS];

export const PR_ITEM_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  APPROVE: "approve",
  REVIEW: "review",
  REJECTED: "rejected",
  REJECT: "reject",
  SEND_BACK: "send_back",
  SUBMIT: "submit",
} as const;

export type PrItemStatus = (typeof PR_ITEM_STATUS)[keyof typeof PR_ITEM_STATUS];

export const PR_FIELD_NAMES = {
  LOCATION_ID: "location_id",
  PRODUCT_ID: "product_id",
  REQUESTED_QTY: "requested_qty",
  REQUESTED_UNIT_ID: "requested_unit_id",
  APPROVED_QTY: "approved_qty",
  APPROVED_UNIT_ID: "approved_unit_id",
  FOC_QTY: "foc_qty",
  FOC_UNIT_ID: "foc_unit_id",
  DELIVERY_DATE: "delivery_date",
  DELIVERY_POINT_ID: "delivery_point_id",
  VENDOR_ID: "vendor_id",
  STAGES_STATUS: "stages_status",
} as const;

export type PrFieldName = (typeof PR_FIELD_NAMES)[keyof typeof PR_FIELD_NAMES];
