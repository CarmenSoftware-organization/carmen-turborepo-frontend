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

export const convertPrStatusToLabel = (status: string): string | undefined => {
  return PR_STATUS_LABELS[status];
};

export const getAllPrStatuses = (): Array<{ code: string; label: string }> => {
  return Object.entries(PR_STATUS_LABELS).map(([code, label]) => ({
    code,
    label,
  }));
};

export const isValidPrStatus = (status: string): boolean => {
  return status in PR_STATUS_LABELS;
};
