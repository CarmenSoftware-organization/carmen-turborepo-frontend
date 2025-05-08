"use client";

import { useState, useEffect } from "react";
import currencies from "@/constants/currency";
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
import { Loader2, RefreshCw, Search, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { exchangeRateApiKey } from "@/lib/backend-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

type ExchangeRateResponse = {
    result: string;
    base_code: string;
    conversion_rates: Record<string, number>;
    time_last_update_utc: string;
};

type SortDirection = "asc" | "desc";

type SortField = "code" | "symbol" | "name" | "country" | "rate";

export default function ExchangeRateComponent() {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [baseCurrency, setBaseCurrency] = useState<string>("THB");
    const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [lastUpdated, setLastUpdated] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortField, setSortField] = useState<SortField>("code");
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

    // Filter currencies based on search query
    const filteredCurrencies = currencies.filter((currency) => {
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        return (
            currency.code.toLowerCase().includes(query) ||
            currency.name.toLowerCase().includes(query) ||
            currency.country.toLowerCase().includes(query)
        );
    });

    // Sort currencies based on sort field and direction
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

    // Calculate pagination
    const totalItems = sortedCurrencies.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCurrencies.slice(indexOfFirstItem, indexOfLastItem);

    // Reset to first page when search query or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortField, sortDirection]);

    // Fetch exchange rates from API
    const fetchExchangeRates = async (base: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeRateApiKey}/latest/${base}`);
            const data: ExchangeRateResponse = await response.json();

            if (data.result === "success") {
                setExchangeRates(data.conversion_rates);
                setLastUpdated(data.time_last_update_utc);
            }
        } catch (error) {
            console.error("Failed to fetch exchange rates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch and when base currency changes
    useEffect(() => {
        fetchExchangeRates(baseCurrency);
    }, [baseCurrency]);

    // Handle page change
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Handle base currency change
    const handleBaseCurrencyChange = (currency: string) => {
        setBaseCurrency(currency);
    };

    // Handle manual refresh
    const handleRefresh = () => {
        fetchExchangeRates(baseCurrency);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle clear search
    const handleClearSearch = () => {
        setSearchQuery("");
    };

    // Handle column sort
    const handleSort = (field: SortField) => {
        if (field === sortField) {
            // Toggle sort direction
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            // Set new sort field and default to ascending
            setSortField(field);
            setSortDirection("asc");
        }
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages are less than max visible pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);

            if (currentPage > 3) {
                pageNumbers.push("ellipsis-start");
            }

            // Show pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (currentPage < totalPages - 2) {
                pageNumbers.push("ellipsis-end");
            }

            // Always show last page
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    const activeCurrency = [
        "USD",
        "THB",
        "JPY",
    ]

    // Format exchange rate for display
    const formatExchangeRate = (rate: number) => {
        return rate ? rate.toFixed(4) : "-";
    };

    // Format date from API to a user-friendly format
    const formatDate = (dateString: string) => {
        try {
            // Convert API date format (e.g., "Thu, 08 May 2025 00:00:02 +0000") to ISO
            const date = new Date(dateString);
            return format(date, "dd MMM yyyy, HH:mm");
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    // Render sort icon based on current sort field and direction
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-1 h-3 w-3 inline" />;
        }

        return sortDirection === "asc"
            ? <ArrowUp className="ml-1 h-3 w-3 inline" />
            : <ArrowDown className="ml-1 h-3 w-3 inline" />;
    };

    // Render search results message
    const renderSearchResultsMessage = () => {
        if (filteredCurrencies.length === 0) {
            return <p className="text-sm mt-2 text-muted-foreground">No results found for "{searchQuery}"</p>;
        }

        if (filteredCurrencies.length !== currencies.length) {
            const resultText = filteredCurrencies.length === 1 ? 'result' : 'results';
            return (
                <p className="text-sm mt-2 text-muted-foreground">
                    Found {filteredCurrencies.length} {resultText}
                </p>
            );
        }

        return null;
    };

    return (
        <Card className="w-full shadow-sm border-0">
            <CardHeader className="px-6 pt-6 pb-0">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                    <CardTitle className="text-xl font-semibold">Exchange Rates</CardTitle>

                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-1.5 ml-auto">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="h-8 w-8"
                                aria-label="Refresh exchange rates"
                                tabIndex={0}
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
                            <div className="flex items-center gap-1">
                                {activeCurrency.map((currency) => (
                                    <Button
                                        key={currency}
                                        onClick={() => handleBaseCurrencyChange(currency)}
                                        variant={baseCurrency === currency ? "default" : "outline"}
                                        size="sm"
                                        className={`h-8 px-2.5 font-medium ${baseCurrency === currency ? 'shadow-sm' : ''}`}
                                        disabled={isLoading}
                                        tabIndex={0}
                                        aria-label={`Set base currency to ${currency}`}
                                    >
                                        {currency}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-6">
                <div className="relative mb-4">
                    <div className="flex">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search currency..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-9 pr-8 h-10"
                            />
                            {searchQuery && (
                                <button
                                    className="absolute right-3 top-2.5"
                                    onClick={handleClearSearch}
                                    tabIndex={0}
                                    aria-label="Clear search"
                                >
                                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                                </button>
                            )}
                        </div>
                    </div>

                    {renderSearchResultsMessage()}
                </div>

                <div className="rounded-md border shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead
                                    className="font-semibold cursor-pointer"
                                    onClick={() => handleSort("code")}
                                    tabIndex={0}
                                    aria-label="Sort by code"
                                >
                                    Code {renderSortIcon("code")}
                                </TableHead>
                                <TableHead
                                    className="hidden sm:table-cell font-semibold cursor-pointer"
                                    onClick={() => handleSort("symbol")}
                                    tabIndex={0}
                                    aria-label="Sort by symbol"
                                >
                                    Symbol {renderSortIcon("symbol")}
                                </TableHead>
                                <TableHead
                                    className="hidden md:table-cell font-semibold cursor-pointer"
                                    onClick={() => handleSort("name")}
                                    tabIndex={0}
                                    aria-label="Sort by name"
                                >
                                    Name {renderSortIcon("name")}
                                </TableHead>
                                <TableHead
                                    className="hidden lg:table-cell font-semibold cursor-pointer"
                                    onClick={() => handleSort("country")}
                                    tabIndex={0}
                                    aria-label="Sort by country"
                                >
                                    Country {renderSortIcon("country")}
                                </TableHead>
                                <TableHead
                                    className="font-semibold cursor-pointer"
                                    onClick={() => handleSort("rate")}
                                    tabIndex={0}
                                    aria-label="Sort by exchange rate"
                                >
                                    Exchange Rate {renderSortIcon("rate")}
                                    {isLoading && <Loader2 className="inline ml-2 h-3 w-3 animate-spin" />}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.length > 0 ? (
                                currentItems.map((currency) => (
                                    <TableRow key={currency.code} className="hover:bg-muted/30">
                                        <TableCell className="font-medium">{currency.code}</TableCell>
                                        <TableCell className="hidden sm:table-cell">{currency.symbol}</TableCell>
                                        <TableCell className="hidden md:table-cell">{currency.name}</TableCell>
                                        <TableCell className="hidden lg:table-cell">{currency.country}</TableCell>
                                        <TableCell>
                                            {isLoading ? (
                                                <Skeleton className="h-4 w-16" />
                                            ) : (
                                                <span className={`font-mono ${currency.code === baseCurrency ? "font-semibold" : ""}`}>
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
                </div>

                {totalPages > 0 && (
                    <div className="mt-4 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                        tabIndex={0}
                                        aria-disabled={currentPage === 1}
                                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} font-medium`}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((pageNumber, index) => {
                                    if (pageNumber === "ellipsis-start" || pageNumber === "ellipsis-end") {
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
                                                className={`cursor-pointer ${currentPage === pageNumber ? 'font-semibold' : ''}`}
                                                aria-label={`Go to page ${pageNumber}`}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                        tabIndex={0}
                                        aria-disabled={currentPage === totalPages}
                                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} font-medium`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
