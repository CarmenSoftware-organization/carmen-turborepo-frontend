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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";
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
import { AdjustmentTypeListDto, ADJUSTMENT_TYPE } from "@/dtos/adjustment-type.dto";
import { format } from "date-fns";

interface AdjustmentTypeListProps {
  readonly adjDatas: AdjustmentTypeListDto[];
  readonly isLoading: boolean;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly perpage: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly setPerpage: (perpage: number) => void;
  readonly onDelete?: (item: AdjustmentTypeListDto) => void;
}

export default function AdjustmentTypeList({
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
}: AdjustmentTypeListProps) {
  const getTypeLabel = (type: ADJUSTMENT_TYPE) => {
    return type === ADJUSTMENT_TYPE.STOCK_IN ? "Stock In" : "Stock Out";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return false;
      case "approved":
      case "completed":
        return true;
      default:
        return false;
    }
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

  const columns = useMemo<ColumnDef<AdjustmentTypeListDto>[]>(
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
              href={`/configuration/adjustment-type/${item.type}/${item.id}`}
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
                item.type === ADJUSTMENT_TYPE.STOCK_IN
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
        accessorKey: "doc_status",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title="Status"
            icon={<Activity className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <StatusCustom is_active={getStatusColor(row.original.doc_status)}>
            {row.original.doc_status}
          </StatusCustom>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
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
          <span>{format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm")}</span>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onDelete && (
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer hover:bg-transparent"
                    onClick={() => onDelete(item)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
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
