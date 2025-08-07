"use client";

import { useState, useEffect } from "react";
import currenciesIso from "@/constants/currency";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  RefreshCw,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Banknote,
  DollarSign,
  BadgeDollarSign,
  Globe,
  ArrowLeftRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useAuth } from "@/context/AuthContext";

type SortDirection = "asc" | "desc";

type SortField = "code" | "symbol" | "name" | "country" | "rate";

export default function ExchangeRateComponent() {
  const { currencyBase } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<SortField>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const {
    exchangeRates,
    lastUpdated,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useExchangeRate({ baseCurrency: currencyBase ?? "USD" });

  const filteredCurrencies = currenciesIso.filter((currency) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      currency.code.toLowerCase().includes(query) ||
      currency.name.toLowerCase().includes(query) ||
      currency.country.toLowerCase().includes(query)
    );
  });

  const sortedCurrencies = [...filteredCurrencies].sort((a, b) => {
    let compareA: string | number;
    let compareB: string | number;

    if (sortField === "rate") {
      compareA = exchangeRates[a.code] || 0;
      compareB = exchangeRates[b.code] || 0;
    } else {
      compareA = a[sortField].toLowerCase();
      compareB = b[sortField].toLowerCase();
    }

    if (sortDirection === "asc") {
      return compareA > compareB ? 1 : -1;
    } else {
      return compareA < compareB ? 1 : -1;
    }
  });

  const totalItems = sortedCurrencies.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedCurrencies.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };



  const handleRefresh = () => {
    refetch();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push("ellipsis-start");
      }

      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push("ellipsis-end");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const formatExchangeRate = (rate: number) => {
    return rate ? rate.toFixed(4) : "-";
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

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-3 w-3 inline" />;
    }

    return sortDirection === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3 inline" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3 inline" />
    );
  };

  const renderSearchResultsMessage = () => {
    if (filteredCurrencies.length === 0) {
      return (
        <p className="text-sm mt-2 text-muted-foreground">
          No results found for &quot;{searchQuery}&quot;
        </p>
      );
    }

    if (filteredCurrencies.length !== currenciesIso.length) {
      const resultText = filteredCurrencies.length === 1 ? "result" : "results";
      return (
        <p className="text-sm mt-2 text-muted-foreground">
          Found {filteredCurrencies.length} {resultText}
        </p>
      );
    }

    return null;
  };

  // Show error state
  if (isError) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Exchange Rates</p>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-destructive font-medium">
            Error loading exchange rates
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {error instanceof Error
              ? error.message
              : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <p className="text-2xl font-semibold">Exchange Rates</p>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleRefresh}
              disabled={isLoading || isRefetching}
              className="h-8 w-8"
              aria-label="Refresh exchange rates"
              tabIndex={0}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading || isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
            <span className="text-xs font-medium whitespace-nowrap">
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                `Updated: ${formatDate(lastUpdated)}`
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">Base:</span>
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
                placeholder="Search currency..."
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

        <Table className="border border-border">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">#</TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort("code")}
                tabIndex={0}
                aria-label="Sort by code"
              >
                <div className="flex items-center gap-1 justify-center">
                  <Banknote className="h-4 w-4" />
                  Code {renderSortIcon("code")}
                </div>
              </TableHead>
              <TableHead
                className="hidden sm:table-cell font-semibold cursor-pointer"
                onClick={() => handleSort("symbol")}
                tabIndex={0}
                aria-label="Sort by symbol"
              >
                <div className="flex items-center gap-1 justify-center">
                  <DollarSign className="h-4 w-4" />
                  Symbol {renderSortIcon("symbol")}
                </div>
              </TableHead>
              <TableHead
                className="hidden md:table-cell font-semibold cursor-pointer"
                onClick={() => handleSort("name")}
                tabIndex={0}
                aria-label="Sort by name"
              >
                <div className="flex items-center gap-1">
                  <BadgeDollarSign className="h-4 w-4" />
                  Name {renderSortIcon("name")}
                </div>
              </TableHead>
              <TableHead
                className="hidden lg:table-cell font-semibold cursor-pointer"
                onClick={() => handleSort("country")}
                tabIndex={0}
                aria-label="Sort by country"
              >
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Country {renderSortIcon("country")}
                </div>
              </TableHead>
              <TableHead
                className="font-semibold cursor-pointer"
                onClick={() => handleSort("rate")}
                tabIndex={0}
                aria-label="Sort by exchange rate"
              >
                <div className="flex items-center gap-1 justify-end">
                  <ArrowLeftRight className="h-4 w-4" />
                  Exchange Rate {renderSortIcon("rate")}
                  {(isLoading || isRefetching) && (
                    <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />
                  )}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length > 0 ? (
              currentItems.map((currency, index) => (
                <TableRow key={currency.code} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium text-center">{currency.code}</TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    {currency.symbol}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {currency.name}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {currency.country}
                  </TableCell>
                  <TableCell className="text-right">
                    {isLoading ? (
                      <Skeleton className="h-4 w-16" />
                    ) : (
                      <span
                        className={`font-mono ${currency.code === currencyBase ? "font-semibold" : ""}`}
                      >
                        {formatExchangeRate(exchangeRates[currency.code])}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {searchQuery ? "No results found" : "No data available"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 0 && (
          <div className="mt-4 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    tabIndex={0}
                    aria-disabled={currentPage === 1}
                    className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} font-medium`}
                  />
                </PaginationItem>

                {getPageNumbers().map((pageNumber, index) => {
                  if (
                    pageNumber === "ellipsis-start" ||
                    pageNumber === "ellipsis-end"
                  ) {
                    return (
                      <PaginationItem key={`${pageNumber}-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        isActive={currentPage === pageNumber}
                        onClick={() => handlePageChange(Number(pageNumber))}
                        tabIndex={0}
                        className={`cursor-pointer ${currentPage === pageNumber ? "font-semibold" : ""}`}
                        aria-label={`Go to page ${pageNumber}`}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    tabIndex={0}
                    aria-disabled={currentPage === totalPages}
                    className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} font-medium`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
