"use client";

import { RfpDto } from "@/dtos/rfp.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable, SortingState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/lib/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { convertStatus } from "@/utils/status";

interface RfpListProps {
  readonly rfps: RfpDto[];
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function RfpList({
  rfps,
  isLoading,
  sort,
  onSort,
  canUpdate = true,
  canDelete = true,
}: RfpListProps) {
  const tStatus = useTranslations("Status");
  const tHeader = useTranslations("TableHeader");
  const tRfp = useTranslations("RFP");

  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  const columns = useMemo<ColumnDef<RfpDto>[]>(
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
        cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
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
          <DataGridColumnHeader
            column={column}
            title={tHeader("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const rfp = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[350px] truncate ellipsis">
                <Link
                  href={`/vendor-management/request-price-list/${rfp.id}`}
                  className="hover:underline text-primary"
                >
                  {rfp.name}
                </Link>
              </div>
            );
          }
          return <span>{rfp.name}</span>;
        },
        enableSorting: true,
        size: 250,
        meta: {
          headerTitle: "Name",
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex justify-center">
              <Badge variant={status}>{getStatusLabel(status)}</Badge>
            </div>
          );
        },
        enableSorting: false,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("description")}
            icon={<Info className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">{row.original.description}</span>
        ),
        enableSorting: false,
        size: 300,
      },
      {
        accessorKey: "valid_period",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("valid_period")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.valid_period} {tRfp("days")}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "create_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("create_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.create_date), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "update_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tHeader("update_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.update_date), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },

      {
        id: "action",
        header: () => <span className="text-right">{tHeader("action")}</span>,
        cell: ({ row }) => {
          const rfp = row.original;

          // Hide action menu if no permissions
          if (!canDelete) return null;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canDelete && (
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer hover:bg-transparent"
                      onClick={() => console.log(rfp.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
    [canUpdate, canDelete, tHeader, tRfp]
  );

  // Initialize table
  const table = useReactTable({
    data: rfps,
    columns,
    getRowId: (row) => row.id ?? "",
    state: {
      sorting,
    },
    enableRowSelection: true,
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
    manualSorting: true,
  });

  return (
    <DataGrid
      table={table}
      recordCount={rfps.length}
      isLoading={isLoading}
      loadingMode="skeleton"
      emptyMessage={tRfp("no_data")}
      tableLayout={{
        headerSticky: true,
        dense: false,
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
      }}
    >
      <DataGridContainer>
        <ScrollArea className="max-h-[calc(100vh-250px)]">
          <DataGridTable />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DataGridContainer>
    </DataGrid>
  );
}