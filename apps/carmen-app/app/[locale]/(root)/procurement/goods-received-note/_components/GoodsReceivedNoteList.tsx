"use client";

import { GoodsReceivedNoteListDto } from "@/dtos/grn.dto";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Building,
  Calendar,
  DollarSign,
  FileText,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ButtonLink from "@/components/ButtonLink";
import { useAuth } from "@/context/AuthContext";
import { formatDate } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/currency";
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

interface GoodsReceivedNoteListProps {
  readonly goodsReceivedNotes: GoodsReceivedNoteListDto[];
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

export default function GoodsReceivedNoteList({
  goodsReceivedNotes,
  currentPage,
  totalPages,
  totalItems,
  perpage,
  onPageChange,
  isLoading,
  sort,
  onSort,
  setPerpage,
}: GoodsReceivedNoteListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { dateFormat, amount, currencyBase } = useAuth();
  const defaultAmount = { locales: "en-US", minimumFractionDigits: 2 };

  // Action header component
  const ActionHeader = () => <div className="text-right">{t("action")}</div>;

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
  const columns = useMemo<ColumnDef<GoodsReceivedNoteListDto>[]>(
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
        accessorKey: "grn_no",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("grn_number")}
            icon={<FileText className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <div className="max-w-[150px] truncate">
            <ButtonLink href={`/procurement/goods-received-note/${row.original.id}`}>
              {row.original.grn_no ?? "-"}
            </ButtonLink>
          </div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: t("grn_number"),
        },
      },
      {
        accessorKey: "vendor_name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("vendor")}
            icon={<Building className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span className="truncate max-w-[200px] inline-block">
            {row.original.vendor_name ?? "-"}
          </span>
        ),
        enableSorting: false,
        size: 200,
        meta: {
          headerTitle: t("vendor"),
        },
      },
      {
        accessorKey: "created_at",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={t("date")}
              icon={<Calendar className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-center">
            {formatDate(row.original.created_at, dateFormat || "yyyy-MM-dd")}
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: t("date"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "total_amount",
        header: ({ column }) => (
          <div className="flex justify-end">
            <DataGridColumnHeader
              column={column}
              title={t("amount")}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="text-right">
            <span className="font-mono text-sm">
              {formatPrice(
                row.original.total_amount,
                currencyBase ?? "THB",
                amount?.locales ?? defaultAmount.locales,
                amount?.minimumFractionDigits ?? defaultAmount.minimumFractionDigits
              )}
            </span>
          </div>
        ),
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: t("amount"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <div className="flex justify-center">
            <DataGridColumnHeader
              column={column}
              title={t("status")}
              icon={<Activity className="h-4 w-4" />}
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <StatusCustom is_active={row.original.is_active}>
              {row.original.is_active ? tCommon("active") : tCommon("inactive")}
            </StatusCustom>
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: {
          headerTitle: t("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: ActionHeader,
        cell: ({ row }) => {
          const grn = row.original;
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
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer"
                    onClick={() => console.log(grn.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
                  <DropdownMenuItem>Print GRN</DropdownMenuItem>
                  <DropdownMenuItem>Download PDF</DropdownMenuItem>
                  <DropdownMenuItem>Copy Reference</DropdownMenuItem>
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
    [t, tCommon, currentPage, perpage, dateFormat, amount, currencyBase]
  );

  // Initialize table
  const table = useReactTable({
    data: goodsReceivedNotes,
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
