"use client";

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';
import * as m from '@/paraglide/messages.js';

type SortDirection = "asc" | "desc";

interface FieldConfig<T> {
    key: keyof T;
    label: string;
    type?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render?: (value: any) => React.ReactNode;
}

interface SortDropdownProps<T extends Record<string, unknown>> {
    fieldConfigs: FieldConfig<T>[];
    items: T[];
    onSort: (sortedItems: T[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SortDropDown = <T extends Record<string, any>>({
    fieldConfigs,
    items,
    onSort,
}: SortDropdownProps<T>): React.ReactElement => {
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    const handleSort = (field: keyof T): void => {
        const isAscending = sortField === field && sortDirection === "asc";
        const newDirection = isAscending ? "desc" : "asc";

        const sortedData = [...items].sort((a, b) => {
            const aValue = a[field];
            const bValue = b[field];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (aValue < bValue) return newDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return newDirection === "asc" ? 1 : -1;
            return 0;
        });

        setSortField(field);
        setSortDirection(newDirection);
        onSort(sortedData);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {m.sort_by()}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {fieldConfigs.map((fieldConfig) => (
                    <DropdownMenuItem
                        key={String(fieldConfig.key)}
                        onClick={() => handleSort(fieldConfig.key)}
                    >
                        <span className="flex items-center justify-between w-full text-xs">
                            <span>{fieldConfig.label}</span>
                            {sortField === fieldConfig.key && (sortDirection === "asc" ? "↑" : "↓")}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SortDropDown;