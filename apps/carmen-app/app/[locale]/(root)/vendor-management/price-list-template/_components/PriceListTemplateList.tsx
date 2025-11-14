"use client";

import { PriceListTemplateListDto } from "@/dtos/price-list-template.dto";
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

interface PriceListTemplateListProps {
  readonly templates: PriceListTemplateListDto[];
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function PriceListTemplateList({
  templates,
  isLoading,
  sort,
  onSort,
  canUpdate = true,
  canDelete = true,
}: PriceListTemplateListProps) {
  const tStatus = useTranslations("Status");
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  const columns = useMemo<ColumnDef<PriceListTemplateListDto>[]>(
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
          <DataGridColumnHeader column={column} title="Name" icon={<List className="h-4 w-4" />} />
        ),
        cell: ({ row }) => {
          const template = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[350px] truncate ellipsis">
                <Link
                  href={`/vendor-management/price-list-template/${template.id}`}
                  className="hover:underline text-primary"
                >
                  {template.name}
                </Link>
              </div>
            );
          }
          return <span>{template.name}</span>;
        },
        enableSorting: true,
        size: 250,
        meta: {
          headerTitle: "Name",
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
        header: () => (
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            <span>Description</span>
          </div>
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">{row.original.description}</span>
        ),
        enableSorting: false,
        size: 300,
      },
      {
        accessorKey: "valid_period",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Valid Period</span>
          </div>
        ),
        cell: ({ row }) => <span>{row.original.valid_period} days</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "create_date",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Create Date</span>
          </div>
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.create_date), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "update_date",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Update Date</span>
          </div>
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.update_date), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },

      {
        id: "action",
        header: () => <span className="text-right">Action</span>,
        cell: ({ row }) => {
          const template = row.original;

          // Hide action menu if no permissions
          if (!canDelete) return null;

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canDelete && (
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer hover:bg-transparent"
                      onClick={() => console.log(template.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
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
    [canUpdate, canDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: templates,
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
      recordCount={templates.length}
      isLoading={isLoading}
      loadingMode="skeleton"
      emptyMessage="No data"
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
