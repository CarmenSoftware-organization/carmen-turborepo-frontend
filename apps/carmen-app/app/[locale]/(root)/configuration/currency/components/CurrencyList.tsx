"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { Activity, Banknote, Coins, List, MoreHorizontal, Replace, Trash2 } from "lucide-react";
import {
  SortConfig,
  getSortableColumnProps,
  renderSortIcon,
} from "@/utils/table-sort";
import { CurrencyGetDto, CurrencyUpdateDto } from "@/dtos/currency.dto";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TableTemplate, { TableColumn, TableDataSource } from "@/components/table/TableTemplate";
import { Checkbox } from "@/components/ui/checkbox";
import SortableColumnHeader from "@/components/table/SortableColumnHeader";
import { StatusCustom } from "@/components/ui-custom/StatusCustom";

interface CurrencyListProps {
  readonly isLoading: boolean;
  readonly currencies: CurrencyGetDto[];
  readonly onEdit: (currency: CurrencyUpdateDto) => void;
  readonly onToggleStatus: (currency: CurrencyUpdateDto) => void;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly totalItems: number;
  readonly onPageChange: (page: number) => void;
  readonly sort?: SortConfig;
  readonly onSort?: (field: string) => void;
  readonly selectedCurrencies: string[];
  readonly onSelectAll: (isChecked: boolean) => void;
  readonly onSelect: (id: string) => void;
  readonly perpage: number;
  readonly setPerpage: (perpage: number) => void;
}


export default function CurrencyList({
  isLoading,
  currencies = [],
  onEdit,
  onToggleStatus,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  sort,
  onSort,
  selectedCurrencies,
  onSelectAll,
  onSelect,
  perpage,
  setPerpage
}: CurrencyListProps) {
  const t = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");

  const columns: TableColumn[] = [
    {
      title: (
        <Checkbox
          checked={selectedCurrencies.length === currencies.length}
          onCheckedChange={onSelectAll}
        />
      ),
      dataIndex: "select",
      key: "select",
      width: "w-4",
      align: "center",
      render: (_: unknown, record: TableDataSource) => {
        return <Checkbox checked={selectedCurrencies.includes(record.key)} onCheckedChange={() => onSelect(record.key)} />;
      },
    },
    {
      title: "#",
      dataIndex: "no",
      key: "no",
      width: "w-4",
      align: "center",
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="name"
          label={t("name")}
          sort={sort ?? { field: "name", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "name",
      key: "name",
      align: "left",
      width: "w-0 md:w-96",
      icon: <List className="h-4 w-4" />,
      render: (_: unknown, record: TableDataSource) => {
        const currency = currencies.find(c => c.id === record.key);
        if (!currency) return null;
        return (
          <button
            type="button"
            className="btn-dialog"
            onClick={() => onEdit(currency)}
          >
            {currency.name}
          </button>
        );
      },
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="code"
          label={t("code")}
          sort={sort ?? { field: "code", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "code",
      key: "code",
      align: "center",
      width: "w-20",
      icon: <Banknote className="h-4 w-4" />,
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="symbol"
          label={t("symbol")}
          sort={sort ?? { field: "symbol", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "symbol",
      key: "symbol",
      width: "w-20",
      align: "center",
      icon: <Coins className="h-4 w-4" />,
    },
    {
      title: (
        <SortableColumnHeader
          columnKey="exchange_rate"
          label={t("exchangeRate")}
          sort={sort ?? { field: "exchange_rate", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "exchange_rate",
      key: "exchange_rate",
      width: "w-44",
      align: "right",
      icon: <Replace className="h-4 w-4" />,
      render: (value: number) => {
        return <span className="text-sm font-medium font-mono">{value}</span>;
      },

    },
    {
      title: (
        <SortableColumnHeader
          columnKey="is_active"
          label={t("status")}
          sort={sort ?? { field: "is_active", direction: "asc" }}
          onSort={onSort ?? (() => { })}
          getSortableColumnProps={getSortableColumnProps}
          renderSortIcon={renderSortIcon}
        />
      ),
      dataIndex: "is_active",
      key: "is_active",
      width: "w-0 md:w-20",
      align: "center",
      icon: <Activity className="h-4 w-4" />,
      render: (is_active: boolean) => (
        <div className="flex justify-center">
          <StatusCustom is_active={is_active}>
            {is_active ? tCommon("active") : tCommon("inactive")}
          </StatusCustom>
        </div>
      ),
    },
    {
      title: t("action"),
      dataIndex: "action",
      key: "action",
      width: "w-0 md:w-32",
      align: "right",
      render: (_: unknown, record: TableDataSource) => {
        const currency = currencies.find(c => c.id === record.key);
        if (!currency) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="text-destructive cursor-pointer hover:bg-transparent"
                onClick={() => onToggleStatus(currency)}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const dataSource: TableDataSource[] = currencies.map((currency, index) => ({
    select: false,
    key: currency.id,
    no: (currentPage - 1) * 10 + index + 1,
    name: currency.name,
    code: currency.code,
    symbol: currency.symbol,
    exchange_rate: currency.exchange_rate,
    is_active: currency.is_active,
  }));

  return (
    <TableTemplate
      columns={columns}
      dataSource={dataSource}
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={onPageChange}
      isLoading={isLoading}
      perpage={perpage}
      setPerpage={setPerpage}
    />
  );
}
