"use client";

import { CurrencyDto } from "@/dtos/config.dto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SquarePen, Trash2 } from "lucide-react";
import { TableBodySkeleton } from "@/components/loading/TableBodySkeleton";
import PaginationComponent from "@/components/PaginationComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  SortConfig,
  getSortableColumnProps,
  renderSortIcon,
} from "@/utils/table-sort";
import EmptyData from '@/components/EmptyData';

interface CurrencyListProps {
  readonly isLoading: boolean;
  readonly currencies: CurrencyDto[];
  readonly onEdit: (currency: CurrencyDto) => void;
  readonly onToggleStatus: (currency: CurrencyDto) => void;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: SortConfig;
  readonly onSort?: (field: string) => void;
}

const CurrencyTableHeader = ({
  sort,
  onSort,
  t,
}: {
  sort?: SortConfig;
  onSort?: (field: string) => void;
  t: (key: string) => string;
}) => (
  <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur supports-[backdrop-filter]:bg-muted/50">
    <TableRow className="hover:bg-transparent">
      <TableHead className="w-[10px] text-center font-semibold">#</TableHead>
      <TableHead
        {...getSortableColumnProps("name", sort, onSort)}
        className="w-[200px] text-left font-semibold cursor-pointer"
      >
        <div className="flex items-center gap-2">
          {t("name")}
          {renderSortIcon("name", sort)}
        </div>
      </TableHead>
      <TableHead
        {...getSortableColumnProps("code", sort, onSort)}
        className="w-[100px] text-center font-semibold cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2">
          {t("code")}
          {renderSortIcon("code", sort)}
        </div>
      </TableHead>
      <TableHead className="w-[80px] text-center font-semibold">
        {t("symbol")}
      </TableHead>
      <TableHead
        {...getSortableColumnProps("exchange_rate", sort, onSort)}
        className="w-[120px] text-right font-semibold cursor-pointer"
      >
        <div className="flex items-center justify-end gap-2">
          {t("exchangeRate")}
          {renderSortIcon("exchange_rate", sort)}
        </div>
      </TableHead>
      <TableHead
        {...getSortableColumnProps("is_active", sort, onSort)}
        className="w-[100px] text-center font-semibold"
      >
        <div className="flex items-center justify-center gap-2">
          {t("status")}
          {renderSortIcon("is_active", sort)}
        </div>
      </TableHead>
      <TableHead className="w-[120px] text-right font-semibold">
        {t("action")}
      </TableHead>
    </TableRow>
  </TableHeader>
);

const CurrencyTableRow = ({
  currency,
  index,
  onEdit,
  onToggleStatus,
  tCommon,
}: {
  currency: CurrencyDto;
  index: number;
  onEdit: (currency: CurrencyDto) => void;
  onToggleStatus: (currency: CurrencyDto) => void;
  tCommon: (key: string) => string;
}) => (
  <TableRow className="hover:bg-accent/50 transition-colors">
    <TableCell className="w-[10px] text-center font-medium">
      {index + 1}
    </TableCell>
    <TableCell
      className="w-[200px] text-left font-medium truncate"
      title={currency.name}
    >
      {currency.name}
    </TableCell>
    <TableCell className="w-[100px] text-center">
      {currency.code}
    </TableCell>
    <TableCell className="w-[80px] text-center">
      {currency.symbol}
    </TableCell>
    <TableCell className="w-[120px] text-right tabular-nums">
      {currency.exchange_rate}
    </TableCell>
    <TableCell className="w-[100px] text-center">
      <Badge
        variant={currency.is_active ? "active" : "inactive"}
        className="font-medium"
      >
        {currency.is_active ? tCommon("active") : tCommon("inactive")}
      </Badge>
    </TableCell>
    <TableCell className="w-[120px] text-right">
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => onEdit(currency)}
          aria-label="Edit currency"
          className="h-8 w-8 hover:bg-primary/10"
        >
          <SquarePen className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size={"sm"}
          onClick={() => onToggleStatus(currency)}
          aria-label={
            currency.is_active ? "Deactivate currency" : "Activate currency"
          }
          disabled={!currency.is_active}
          className="h-8 w-8 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
);

export default function CurrencyList({
  isLoading,
  currencies = [],
  onEdit,
  onToggleStatus,
  currentPage,
  totalPages,
  onPageChange,
  sort,
  onSort,
}: CurrencyListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const tCurrency = useTranslations("Currency");

  const renderTableContent = () => {
    if (isLoading) return <TableBodySkeleton rows={7} />;
    if (!currencies || currencies.length === 0)
      return <EmptyData message={tCurrency("notFoundCurrency")} />;

    return (
      <TableBody>
        {currencies.map((currency, index) => (
          <CurrencyTableRow
            key={currency.id}
            currency={currency}
            index={index}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            tCommon={tCommon}
          />
        ))}
      </TableBody>
    );
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg border bg-card">
        <Table>
          <CurrencyTableHeader sort={sort} onSort={onSort} t={t} />
        </Table>
        <ScrollArea className="h-[calc(102vh-300px)] w-full">
          <Table>{renderTableContent()}</Table>
        </ScrollArea>
      </div>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        position="right"
      />
    </div>
  );
}
