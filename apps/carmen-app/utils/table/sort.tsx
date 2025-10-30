import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

/**
 * Sort direction type
 */
export type SortDirection = "asc" | "desc";

/**
 * Sort configuration interface
 */
export interface SortConfig {
  field: string;
  direction: SortDirection;
}

/**
 * Render a sort icon based on current sort configuration
 * @param field - Field name to check against sort config
 * @param sort - Current sort configuration
 * @returns Sort icon component or null if field is not sorted
 * @example
 * renderSortIcon("name", { field: "name", direction: "asc" }) // <ArrowUp />
 * renderSortIcon("name", { field: "email", direction: "asc" }) // null
 */
export const renderSortIcon = (field: string, sort?: SortConfig) => {
  if (!sort || sort.field !== field) {
    return null;
  }

  if (sort.direction === "asc") {
    return <ArrowUp className="ml-1 h-4 w-4 inline" />;
  }

  return <ArrowDown className="ml-1 h-4 w-4 inline" />;
};

/**
 * Parse sort string to SortConfig object
 * Converts string format "field:direction" to structured object
 * @param sortString - String in format "field:direction" (e.g., "name:asc")
 * @returns SortConfig object or undefined if invalid
 * @example
 * parseSortString("name:asc") // { field: "name", direction: "asc" }
 * parseSortString("email:desc") // { field: "email", direction: "desc" }
 * parseSortString("invalid") // undefined
 */
export const parseSortString = (sortString?: string): SortConfig | undefined => {
  if (!sortString) return undefined;

  const [field, direction] = sortString.split(":");
  if (!field || !direction || (direction !== "asc" && direction !== "desc")) {
    return undefined;
  }

  return {
    field,
    direction: direction as SortDirection,
  };
};

/**
 * Convert SortConfig object to sort string
 * Converts structured object to string format for URL params
 * @param sortConfig - SortConfig object
 * @returns String in format "field:direction"
 * @example
 * stringifySortConfig({ field: "name", direction: "asc" }) // "name:asc"
 */
export const stringifySortConfig = (sortConfig: SortConfig): string => {
  return `${sortConfig.field}:${sortConfig.direction}`;
};

/**
 * Get props for a sortable table column header
 * Provides all necessary props including click handler, aria attributes, and keyboard support
 * @param field - Field name for this column
 * @param sort - Current sort configuration
 * @param onSort - Sort handler function
 * @param additionalClassName - Additional CSS classes
 * @returns Props object to spread on column header element
 * @example
 * <th {...getSortableColumnProps("name", sort, handleSort, "font-bold")}>
 *   Name {renderSortIcon("name", sort)}
 * </th>
 */
export const getSortableColumnProps = (
  field: string,
  sort: SortConfig | undefined,
  onSort: ((field: string) => void) | undefined,
  additionalClassName?: string
) => {
  let ariaSortValue: "none" | "ascending" | "descending" = "none";

  if (sort && sort.field === field) {
    ariaSortValue = sort.direction === "asc" ? "ascending" : "descending";
  }

  const handleSort = () => {
    if (onSort) {
      onSort(field);
    }
  };

  return {
    onClick: handleSort,
    "aria-sort": ariaSortValue,
    role: "columnheader",
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSort();
      }
    },
    className: `cursor-pointer hover:bg-accent/50 transition-colors ${additionalClassName ?? ""}`,
  };
};

/**
 * Toggle sort direction for a field
 * If field is not currently sorted, sorts ascending
 * If field is sorted ascending, changes to descending
 * If field is sorted descending, removes sort (returns undefined)
 * @param field - Field to sort by
 * @param currentSort - Current sort configuration
 * @returns New sort configuration or undefined to clear sort
 * @example
 * toggleSort("name", undefined) // { field: "name", direction: "asc" }
 * toggleSort("name", { field: "name", direction: "asc" }) // { field: "name", direction: "desc" }
 * toggleSort("name", { field: "name", direction: "desc" }) // undefined
 */
export const toggleSort = (
  field: string,
  currentSort?: SortConfig
): SortConfig | undefined => {
  if (!currentSort || currentSort.field !== field) {
    return { field, direction: "asc" };
  }

  if (currentSort.direction === "asc") {
    return { field, direction: "desc" };
  }

  return undefined;
};
