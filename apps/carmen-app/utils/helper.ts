import { TransferItem } from "@/dtos/transfer.dto";
import { UnitDto } from "@/dtos/unit.dto";

export const getDisplayText = (
  item: TransferItem | { name?: string;[key: string]: unknown }
): string => {
  if ("title" in item && typeof item.title === "string") return item.title;
  if ("name" in item && typeof item.name === "string") return item.name;
  return "";
};


export const convertPrStatus = (status: string) => {
  if (status === "draft") {
    return "Draft";
  } else if (status === "work_in_process") {
    return "Work in Progress";
  } else if (status === "approved") {
    return "Approved";
  } else if (status === "rejected") {
    return "Rejected";
  } else if (status === "cancelled") {
    return "Cancelled";
  }
};

interface UnitFilterParams {
  units?: { data?: UnitDto[] };
  excludedUnitId?: string;
  existingUnits: { id?: string; from_unit_id?: string; to_unit_id?: string }[];
  editingId?: string;
  compareField: 'from_unit_id' | 'to_unit_id';
}

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
