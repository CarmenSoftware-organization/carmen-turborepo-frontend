"use client";

import React, { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

interface FieldConfig<T> {
    key: keyof T;
    label: string;
}

interface SortDropdownProps<T extends Record<string, unknown>> {
    fieldConfigs: FieldConfig<T>[];
    setSort: (value: string) => void; // รับ `setSort` เป็น prop
    sort: string | null; // รับ `sort` จาก `useURL`
}

const SortComponent = <T extends Record<string, unknown>>({ fieldConfigs, sort, setSort }: SortDropdownProps<T>) => {
    const t = useTranslations('Common');
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        if (sort) {
            const [field, direction] = sort.split(":");
            if (field !== sortField || direction !== sortDirection) {
                setSortField(field as keyof T);
                setSortDirection(direction === "desc" ? "desc" : "asc");
            }
        }
    }, [sort, sortField, sortDirection]);

    const handleSort = (field: keyof T) => {
        const isAscending = sortField === field && sortDirection === "asc";
        const newDirection = isAscending ? "desc" : "asc";
        const newSortParam = newDirection === "asc" ? String(field) : `${String(field)}:desc`;
        setSort(newSortParam);
        setSortField(field);
        setSortDirection(newDirection);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outlinePrimary" size="sm">
                    <ArrowUpDown className="mr-2 h-4 w-4" />
                    {t('sort')}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {fieldConfigs.map((fieldConfig) => (
                    <DropdownMenuItem key={String(fieldConfig.key)} onClick={() => handleSort(fieldConfig.key)}>
                        <span className="fxr-c justify-between w-full text-xs">
                            <span>{fieldConfig.label}</span>
                            {sortField === fieldConfig.key &&
                                (sortDirection === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />)}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default SortComponent;
