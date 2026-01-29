"use client";

import { PoListDto } from "@/dtos/po.dto";
import {
  Building2,
  Calendar,
  DollarSign,
  FileDown,
  FileText,
  MoreHorizontal,
  Printer,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonLink from "@/components/ButtonLink";
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
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format/date";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/utils/format/currency";

interface PurchaseOrderListProps {
  readonly purchaseOrders: PoListDto[];
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
  const { dateFormat, amount, currencyBase } = useAuth();
  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

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

  // Define columns
  const columns = useMemo<ColumnDef<PoListDto>[]>(
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
        cell: ({ row }) => (
          <span className="text-center">{(currentPage - 1) * perpage + row.index + 1}</span>
        ),
        enableSorting: false,
        size: 30,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "po_no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("po_number")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <ButtonLink href={`/procurement/purchase-order/${row.original.id}`}>
            {row.original.po_no ?? "-"}
          </ButtonLink>
        ),
        enableSorting: true,
        size: 200,
      },
      {
        accessorKey: "vendor_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("vendor")}
            icon={<Building2 className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.vendor_name ?? "-"}</span>,
        enableSorting: true,
        size: 350,
      },
      {
        accessorKey: "description",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("description")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.description ?? "-"}</span>,
        enableSorting: false,
        size: 200,
      },
      {
        accessorKey: "order_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("order_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.order_date, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: false,
        size: 140,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "delivery_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("delivery_date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),

        cell: ({ row }) => (
          <span>{formatDate(row.original.delivery_date, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: false,
        size: 140,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={tTableHeader("amount")}
            icon={<DollarSign className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>
            {formatPrice(
              row.original.total_amount,
              currencyBase ?? "THB",
              amount?.locales ?? defaultAmount.locales,
              amount?.minimumFractionDigits ?? defaultAmount.minimumFractionDigits
            )}
          </span>
          // <span>{row.original.total_amount}</span>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        id: "action",
        header: () => {
          tTableHeader("action");
        },
        cell: ({ row }) => {
          const po = row.original;
          return (
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
