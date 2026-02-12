"use client";

import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { useExchangeRateMutation, useExchangeRateQuery } from "@/hooks/use-exchange-rate";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useListPageState } from "@/hooks/use-list-page-state";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import ExchangeRateList from "./ExchangeRateList";
import ExchangeRateDialog from "./ExchangeRateDialog";
import { ExchangeRateItem } from "@/dtos/exchange-rate.dto";
import { useCurrenciesQuery } from "@/hooks/use-currency";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface CurrencyWithDiff {
  id: string;
  code: string;
  oldRate: number;
  newRate: number;
  diff: number;
  diffPercent: number;
}

export default function ExchangeRateComponent() {
  const { token, buCode } = useAuth();
  const { currencyBase } = useBuConfig();
  const tCommon = useTranslations("Common");

  const tExchangeRate = useTranslations("ExchangeRate");
  const tHeader = useTranslations("TableHeader");

  const { exchangeRates, isRefetching } = useExchangeRate({ baseCurrency: currencyBase ?? "THB" });

  const { currencies, isLoading: isLoadingCurrencies } = useCurrenciesQuery(token, buCode, {
    perpage: -1,
  });

  const currencyList = currencies?.data;

  // Map currencyList กับ exchangeRates และคำนวณ diff rate (filter out base currency)
  const currencyWithDiff: CurrencyWithDiff[] = useMemo(() => {
    if (!currencyList || !exchangeRates) return [];

    return currencyList
      .filter((currency: (typeof currencyList)[number]) => currency.code !== currencyBase)
      .map((currency: (typeof currencyList)[number]) => {
        const oldRate = currency.exchange_rate ?? 0;
        const newRate = exchangeRates[currency.code] ?? 0;
        const diff = newRate - oldRate;
        const diffPercent = oldRate === 0 ? 0 : (diff / oldRate) * 100;

        return {
          id: currency.id,
          code: currency.code,
          oldRate,
          newRate,
          diff,
          diffPercent,
        };
      });
  }, [currencyList, exchangeRates, currencyBase]);

  const { search, setSearch, filter, setFilter, sort, setSort, setPage, setPerpage, pageNumber, perpageNumber, handlePageChange } = useListPageState();

  const {
    excData,
    isLoading: isLoadingExc,
    totalItems,
    totalPages,
    currentPage,
    perpage: perpageData,
  } = useExchangeRateQuery(token, buCode, {
    page: pageNumber,
    perpage: perpageNumber,
    sort: "at_date:desc",
  });
  const { mutate: updateExchangeRates } = useExchangeRateMutation(token, buCode);

  const [statusOpen, setStatusOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExc, setSelectedExc] = useState<ExchangeRateItem | undefined>();

  const title = tExchangeRate("title");

  const onSubmit = () => {
    const payload = currencyWithDiff.map((item) => ({
      currency_id: item.id,
      at_date: new Date().toISOString(),
      exchange_rate: item.newRate,
    }));

    updateExchangeRates(payload, {
      onSuccess: () => {
        toastSuccess({ message: tExchangeRate("update_success") });
      },
      onError: () => {
        toastError({ message: tExchangeRate("update_error") });
      },
    });
  };

  const sortFields = [
    {
      key: "name",
      label: tHeader("name"),
    },
    {
      key: "is_active",
      label: tHeader("status"),
    },
  ];

  const actionButtons = (
    <Button
      onClick={onSubmit}
      disabled={isLoadingCurrencies || isRefetching}
      data-id="exchange-rate-refresh-button"
      size={"sm"}
    >
      <RefreshCw className="h-4 w-4" />
      {tExchangeRate("update_exchange_rates")}
    </Button>
  );

  const onEdit = (exc: ExchangeRateItem) => {
    setSelectedExc(exc);
    setDialogOpen(true);
  };

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="exchange-rate-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="exchange-rate-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="exchange-rate-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="exchange-rate-sort-dropdown"
        />
      </div>
    </div>
  );

  const handlePerpageChange = (newPerpage: number) => {
    setPerpage(String(newPerpage));
    setPage("1");
  };

  const content = (
    <ExchangeRateList
      excList={excData}
      onEdit={onEdit}
      isLoading={isLoadingExc}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      perpage={perpageData}
      onPageChange={handlePageChange}
      setPerpage={handlePerpageChange}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <ExchangeRateDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={selectedExc}
      />
    </>
  );
}
