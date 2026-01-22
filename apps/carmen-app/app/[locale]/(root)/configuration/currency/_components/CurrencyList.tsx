"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Activity, Banknote, Coins, List, MoreHorizontal, Replace, Trash2 } from "lucide-react";
import { CurrencyGetDto, CurrencyUpdateDto } from "@/dtos/currency.dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface CurrencyListProps {
  readonly isLoading: boolean;
  readonly currencies: CurrencyGetDto[];
  readonly currencyBase: string;
  readonly onEdit: (currency: CurrencyUpdateDto) => void;
  readonly onToggleStatus: (currency: CurrencyUpdateDto) => void;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: { field: string; direction: "asc" | "desc" };
  readonly onSort?: (sortString: string) => void;
  readonly perpage: number;
  readonly setPerpage: (perpage: number) => void;
  readonly canUpdate?: boolean;
  readonly canDelete?: boolean;
}

export default function CurrencyList({
  isLoading,
  currencies = [],
  currencyBase,
  onEdit,
  onToggleStatus,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  sort,
  onSort,
  perpage,
  setPerpage,
  canUpdate = true,
  canDelete = true,
}: CurrencyListProps) {
  const t = useTranslations("TableHeader");
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

  const columns = useMemo<ColumnDef<CurrencyGetDto>[]>(
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
        accessorKey: "name",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("name")}
            icon={<List className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const currency = row.original;
          if (canUpdate) {
            return (
              <button type="button" className="btn-dialog text-sm" onClick={() => onEdit(currency)}>
                {currency.name}
              </button>
            );
          }
          return <span>{currency.name}</span>;
        },
        enableSorting: true,
        size: 200,
        meta: {
          headerTitle: t("name"),
        },
      },
      {
        accessorKey: "code",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("code")}
            icon={<Banknote className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span className="text-center">{row.original.code}</span>,
        enableSorting: true,
        size: 100,
        meta: {
          headerTitle: t("code"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "symbol",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("symbol")}
            icon={<Coins className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => <span className="text-center">{row.original.symbol}</span>,
        enableSorting: true,
        size: 120,
        meta: {
          headerTitle: t("symbol"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        accessorKey: "exchange_rate",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("exchangeRate")}
            icon={<Replace className="h-4 w-4" />}
          />
        ),
        cell: ({ row }) => {
          const rate = row.original.exchange_rate;
          const convertedAmount = 1 / rate;

          return (
            <span>
              {convertedAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}{" "}
              {currencyBase}
            </span>
          );
        },
        enableSorting: true,
        meta: {
          headerTitle: t("exchangeRate"),
          cellClassName: "text-right",
          headerClassName: "[&>div]:justify-end",
        },
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <DataGridColumnHeader
            column={column}
            title={t("status")}
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
        enableSorting: true,
        size: 150,
        meta: {
          headerTitle: t("status"),
          cellClassName: "text-center",
          headerClassName: "text-center",
        },
      },
      {
        id: "action",
        header: () => <span className="text-right">{t("action")}</span>,
        cell: ({ row }) => {
          const currency = row.original;

          if (!canDelete) return null;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {canDelete && (
                  <DropdownMenuItem
                    className="text-destructive cursor-pointer hover:bg-transparent"
                    onClick={() => onToggleStatus(currency)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {tCommon("delete")}
                  </DropdownMenuItem>
                )}
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
    [t, tCommon, currentPage, perpage, canUpdate, canDelete, onEdit, onToggleStatus, currencyBase]
  );

  const table = useReactTable({
    data: currencies,
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
