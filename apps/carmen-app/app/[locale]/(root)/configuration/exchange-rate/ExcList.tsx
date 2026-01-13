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

interface ExchangeRateItem {
  currency_id: string;
  currency_code: string;
  exchange_rate: number;
  at_date: string;
}

interface ExcListProps {
  readonly excList?: ExchangeRateItem[];
  readonly exchangeRates?: Record<string, number>;
  readonly isLoading?: boolean;
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly totalItems?: number;
  readonly perpage?: number;
  readonly onPageChange?: (page: number) => void;
  readonly setPerpage?: (perpage: number) => void;
}

export default function ExcList({
  excList = [],
  exchangeRates = {},
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  perpage = 10,
  onPageChange,
  setPerpage,
}: ExcListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

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
        size: 50,
        meta: {
          cellClassName: "text-center",
          headerClassName: "text-center",
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
        cell: ({ row }) => <span className="font-medium">{row.original.currency_code}</span>,
        enableSorting: false,
        size: 50,
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
        size: 50,
        meta: {
          headerTitle: t("exchangeRate"),
          cellClassName: "text-right",
          headerClassName: "text-right",
        },
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
        cell: ({ row }) => <span>{row.original.at_date}</span>,
        enableSorting: false,
        size: 150,
        meta: {
          headerTitle: t("date"),
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
      onPageChange?.(newPagination.pageIndex + 1);
      setPerpage?.(newPagination.pageSize);
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
      <div className="w-full space-y-2.5">
        <DataGridContainer>
          <ScrollArea className="max-h-[calc(100vh-250px)]">
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
        {totalItems > 0 && <DataGridPagination sizes={[5, 10, 25, 50, 100]} />}
      </div>
    </DataGrid>
  );
}
