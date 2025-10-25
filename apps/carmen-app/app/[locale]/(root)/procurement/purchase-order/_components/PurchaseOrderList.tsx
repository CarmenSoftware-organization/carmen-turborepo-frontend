"use client";

import { PurchaseOrderlDto } from "@/dtos/procurement.dto";
import { Building2, Calendar, DollarSign, FileDown, FileText, MoreHorizontal, Printer, TagIcon, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ButtonLink from "@/components/ButtonLink";
import { StatusBadge } from "@/components/ui-custom/StatusBadge";
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

interface PurchaseOrderListProps {
  readonly purchaseOrders: PurchaseOrderlDto[];
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

export default function PurchaseOrderList({
  purchaseOrders,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  isLoading,
  sort,
  onSort,
  setPerpage,
}: PurchaseOrderListProps) {
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
  const columns = useMemo<ColumnDef<PurchaseOrderlDto>[]>(
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
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => (
          <div className="text-center">
            {(currentPage - 1) * perpage + row.index + 1}
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
        accessorKey: "po_number",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("po_number")} icon={<FileText className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <ButtonLink href={`/procurement/purchase-order/${row.original.id}`}>
            {row.original.po_number ?? "-"}
          </ButtonLink>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("po_number"),
        },
      },
      {
        accessorKey: "vendor",
        header: ({ column }) => (
          <DataGridColumnHeader column={column} title={tTableHeader("vendor")} icon={<Building2 className="h-4 w-4" />} />
        ),
        cell: ({ row }) => (
          <span>
            {row.original.vendor ?? "-"}
          </span>
        ),
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: tTableHeader("vendor"),
        },
      },
      {
        accessorKey: "date_created",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("date")} icon={<Calendar className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.date_created}</div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: tTableHeader("date"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "delivery_date",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("delivery_date")} icon={<Calendar className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.delivery_date}</div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: tTableHeader("delivery_date"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "currency",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("currency")} icon={<DollarSign className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">{row.original.currency}</div>
        ),
        enableSorting: false,
        size: 100,
        meta: {
          headerTitle: tTableHeader("currency"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "net_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title={tTableHeader("net_amount")} icon={<DollarSign className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="text-sm">{row.original.net_amount}</span>
          </div>
        ),
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("net_amount"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "tax_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title={tTableHeader("tax_amount")} icon={<DollarSign className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="text-sm">{row.original.tax_amount}</span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: tTableHeader("tax_amount"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader column={column} title={tTableHeader("amount")} icon={<DollarSign className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="text-sm font-medium">{row.original.amount}</span>
          </div>
        ),
        enableSorting: false,
        size: 130,
        meta: {
          headerTitle: tTableHeader("amount"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader column={column} title={tTableHeader("status")} icon={<TagIcon className="h-4 w-4" />} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.status && (
              <StatusBadge status={row.original.status}>
                {row.original.status}
              </StatusBadge>
            )}
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
          const po = row.original;
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
                      console.log("Print", po.id);
                    }}
                  >
                    <Printer className="h-4 w-4" />
                    {tCommon("print")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Export", po.id);
                    }}
                  >
                    <FileDown className="h-4 w-4" />
                    {tCommon("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Delete", po.id);
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
        size: 120,
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
    data: purchaseOrders,
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
