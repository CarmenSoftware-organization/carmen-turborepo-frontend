"use client";

import { Button } from "@/components/ui/button";
import { Trash2, List, Info, Activity } from "lucide-react";
import { UnitDto } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
import { useMemo } from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    SortingState,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ListUnitProps {
    readonly units: UnitDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly totalItems: number;
    readonly onPageChange: (page: number) => void;
    readonly onEdit: (unit: UnitDto) => void;
    readonly onDelete: (unit: UnitDto) => void;
    readonly sort?: { field: string; direction: "asc" | "desc" } | null;
    readonly onSort?: (sortString: string) => void;
    readonly perpage?: number;
    readonly setPerpage?: (perpage: number) => void;
    readonly canUpdate?: boolean;
    readonly canDelete?: boolean;
}

export default function ListUnit({
    units,
    isLoading,
    currentPage,
    totalPages,
    onPageChange,
    onEdit,
    onDelete,
    sort,
    onSort,
    totalItems,
    perpage = 10,
    setPerpage,
    canUpdate = true,
    canDelete = true,
}: ListUnitProps) {

    const t = useTranslations("TableHeader");
    const tCommon = useTranslations("Common");

    // Convert sort to TanStack Table format
    const sorting: SortingState = useMemo(() => {
        if (!sort) return [];
        return [{ id: sort.field, desc: sort.direction === "desc" }];
    }, [sort]);

    // Pagination state
    const pagination: PaginationState = useMemo(
        () => ({
            pageIndex: currentPage - 1,
            pageSize: perpage,
        }),
        [currentPage, perpage]
    );

    // Define columns
    const columns = useMemo<ColumnDef<UnitDto>[]>(
        () => [
            {
                id: "select",
                header: () => <DataGridTableRowSelectAll />,
                cell: ({ row }) => <DataGridTableRowSelect row={row} />,
                enableSorting: false,
                enableHiding: false,
                size: 30,
            },
            {
                id: "no",
                header: () => <span className="text-center">#</span>,
                cell: ({ row }) => (
                    <span className="text-center">
                        {(currentPage - 1) * perpage + row.index + 1}
                    </span>
                ),
                enableSorting: false,
                size: 30,
                meta: {
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                accessorKey: "name",
                header: ({ column }) => (
                    <DataGridColumnHeader column={column} title={t("name")} icon={<List className="h-4 w-4" />} />
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    if (canUpdate) {
                        return (
                            <button
                                type="button"
                                className="btn-dialog"
                                onClick={() => onEdit(unit)}
                            >
                                {unit.name}
                            </button>
                        );
                    }

                    return <span>{unit.name}</span>;
                },
                enableSorting: true,
                size: 200,
                meta: {
                    headerTitle: t("name"),
                },
            },
            {
                accessorKey: "description",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>{t("description")}</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="text-sm">
                        {row.original.description}
                    </span>
                ),
                enableSorting: false,
                size: 300,
            },
            {
                accessorKey: "is_active",
                header: ({ column }) => (
                    <div className="flex justify-center items-center gap-2">
                        <Activity className="h-4 w-4" />
                        <DataGridColumnHeader column={column} title={t("status")} />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <StatusCustom is_active={row.original.is_active}>
                            {row.original.is_active ? tCommon("active") : tCommon("inactive")}
                        </StatusCustom>
                    </div>
                ),
                enableSorting: true,
                size: 120,
                meta: {
                    headerTitle: t("status"),
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                id: "action",
                header: () => <span className="text-right">{t("action")}</span>,
                cell: ({ row }) => {
                    const unit = row.original;
                    if (!canDelete) return null;
                    return (
                        <div className="flex justify-end">
                            <Button
                                className="h-7 w-7 text-destructive cursor-pointer hover:bg-transparent"
                                onClick={() => onDelete(unit)}
                                variant="ghost"
                                size="sm"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
                enableSorting: false,
                size: 80,
                meta: {
                    cellClassName: "text-right",
                    headerClassName: "text-right",
                },
            },
        ],
        [t, tCommon, currentPage, perpage, canUpdate, canDelete, onEdit, onDelete]
    );

    const table = useReactTable({
        data: units,
        columns,
        pageCount: totalPages,
        getRowId: (row) => row.id ?? "",
        state: {
            pagination,
            sorting,
        },
        enableRowSelection: true,
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
            onPageChange(newPagination.pageIndex + 1);
            if (setPerpage) {
                setPerpage(newPagination.pageSize);
            }
        },
        onSortingChange: (updater) => {
            if (!onSort) return;

            const newSorting = typeof updater === "function" ? updater(sorting) : updater;

            if (newSorting.length > 0) {
                const sortField = newSorting[0].id;
                const sortDirection = newSorting[0].desc ? "desc" : "asc";
                onSort(`${sortField}:${sortDirection}`);
            } else {
                onSort("");
            }
        },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualSorting: true,
    });

    return (
        <DataGrid
            table={table}
            recordCount={totalItems}
            isLoading={isLoading}
            loadingMode="skeleton"
            emptyMessage={tCommon("no_data")}
            tableLayout={{
                headerSticky: true,
                dense: false,
                rowBorder: true,
                headerBackground: true,
                headerBorder: true,
                width: "fixed",
            }}
        >
            <div className="w-full space-y-2">
                <DataGridContainer>
                    <ScrollArea className="max-h-[calc(100vh-250px)]">
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </DataGridContainer>
                <DataGridPagination sizes={[5, 10, 25, 50, 100]} />
            </div>
        </DataGrid>
    );
}
