"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MoreHorizontal,
  Trash2,
  Package,
  FileType,
  Activity,
  Calendar,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format/date";
import {
  INVENTORY_ADJUSTMENT_TYPE,
  InventoryAdjustmentListDto,
} from "@/dtos/inventory-adjustment.dto";

interface Props {
  readonly adjDatas: InventoryAdjustmentListDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly onDelete?: (item: InventoryAdjustmentListDto) => void;
  readonly dateFormat: string;
}

export default function InventoryAdjustmentList({
  adjDatas,
  isLoading,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  sort,
  onSort,
  setPerpage,
  onDelete,
  dateFormat,
}: Props) {
  const getTypeLabel = (type: INVENTORY_ADJUSTMENT_TYPE) => {
    return type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN ? "Stock In" : "Stock Out";
  };

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

  const columns = useMemo<ColumnDef<InventoryAdjustmentListDto>[]>(
    () => [
      {
        id: "select",
        header: () => <DataGridTableRowSelectAll />,
        cell: ({ row }) => <DataGridTableRowSelect row={row} />,
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      {
        id: "no",
        header: () => "#",
        cell: ({ row }) => <span>{(currentPage - 1) * perpage + row.index + 1}</span>,
        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "document_no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Document No."
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Link
              href={`/inventory-management/inventory-adjustment/${item.type}/${item.id}`}
              className="hover:underline hover:underline-offset text-primary dark:text-primary-foreground hover:text-primary/80"
            >
              {item.document_no}
            </Link>
          );
        },
        enableSorting: true,
        size: 180,
      },
      {
        accessorKey: "type",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Type"
            icon={<Package className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                item.type === INVENTORY_ADJUSTMENT_TYPE.STOCK_IN
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
              }`}
            >
              {getTypeLabel(item.type)}
            </span>
          );
        },
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "doc_status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Status"
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const status = row.original.doc_status;
          return (
            <Badge variant={status} className="font-bold">
              {status.toUpperCase()}
            </Badge>
          );
        },
        enableSorting: true,
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
            title="Description"
            icon={<FileType className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.description || "-"}</span>,
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Created At"
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.created_at, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: true,
        size: 150,
      },
      {
        id: "action",
        header: () => null,
        cell: ({ row }) => {
          const item = row.original;

          return (
            <Button
              onClick={() => onDelete?.(item)}
              variant="ghost"
              size="sm"
              className="w-7 h-7 text-destructive hover:text-destructive/80 hover:bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
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
    [currentPage, perpage, onDelete]
  );

  const table = useReactTable({
    data: adjDatas,
    columns,
    pageCount: totalPages,
    getRowId: (row) => row.id,
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
