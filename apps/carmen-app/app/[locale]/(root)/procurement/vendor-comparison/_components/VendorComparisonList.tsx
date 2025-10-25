"use client";

import { VendorComparisonDto } from "@/dtos/procurement.dto";
import { FileText, Trash2, MoreHorizontal, Printer, FileDown, Star, Clock, Award, Timer, Activity } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import ButtonLink from "@/components/ButtonLink";
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
import { Button } from "@/components/ui/button";

interface VendorComparisonListProps {
  readonly vendorComparisons: VendorComparisonDto[];
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly isLoading: boolean;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
}

export default function VendorComparisonList({
  vendorComparisons,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  isLoading,
  sort,
  onSort,
  setPerpage,
}: VendorComparisonListProps) {
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  // Action header component
  const ActionHeader = () => <div className="text-right">{tTableHeader("action")}</div>;

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
  const columns = useMemo<ColumnDef<VendorComparisonDto>[]>(
    () => [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 20,
      },
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {(currentPage - 1) * perpage + row.index + 1}
          </div>
        ),
        enableSorting: false,
        size: 20,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "vendor_name",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("vendor")} icon={<FileText className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            <ButtonLink href={`/procurement/vendor-comparison/${row.original.id}`}>
              {row.original.vendor_name}
            </ButtonLink>
          </div>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("vendor"),
        },
      },
      {
        accessorKey: "rating",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("rating")} icon={<Star className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.rating}</div>
        ),
        enableSorting: false,
        size: 100,
        meta: {
          headerTitle: tTableHeader("rating"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "delivery_time",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("delivery_time")} icon={<Clock className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.delivery_time}</div>
        ),
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("delivery_time"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "score",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("score")} icon={<Award className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.score}</div>
        ),
        enableSorting: false,
        size: 100,
        meta: {
          headerTitle: tTableHeader("score"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "res_time",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("res_time")} icon={<Timer className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.res_time}</div>
        ),
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("res_time"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "quality_score",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("quality_score")} icon={<Award className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.score}</div>
        ),
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("quality_score"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("status")} icon={<Activity className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.status}>
              {row.original.status ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: tTableHeader("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: ActionHeader,
        cell: ({ row }) => {
          const vc = row.original;
          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Print", vc.id);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    {tCommon("print")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Export", vc.id);
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    {tCommon("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete", vc.id);
                    }}
                    className="text-destructive cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
    [tTableHeader, tCommon, currentPage, perpage]
  );

  // Initialize table
  const table = useReactTable({
    data: vendorComparisons,
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
