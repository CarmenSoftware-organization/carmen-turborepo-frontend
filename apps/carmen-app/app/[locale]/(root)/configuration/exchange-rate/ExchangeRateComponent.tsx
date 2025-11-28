"use client";

import { useState, useMemo } from "react";
import currenciesIso from "@/constants/currency";
import { format } from "date-fns";
import {
  ColumnDef,
  Column,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridPagination } from "@/components/ui/data-grid-pagination";
import { DataGridTableDnd } from "@/components/ui/data-grid-table-dnd";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

interface Currency {
  code: string;
  symbol: string;
  name: string;
  country: string;
}

// Cell components
const CodeCell = ({ value }: { value: string }) => (
  <div className="font-medium text-center">{value}</div>
);

const SymbolCell = ({ value }: { value: string }) => <div className="text-center">{value}</div>;

const NameCell = ({ value }: { value: string }) => value;

const CountryCell = ({ value }: { value: string }) => value;

const RateCell = ({
  code,
  rate,
  isLoading,
  currencyBase,
}: {
  code: string;
  rate: number | undefined;
  isLoading: boolean;
  currencyBase: string | null | undefined;
}) => (
  <div className="text-right">
    {isLoading ? (
      <Skeleton className="h-4 w-16" />
    ) : (
      <span className={`font-mono ${code === currencyBase ? "font-semibold" : ""}`}>
        {rate ? rate.toFixed(4) : "-"}
      </span>
    )}
  </div>
);

// Cell renderer functions
const renderCodeCell = (value: string) => <CodeCell value={value} />;
const renderSymbolCell = (value: string) => <SymbolCell value={value} />;
const renderNameCell = (value: string) => <NameCell value={value} />;
const renderCountryCell = (value: string) => <CountryCell value={value} />;
const renderRateCell = (
  code: string,
  rate: number | undefined,
  isLoading: boolean,
  currencyBase: string | null | undefined
) => <RateCell code={code} rate={rate} isLoading={isLoading} currencyBase={currencyBase} />;

// Header renderer functions
const renderCodeHeader = (title: string, column: Column<Currency, unknown>) => (
  <DataGridColumnHeader title={title} column={column} />
);
const renderSymbolHeader = (title: string, column: Column<Currency, unknown>) => (
  <DataGridColumnHeader title={title} column={column} />
);
const renderNameHeader = (title: string, column: Column<Currency, unknown>) => (
  <DataGridColumnHeader title={title} column={column} />
);
const renderCountryHeader = (title: string, column: Column<Currency, unknown>) => (
  <DataGridColumnHeader title={title} column={column} />
);
const renderRateHeader = (title: string, column: Column<Currency, unknown>) => (
  <DataGridColumnHeader title={title} column={column} />
);

