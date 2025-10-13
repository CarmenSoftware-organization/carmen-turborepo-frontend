"use client";

import { StockCardDto } from "@/dtos/inventory-management.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, FileText, Package, Tag, Activity, Box, TrendingUp, DollarSign } from "lucide-react";
import { useMemo } from "react";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable, DataGridTableRowSelect, DataGridTableRowSelectAll } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";

interface StockCardListProps {
    readonly stockCardData: StockCardDto[];
    readonly isLoading?: boolean;
}

export default function StockCardList({ stockCardData, isLoading = false }: StockCardListProps) {
    const tCommon = useTranslations("Common");
    const tTableHeader = useTranslations("TableHeader");

    // Action header component
    const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

    // Define columns
    const columns = useMemo<ColumnDef<StockCardDto>[]>(
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
                header: () => <div className="text-center">#</div>,
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.index + 1}
                    </div>
                ),
                enableSorting: false,
                size: 30,
                meta: {
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                accessorKey: "code",
                header: () => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Code</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.code}</span>
                ),
                enableSorting: false,
                size: 120,
            },
            {
                accessorKey: "name",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>Name</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.name}</span>,
                enableSorting: false,
                size: 200,
            },
            {
                accessorKey: "category",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Category</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.category}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "status",
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <Activity className="h-4 w-4" />
                        <span>Status</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <Badge variant={row.original.status ? "default" : "destructive"}>
                            {row.original.status ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                ),
                enableSorting: false,
                size: 120,
                meta: {
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                id: "current_stock",
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <Box className="h-4 w-4" />
                        <span>Current Stock</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.count} {row.original.unit}
                    </div>
                ),
                enableSorting: false,
                size: 150,
                meta: {
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                accessorKey: "stock_level",
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <TrendingUp className="h-4 w-4" />
                        <span>Stock Level</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.stock_level}
                    </div>
                ),
                enableSorting: false,
                size: 120,
                meta: {
                    cellClassName: "text-center",
                    headerClassName: "text-center",
                },
            },
            {
                accessorKey: "value",
                header: () => (
                    <div className="flex items-center gap-2 justify-end">
                        <DollarSign className="h-4 w-4" />
                        <span>Value</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-right">
                        ${row.original.value}
                    </div>
                ),
                enableSorting: false,
                size: 120,
                meta: {
                    cellClassName: "text-right",
                    headerClassName: "text-right",
                },
            },
            {
                id: "action",
                header: ActionHeader,
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">View</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    );
                },
                enableSorting: false,
                size: 120,
                meta: {
                    cellClassName: "text-right",
                    headerClassName: "text-right",
                },
            },
        ],
        [tTableHeader]
    );

    // Initialize table
    const table = useReactTable({
        data: stockCardData,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={stockCardData.length}
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
            <div className="w-full space-y-2.5">
                <DataGridContainer>
                    <ScrollArea className="max-h-[calc(100vh-250px)]">
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </DataGridContainer>
            </div>
        </DataGrid>
    )
}
