"use client";

import { VendorGetDto } from "@/dtos/vendor-management";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Building, Info, List, MoreHorizontal, Trash2 } from "lucide-react";
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
import {
  DataGridTable,
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Link } from "@/lib/navigation";

interface VendorListProps {
  readonly vendors: VendorGetDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" } | null;
  readonly onSort?: (sortString: string) => void;
  readonly totalItems: number;
  readonly perpage: number;
  readonly setPerpage: (perpage: number) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function VendorList({
  vendors,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  sort,
  onSort,
  totalItems,
  perpage,
  setPerpage,
  canUpdate = true,
  canDelete = true,
}: VendorListProps) {
  const tCommon = useTranslations("Common");
  const tTableHeader = useTranslations("TableHeader");

  const sorting: SortingState = useMemo(() => {
    if (!sort) return [];
    return [{ id: sort.field, desc: sort.direction === "desc" }];
  }, [sort]);

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  const columns = useMemo<ColumnDef<VendorGetDto>[]>(
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
          <div className="text-center">{(currentPage - 1) * perpage + row.index + 1}</div>
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
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const vendor = row.original;
          if (canUpdate) {
            return (
              <div className="max-w-[350px] truncate ellipsis">
                <Link
                  href={`/vendor-management/vendor/${vendor.id}`}
                  className="hover:underline text-primary"
                >
                  {vendor.name}
                </Link>
              </div>
            );
          }
          return <span>{vendor.name}</span>;
        },
        enableSorting: true,
        size: 350,
        meta: {
          headerTitle: tTableHeader("name"),
        },
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={tTableHeader("code")}
              icon={<List className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => <div>{row.original.code}</div>,
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("code"),
          size: 120,
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("description")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">{row.original.description}</span>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("description"),
        },
      },
      {
        accessorKey: "business_type",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("business_type")}
            icon={<Building className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.business_type.map((b) => (
              <Badge
                className="rounded-lg bg-gray-700 hover:bg-gray-600 text-primary-foreground"
                key={b.id}
              >
                {b.name}
              </Badge>
            ))}
          </div>
        ),
        size: 200,
        meta: {
          headerTitle: tTableHeader("business_type"),
        },
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("status")}
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.is_active}>
              {row.original.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{tTableHeader("action")}</span>,
        cell: ({ row }) => {
          const vendor = row.original;

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
                      onClick={() => console.log(vendor.id)}
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
    [tTableHeader, tCommon, currentPage, perpage, canUpdate, canDelete]
  );

  // Initialize table
  const table = useReactTable({
    data: vendors,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id ?? "",
    state: {
      pagination,
      sorting,
    },
    enableRowSelection: true,
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      onPageChange(newPagination.pageIndex + 1);
      setPerpage(newPagination.pageSize);
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
      <div className="w-full space-y-2.5">
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
