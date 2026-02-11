"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable, PaginationState } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Banknote, Calendar, Hash } from "lucide-react";
import { ExchangeRateItem } from "@/dtos/exchange-rate.dto";
import { formatDate } from "@/utils/format/date";
import { useBuConfig } from "@/context/BuConfigContext";

interface Props {
  readonly excList?: ExchangeRateItem[];
  readonly isLoading?: boolean;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly totalItems?: number;
  readonly perpage?: number;
  readonly onPageChange?: (page: number) => void;
  readonly setPerpage?: (perpage: number) => void;
  readonly onEdit: (currency: ExchangeRateItem) => void;
}

export default function ExchangeRateList({
  excList = [],
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  perpage = 10,
  onPageChange,
  setPerpage,
  onEdit,
}: Props) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { dateFormat } = useBuConfig();

  const pagination: PaginationState = useMemo(
    () => ({
      pageIndex: currentPage - 1,
      pageSize: perpage,
    }),
    [currentPage, perpage]
  );

  const columns = useMemo<ColumnDef<ExchangeRateItem>[]>(
    () => [
      {
        id: "no",
        header: () => <div className="text-center">#</div>,
        cell: ({ row }) => (
          <div className="text-center">{(currentPage - 1) * perpage + row.index + 1}</div>
        ),
        enableSorting: false,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
        size: 5,
      },
      {
        accessorKey: "at_date",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("date")}
            icon={<Calendar className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.at_date, dateFormat || "yyyy-MM-dd")}</span>
        ),
        enableSorting: false,
        meta: {
          headerTitle: t("date"),
        },
      },
      {
        accessorKey: "currency_code",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("code")}
            icon={<Hash className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => (
          <button type="button" className="btn-dialog text-sm" onClick={() => onEdit(row.original)}>
            {row.original.currency_code}
          </button>
        ),
        enableSorting: false,
        meta: {
          headerTitle: t("code"),
        },
      },
      {
        accessorKey: "exchange_rate",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("exchangeRate")}
            icon={<Banknote className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span>{row.original.exchange_rate.toLocaleString()}</span>,
        enableSorting: false,
        meta: {
          headerTitle: t("exchangeRate"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
      },
    ],
    [t, currentPage, perpage]
  );

  const table = useReactTable({
    data: excList,
    columns,
    pageCount: totalPages,
    getRowId: (row) => `${row.currency_id}-${row.at_date}`,
    state: {
      pagination,
    },
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === "function" ? updater(pagination) : updater;
      const newPage = newPagination.pageIndex + 1;
      const newPerpage = newPagination.pageSize;

      if (newPage !== currentPage) {
        onPageChange?.(newPage);
      }
      if (newPerpage !== perpage) {
        setPerpage?.(newPerpage);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
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
        rowBorder: true,
        headerBackground: true,
        headerBorder: true,
        width: "fixed",
        dense: false,
      }}
    >
      <div className="w-full space-y-2">
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
