import { TransferItem } from "@/dtos/transfer.dto";
import { UnitDto } from "@/dtos/unit.dto";

/**
 * Interface for unit filtering parameters
 */
interface UnitFilterParams {
  units?: { data?: UnitDto[] };
  excludedUnitId?: string;
  existingUnits: { id?: string; from_unit_id?: string; to_unit_id?: string }[];
  editingId?: string;
  compareField: "from_unit_id" | "to_unit_id";
}

/**
 * Get display text from an item object
 * Extracts the displayable text from various item formats
 * @param item - Item with title or name property
 * @returns Display text or empty string if not found
 * @example
 * getDisplayText({ title: "Product A" }) // "Product A"
 * getDisplayText({ name: "Category B" }) // "Category B"
 * getDisplayText({}) // ""
 */
export const getDisplayText = (
  item: TransferItem | { name?: string; [key: string]: unknown }
): string => {
  if ("title" in item && typeof item.title === "string") return item.title;
  if ("name" in item && typeof item.name === "string") return item.name;
  return "";
};

/**
 * Filter units based on exclusion and existing unit criteria
 * Used for preventing duplicate unit selections in unit conversion forms
 * @param params - Filter parameters
 * @param params.units - Available units to filter from
 * @param params.excludedUnitId - Unit ID to exclude
 * @param params.existingUnits - Already selected units
 * @param params.editingId - ID of unit being edited (to exclude from comparison)
 * @param params.compareField - Field to compare for duplicates ("from_unit_id" or "to_unit_id")
 * @returns Filtered array of units
 * @example
 * filterUnits({
 *   units: { data: allUnits },
 *   excludedUnitId: "unit-1",
 *   existingUnits: [{ from_unit_id: "unit-2" }],
 *   editingId: "edit-1",
 *   compareField: "from_unit_id"
 * })
 */
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

/**
 * Capitalize first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 * @example
 * capitalizeFirstLetter("hello world") // "Hello world"
 * capitalizeFirstLetter("HELLO") // "Hello"
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Safe JSON parse with fallback
 * @param jsonString - JSON string to parse
 * @param fallback - Fallback value if parse fails
 * @returns Parsed object or fallback value
 * @example
 * safeJsonParse('{"name":"John"}', {}) // { name: "John" }
 * safeJsonParse('invalid', {}) // {}
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return fallback;
  }
};
