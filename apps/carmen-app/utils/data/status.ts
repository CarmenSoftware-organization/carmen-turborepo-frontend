/**
 * Status conversion and label utilities
 * Converts internal status codes to human-readable labels
 */

/**
 * Purchase Request (PR) status type
 */
export type PrStatus =
  | "draft"
  | "work_in_process"
  | "approved"
  | "rejected"
  | "cancelled"
  | "pending"
  | "reject"
  | "review"
  | "in_progress"
  | "voided"
  | "inactive";

/**
 * Status label mapping
 */
const PR_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  work_in_process: "Work in Progress",
  approved: "Approved",
  rejected: "Rejected",
  cancelled: "Cancelled",
  pending: "Pending",
  reject: "Reject",
  review: "Review",
  in_progress: "In Progress",
  voided: "Voided",
  inactive: "Inactive",
};

/**
 * Convert PR status code to display label
 * @param status - Status code from backend
 * @returns Human-readable status label
 * @example
 * convertPrStatusToLabel("draft") // "Draft"
 * convertPrStatusToLabel("work_in_process") // "Work in Progress"
 * convertPrStatusToLabel("approved") // "Approved"
 */
export const convertPrStatusToLabel = (status: string): string | undefined => {
  return PR_STATUS_LABELS[status];
};

/**
 * Get all available PR statuses
 * @returns Array of status codes and their labels
 */
export const getAllPrStatuses = (): Array<{ code: string; label: string }> => {
  return Object.entries(PR_STATUS_LABELS).map(([code, label]) => ({
    code,
    label,
  }));
};

/**
 * Check if a status is a valid PR status
 * @param status - Status to check
 * @returns True if status is valid
 * @example
 * isValidPrStatus("draft") // true
 * isValidPrStatus("invalid") // false
 */
export const isValidPrStatus = (status: string): boolean => {
  return status in PR_STATUS_LABELS;
};