export default function ExchangeRateComponent() {
  const tExchangeRate = useTranslations("ExchangeRate");
  const { currencyBase } = useAuth();
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([{ id: "name", desc: true }]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { exchangeRates, lastUpdated, isLoading, isError, error, refetch, isRefetching } =
    useExchangeRate({ baseCurrency: currencyBase ?? "USD" });

  // Filter and prepare data
  const filteredData = useMemo(() => {
    return currenciesIso.filter((currency) => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        currency.code.toLowerCase().includes(query) ||
        currency.name.toLowerCase().includes(query) ||
        currency.country.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  // Create column definitions
  const columns = useMemo<ColumnDef<Currency>[]>(
    () => [
      {
        accessorKey: "index",
        id: "index",
        header: "#",
        cell: ({ row }) => {
          const pageIndex = pagination.pageIndex;
          const pageSize = pagination.pageSize;
          return pageIndex * pageSize + row.index + 1;
        },
        enableSorting: false,
        size: 50,
      },
      {
        accessorKey: "code",
        id: "code",
        header: ({ column }) => renderCodeHeader(tTableHeader("code"), column),
        cell: ({ row }) => {
          const value = row.getValue("code") as string;
          return renderCodeCell(value);
        },
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "symbol",
        id: "symbol",
        header: ({ column }) => renderSymbolHeader(tTableHeader("symbol"), column),
        cell: ({ row }) => {
          const value = row.getValue("symbol") as string;
          return renderSymbolCell(value);
        },
        size: 100,
        enableSorting: true,
      },
      {
        accessorKey: "name",
        id: "name",
        header: ({ column }) => renderNameHeader(tTableHeader("name"), column),
        cell: ({ row }) => {
          const value = row.getValue("name") as string;
          return renderNameCell(value);
        },
        size: 200,
        enableSorting: true,
      },
      {
        accessorKey: "country",
        id: "country",
        header: ({ column }) => renderCountryHeader(tTableHeader("country"), column),
        cell: ({ row }) => {
          const value = row.getValue("country") as string;
          return renderCountryCell(value);
        },
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: "rate",
        id: "rate",
        header: ({ column }) => renderRateHeader(tTableHeader("exchangeRate"), column),
        cell: ({ row }) => {
          const code = row.original.code;
          const rate = exchangeRates[code];
          return renderRateCell(code, rate, isLoading, currencyBase);
        },
        enableSorting: false,
        size: 120,
      },
    ],
    [tTableHeader, exchangeRates, isLoading, currencyBase, pagination]
  );

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id as string);
        const newIndex = columnOrder.indexOf(over.id as string);
        return arrayMove(columnOrder, oldIndex, newIndex);
      });
    }
  };

  // Create table instance
  const table = useReactTable({
    data: filteredData,
    columns,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: false,
  });

  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd MMM yyyy, HH:mm");
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const renderSearchResultsMessage = () => {
    if (filteredData.length === 0) {
      return (
        <p className="text-sm mt-2 text-muted-foreground">
          {tExchangeRate("no_results_found")} &quot;{searchQuery}&quot;
        </p>
      );
    }

    if (filteredData.length !== currenciesIso.length) {
      const resultText = filteredData.length === 1 ? "result" : "results";
      return (
        <p className="text-sm mt-2 text-muted-foreground">
          {tExchangeRate("found")} {filteredData.length} {resultText}
        </p>
      );
    }

    return null;
  };

  // Show error state
  if (isError) {
    return (
      <div className="w-full p-4">
        <div className=" justify-between">
          <p className="text-2xl font-semibold tracking-tight text-primary/90 hover:text-primary transition-colors">
            {tExchangeRate("title")}
          </p>
          <Button onClick={handleRefresh} variant="outline" className="fxr-c gap-2">
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive font-medium">Error loading exchange rates</p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p className="text-2xl font-semibold tracking-tight text-primary/90 hover:text-primary transition-colors">
          {tExchangeRate("title")}
        </p>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
          <div className="fxr-c gap-1.5 ml-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRefresh}
              disabled={isLoading || isRefetching}
              className="h-8 w-8"
              aria-label="Refresh exchange rates"
              tabIndex={0}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`} />
            </Button>
            <span className="text-xs font-medium whitespace-nowrap">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `${tTableHeader("updated")}: ${formatDate(lastUpdated)}`
              )}
            </span>
          </div>

          <div className="fxr-c gap-1.5">
            <span className="text-sm font-medium">{tTableHeader("base")}:</span>
            <span className="text-sm font-medium">{currencyBase}</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <div className="relative mb-4">
          <div className="flex">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder={tCommon("search")}
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-9 pr-8 h-9"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-2.5"
                  onClick={handleClearSearch}
                  tabIndex={0}
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>

          {renderSearchResultsMessage()}
        </div>

        <DataGrid
          table={table}
          recordCount={filteredData.length}
          isLoading={isLoading}
          tableLayout={{
            columnsResizable: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
            columnsDraggable: true,
          }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer>
              <ScrollArea>
                <DataGridTableDnd handleDragEnd={handleDragEnd} />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination />
          </div>
        </DataGrid>
      </div>
    </div>
  );
}
