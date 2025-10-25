"use client";

import { StoreRequisitionDto } from "@/dtos/store-operation.dto"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Calendar, FileText, Building, DollarSign, Info } from "lucide-react";
import { Link } from "@/lib/navigation";
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

interface Props {
    readonly storeRequisitions: StoreRequisitionDto[]
    readonly isLoading?: boolean;
}

export default function StoreRequisitionList({ storeRequisitions, isLoading = false }: Props) {
    const tCommon = useTranslations("Common");
    const tTableHeader = useTranslations("TableHeader");

    // Action header component
    const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

    // Define columns
    const columns = useMemo<ColumnDef<StoreRequisitionDto>[]>(
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
                accessorKey: "date_created",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.date_created}</span>,
                enableSorting: false,
                size: 120,
            },
            {
                accessorKey: "ref_no",
                header: () => (
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Ref #</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.ref_no}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "request_to",
                header: () => <span>Request To</span>,
                cell: ({ row }) => <span>{row.original.request_to}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "store_name",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>Store Name</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.store_name}</span>,
                enableSorting: false,
                size: 200,
            },
            {
                accessorKey: "description",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Description</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="truncate max-w-[200px] inline-block">
                        {row.original.description}
                    </span>
                ),
                enableSorting: false,
                size: 200,
            },
            {
                accessorKey: "total_amount",
                header: () => (
                    <div className="flex items-center gap-2 justify-end">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Amount</span>
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="text-right">
                        {row.original.total_amount}
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
                accessorKey: "status",
                header: () => <div className="text-center">Status</div>,
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
                id: "action",
                header: ActionHeader,
                cell: ({ row }) => {
                    const sr = row.original;
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <Link href={`/store-operation/store-requisition/${sr.id}`}>
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">View</span>
                                </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80">
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                            </Button>
                        </div>
                    );
                },
                enableSorting: false,
                size: 100,
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
        data: storeRequisitions,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={storeRequisitions.length}
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
