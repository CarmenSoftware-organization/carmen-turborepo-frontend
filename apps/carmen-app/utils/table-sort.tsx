import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
    field: string;
    direction: SortDirection;
}

/**
 * Renders a sort icon based on sort configuration
 */
export const renderSortIcon = (field: string, sort?: SortConfig) => {
    if (!sort || sort.field !== field) {
        return null;
    }

    if (sort.direction === 'asc') {
        return <ArrowUp className="ml-1 h-4 w-4 inline" />;
    }

    return <ArrowDown className="ml-1 h-4 w-4 inline" />;
};

/**
 * Converts sort string to SortConfig object
 * @param sortString - String in format "field:direction" (e.g., "name:asc")
 * @returns SortConfig object or undefined if invalid
 */
export const parseSortString = (sortString?: string): SortConfig | undefined => {
    if (!sortString) return undefined;

    const [field, direction] = sortString.split(':');
    if (!field || !direction || (direction !== 'asc' && direction !== 'desc')) {
        return undefined;
    }

    return {
        field,
        direction: direction as SortDirection
    };
};

/**
 * Converts SortConfig object to sort string
 * @param sortConfig - SortConfig object
 * @returns String in format "field:direction"
 */
export const stringifySortConfig = (sortConfig: SortConfig): string => {
    return `${sortConfig.field}:${sortConfig.direction}`;
};

/**
 * Gets props for a sortable table column
 */
export const getSortableColumnProps = (
    field: string,
    sort: SortConfig | undefined,
    onSort: ((field: string) => void) | undefined,
    additionalClassName?: string
) => {
    let ariaSortValue: "none" | "ascending" | "descending" = "none";

    if (sort && sort.field === field) {
        ariaSortValue = sort.direction === 'asc' ? "ascending" : "descending";
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
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSort();
            }
        },
        className: `cursor-pointer hover:bg-accent/50 transition-colors ${additionalClassName ?? ''}`
    };
}; 