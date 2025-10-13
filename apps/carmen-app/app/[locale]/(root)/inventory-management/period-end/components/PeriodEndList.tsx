"use client";

import { PeriodEndDto } from "@/dtos/inventory-management.dto";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash, FileText, Calendar, User, CheckCircle, StickyNote, Activity } from "lucide-react";
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

interface PeriodEndListProps {
    readonly periodEnds: PeriodEndDto[];
    readonly isLoading?: boolean;
}

export default function PeriodEndList({ periodEnds, isLoading = false }: PeriodEndListProps) {
    const tCommon = useTranslations("Common");
    const tTableHeader = useTranslations("TableHeader");

    // Action header component
    const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

    // Define columns
    const columns = useMemo<ColumnDef<PeriodEndDto>[]>(
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
                accessorKey: "pe_no",
                header: () => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>PE No.</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="font-medium">{row.original.pe_no}</span>
                ),
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "pe_date",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>PE Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.pe_date}</span>,
                enableSorting: false,
                size: 120,
            },
            {
                accessorKey: "start_date",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Start Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.start_date}</span>,
                enableSorting: false,
                size: 120,
            },
            {
                accessorKey: "end_date",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>End Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.end_date}</span>,
                enableSorting: false,
                size: 120,
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
                accessorKey: "created_by",
                header: () => (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Created By</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.created_by}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "completed_at",
                header: () => (
                    <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Completed At</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.completed_at}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "note",
                header: () => (
                    <div className="flex items-center gap-2">
                        <StickyNote className="h-4 w-4" />
                        <span>Note</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="truncate max-w-[200px] inline-block">
                        {row.original.note}
                    </span>
                ),
                enableSorting: false,
                size: 200,
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
        data: periodEnds,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={periodEnds.length}
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
