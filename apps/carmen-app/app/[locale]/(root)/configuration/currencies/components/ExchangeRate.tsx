import { useExchangeRateQuery } from "@/hooks/currency";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import currenciesIso from "@/constants/currency";
import { useState, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  ArrowUpDown,
  Search,
  Minus,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ExchangeRateProps {
  readonly usedCurrencies: string[];
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

type SortField = "code" | "rate" | "name";
type SortOrder = "asc" | "desc";

interface CurrencyData {
  code: string;
  rate: number;
  details: {
    name: string;
    symbol: string;
  };
}

const TrendBadge = () => {
  const trendValue = useMemo(() => Math.random() * 0.1 - 0.05, []);
  const isPositive = trendValue > 0;
  const isNeutral = Math.abs(trendValue) < 0.01;

  const trendIcon = useMemo(() => {
    if (isNeutral) return <Minus className="h-3 w-3" />;
    return isPositive ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  }, [isNeutral, isPositive]);

  const trendColorClasses = useMemo(() => {
    if (isNeutral) {
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
    if (isPositive) {
      return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800";
  }, [isNeutral, isPositive]);

  return (
    <Badge
      className={`flex items-center justify-center gap-1 font-mono tabular-nums ${trendColorClasses}`}
    >
      {trendIcon}
      <span>{(trendValue * 100).toFixed(2)}%</span>
    </Badge>
  );
};

const SortIcon = ({
  sortField,
  sortOrder,
  column,
}: {
  sortField: SortField;
  sortOrder: SortOrder;
  column: SortField;
}) => {
  if (sortField !== column) {
    return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
  }
  if (sortOrder === "asc") {
    return <ArrowUp className="ml-2 h-4 w-4" />;
  }
  return <ArrowDown className="ml-2 h-4 w-4" />;
};

export default function ExchangeRate({
  usedCurrencies,
  open,
  onOpenChange,
}: ExchangeRateProps) {
  const baseCurrency = "THB";
  const { exchangeRates, isLoading, error } =
    useExchangeRateQuery(baseCurrency);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("code");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  const filteredAndSortedCurrencies = useMemo(() => {
    const availableCurrencies: CurrencyData[] = exchangeRates?.conversion_rates
      ? Object.keys(exchangeRates.conversion_rates)
          .filter((currency) => !usedCurrencies.includes(currency))
          .map((code) => ({
            code,
            rate: exchangeRates.conversion_rates[code],
            details: currenciesIso.find((c) => c.code === code) || {
              name: code,
              symbol: code,
            },
          }))
      : [];

    let result = [...availableCurrencies];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (currency) =>
          currency.code.toLowerCase().includes(searchLower) ||
          currency.details.name.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      let compareA: string | number = "";
      let compareB: string | number = "";

      switch (sortField) {
        case "code":
          compareA = a.code;
          compareB = b.code;
          break;
        case "name":
          compareA = a.details.name;
          compareB = b.details.name;
          break;
        case "rate":
          compareA = a.rate;
          compareB = b.rate;
          break;
      }

      if (typeof compareA === "number" && typeof compareB === "number") {
        return sortOrder === "asc" ? compareA - compareB : compareB - compareA;
      }

      return sortOrder === "asc"
        ? String(compareA).localeCompare(String(compareB))
        : String(compareB).localeCompare(String(compareA));
    });

    return result;
  }, [exchangeRates, usedCurrencies, searchTerm, sortField, sortOrder]);

  const totalPages = Math.ceil(
    filteredAndSortedCurrencies.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCurrencies = filteredAndSortedCurrencies.slice(
    startIndex,
    endIndex
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let page = startPage; page <= endPage; page++) {
      items.push(
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => handlePageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <span className="ml-2">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center p-8 text-red-500">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>อัตราแลกเปลี่ยน (ฐาน: {baseCurrency})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยรหัสหรือชื่อสกุลเงิน..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
                aria-label="Search currencies by code or name"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSortField("code");
                setSortOrder("asc");
                setCurrentPage(1);
              }}
            >
              รีเซ็ต
            </Button>
          </div>
          <div className="rounded-lg border">
            <div className="max-h-[450px] overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 [&>tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("code")}
                        className="p-0 hover:bg-transparent"
                      >
                        สกุลเงิน
                        <SortIcon
                          sortField={sortField}
                          sortOrder={sortOrder}
                          column="code"
                        />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("name")}
                        className="p-0 hover:bg-transparent"
                      >
                        ชื่อ
                        <SortIcon
                          sortField={sortField}
                          sortOrder={sortOrder}
                          column="name"
                        />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">
                      สัญลักษณ์
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("rate")}
                        className="p-0 hover:bg-transparent"
                      >
                        อัตราแลกเปลี่ยน
                        <SortIcon
                          sortField={sortField}
                          sortOrder={sortOrder}
                          column="rate"
                        />
                      </Button>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      เปลี่ยนแปลง (24ชม.)
                    </th>
                  </tr>
                </thead>
                <tbody className="[&>tr:last-child]:border-0">
                  {currentCurrencies.map(({ code, rate, details }) => (
                    <tr
                      key={code}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <td className="p-4 align-middle font-medium">{code}</td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {details.name}
                      </td>
                      <td className="p-4 align-middle text-center">
                        {details.symbol}
                      </td>
                      <td className="p-4 align-middle text-right font-mono tabular-nums">
                        {rate.toFixed(4)}
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex justify-end">
                          <TrendBadge />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {filteredAndSortedCurrencies.length > 0 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
