"use client";

import { PhysicalCountDto } from "@/dtos/inventory-management.dto";
import { Button } from "@/components/ui/button";
import { Eye, Trash, Building, MapPin, User, Calendar, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressCustom } from "@/components/ui-custom/progress-custom";
import { Link } from "@/lib/navigation";
import { calculateProgress } from "@/utils/format/number";
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

interface PcmListProps {
    readonly physicalCountData: PhysicalCountDto[];
    readonly isLoading?: boolean;
}

export default function PcmList({ physicalCountData, isLoading = false }: PcmListProps) {
    const tCommon = useTranslations("Common");
    const tTableHeader = useTranslations("TableHeader");

    // Action header component
    const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

    // Define columns
    const columns = useMemo<ColumnDef<PhysicalCountDto>[]>(
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
                accessorKey: "department",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>Department</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.department}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "location",
                header: () => (
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>Store Name</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.location}</span>,
                enableSorting: false,
                size: 200,
            },
            {
                accessorKey: "requested_by",
                header: () => (
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Requested By</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.requested_by}</span>,
                enableSorting: false,
                size: 150,
            },
            {
                accessorKey: "date",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Date</span>
                    </div>
                ),
                cell: ({ row }) => <span>{row.original.date}</span>,
                enableSorting: false,
                size: 120,
            },
            {
                id: "progress",
                header: () => <span>Progress</span>,
                cell: ({ row }) => {
                    const pcm = row.original;
                    const progress = calculateProgress(pcm.checked_items, pcm.count_items);
                    return (
                        <div className="flex flex-col gap-1 min-w-[200px]">
                            <ProgressCustom value={progress} />
                            <div className="text-xs">
                                <strong>Progress {progress}%</strong>
                                <span className="ml-2">
                                    {pcm.checked_items} of {pcm.count_items} items checked
                                </span>
                            </div>
                        </div>
                    );
                },
                enableSorting: false,
                size: 250,
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
                        <Badge>
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
                    const pcm = row.original;
                    return (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                                <Link href={`/inventory-management/physical-count-management/${pcm.id}`}>
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
        data: physicalCountData,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <DataGrid
            table={table}
            recordCount={physicalCountData.length}
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
