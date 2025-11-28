export const formatJsonValue = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && Object.keys(value).length > 0) {
    return JSON.stringify(value);
  }
  return "";
};
