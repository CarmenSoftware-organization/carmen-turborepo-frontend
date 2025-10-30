import { TransferItem } from "@/dtos/transfer.dto";
import { UnitDto } from "@/dtos/unit.dto";

interface UnitFilterParams {
  units?: { data?: UnitDto[] };
  excludedUnitId?: string;
  existingUnits: { id?: string; from_unit_id?: string; to_unit_id?: string }[];
  editingId?: string;
  compareField: "from_unit_id" | "to_unit_id";
}

export const getDisplayText = (
  item: TransferItem | { name?: string; [key: string]: unknown }
): string => {
  if ("title" in item && typeof item.title === "string") return item.title;
  if ("name" in item && typeof item.name === "string") return item.name;
  return "";
};

export const filterUnits = ({
  units,
  excludedUnitId,
  existingUnits,
  editingId,
  compareField,
}: UnitFilterParams): UnitDto[] => {
  if (!units?.data) return [];

  const otherUnits = existingUnits.filter((u) => u.id !== editingId);
  const existingCompareIds = otherUnits.map((u) => u[compareField] || "");

  return units.data.filter((unit) => {
    if (!unit.id || unit.id === excludedUnitId) return false;
    return !existingCompareIds.includes(unit.id);
  });
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};
