"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, FileText, Calendar, MapPin, MessageSquare, Package, DollarSign, Activity } from "lucide-react";
import { InventoryAdjustmentDTO } from "@/dtos/inventory-management.dto";
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

interface InventoryAdjustmentListProps {
    readonly inventoryAdjustments: InventoryAdjustmentDTO[];
    readonly isLoading?: boolean;
}

export default function InventoryAdjustmentList({ inventoryAdjustments, isLoading = false }: InventoryAdjustmentListProps) {
    const tCommon = useTranslations("Common");
    const tTableHeader = useTranslations("TableHeader");

    // Action header component
    const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

    // Define columns
    const columns = useMemo<ColumnDef<InventoryAdjustmentDTO>[]>(
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
                accessorKey: "adj_no",
                header: () => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Adj No.</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.adj_no}</span>
                ),
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "adj_date",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.adj_date}</span>,
                enableSorting: false,
                size: 120,
            },
            {
                accessorKey: "type",
                header: () => <div className="text-center">Type</div>,
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                            {row.original.type}
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
                accessorKey: "location",
                header: () => (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Location</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.location}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "reason",
                header: () => (
                    <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        <span>Reason</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="truncate max-w-[200px] inline-block">
                        {row.original.reason}
                    </span>
                ),
                enableSorting: false,
                size: 200,
            },
            {
                accessorKey: "item_count",
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <Package className="h-4 w-4" />
                        <span>Item Count</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-center">
                        {row.original.item_count}
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
                accessorKey: "status",
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <Activity className="h-4 w-4" />
                        <span>Status</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-center">
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                            {row.original.status}
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
                accessorKey: "total_value",
                header: () => (
                    <div className="flex items-center gap-2 justify-end">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Value</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-right">
                        {row.original.total_value}
                    </div>
                ),
                enableSorting: false,
                size: 150,
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
        data: inventoryAdjustments,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={inventoryAdjustments.length}
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
