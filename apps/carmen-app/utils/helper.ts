import { TransferItem } from "@/dtos/config.dto";

export const getDisplayText = (
  item: TransferItem | { name?: string; [key: string]: unknown }
): string => {
  if ("title" in item && typeof item.title === "string") return item.title;
  if ("name" in item && typeof item.name === "string") return item.name;
  return "";
};
