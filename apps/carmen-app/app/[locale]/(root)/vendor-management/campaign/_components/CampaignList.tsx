"use client";

import { CampaignDto } from "@/dtos/campaign.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Activity, Calendar, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
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

interface CampaignListProps {
  readonly campaigns: CampaignDto[];
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function CampaignList({
  campaigns,
  isLoading,
  sort,
  onSort,
  canUpdate = true,
  canDelete = true,
}: CampaignListProps) {
  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const columns = useMemo<ColumnDef<CampaignDto>[]>(
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
          const campaign = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[350px] truncate ellipsis">
                <Link
                  href={`/vendor-management/campaign/${campaign.id}`}
                  className="hover:underline text-primary"
                >
                  {campaign.name}
                </Link>
              </div>
            );
          }
          return <span>{campaign.name}</span>;
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
              <Badge>{status}</Badge>
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
        cell: ({ row }) => <span>{format(new Date(row.original.valid_period), "dd/MM/yyyy")}</span>,
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
        cell: ({ row }) => <span>{format(new Date(row.original.valid_period), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },
      {
        accessorKey: "update_date",
        header: () => (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Valid Period</span>
          </div>
        ),
        cell: ({ row }) => <span>{format(new Date(row.original.valid_period), "dd/MM/yyyy")}</span>,
        enableSorting: false,
        size: 150,
      },

      {
        id: "action",
        header: () => <span className="text-right">Action</span>,
        cell: ({ row }) => {
          const campaign = row.original;

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
                      onClick={() => console.log(campaign.id)}
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
    data: campaigns,
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
      recordCount={campaigns.length}
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
