export const STATUS_MAP = {
  submit: "submit",
  draft: "draft",
  completed: "completed",
  in_progress: "in_progress",
  approved: "approved",
  rejected: "rejected",
  voided: "voided",
  active: "active",
  inactive: "inactive",
} as const;

export type StatusKey = keyof typeof STATUS_MAP;

export const convertStatus = (status: string, translator: (key: string) => string): string => {
  const mappedStatus = STATUS_MAP[status as StatusKey];
  return mappedStatus ? translator(mappedStatus) : "";
};

export const isValidStatus = (status: string): status is StatusKey => {
  return status in STATUS_MAP;
};

export const getAllStatusKeys = (): StatusKey[] => {
  return Object.keys(STATUS_MAP) as StatusKey[];
};
