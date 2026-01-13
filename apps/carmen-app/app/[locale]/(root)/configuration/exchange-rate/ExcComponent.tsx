"use client";

import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useExchangeRateQuery } from "@/hooks/use-exchange-rate";
import { useExchangeRate } from "@/hooks/useExchangeRate";
import { useURL } from "@/hooks/useURL";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ExcList from "./ExcList";

export default function ExcComponent() {
  const { token, buCode, currencyBase } = useAuth();
  const tCommon = useTranslations("Common");

  const tExchangeRate = useTranslations("ExchangeRate");
  const tHeader = useTranslations("TableHeader");

  const { exchangeRates, lastUpdated, isLoading, isError, error, refetch, isRefetching } =
    useExchangeRate({ baseCurrency: currencyBase ?? "THB" });

  const { excData } = useExchangeRateQuery(token, buCode);

  console.log("excData:", excData);

  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");

  const [statusOpen, setStatusOpen] = useState(false);

  const title = tExchangeRate("title");

  const handleRefresh = () => {
    const transformed = excData.map((exc: any) => ({
      currency_id: exc.currency_id,
      at_date: new Date().toISOString(),
      exchange_rate: exchangeRates?.[exc.currency_code] ?? 0,
    }));

    console.log("transformed:", transformed);
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
    <Button onClick={handleRefresh} disabled={isRefetching} data-id="exchange-rate-refresh-button">
      <RefreshCw className="h-4 w-4" />
      Retry
    </Button>
  );

  const filters = (
    <div className="filter-container" data-id="delivery-point-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="delivery-point-list-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="delivery-point-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="delivery-point-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = <ExcList excList={excData} />;

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
