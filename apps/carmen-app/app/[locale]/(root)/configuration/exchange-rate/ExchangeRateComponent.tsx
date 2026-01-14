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
import ExchangeRateList from "./ExchangeRateList";
import ExchangeRateDialog from "./ExchangeRateDialog";
import { ExchangeRateItem } from "@/dtos/exchange-rate.dto";

export default function ExchangeRateComponent() {
  const { token, buCode, currencyBase } = useAuth();
  const tCommon = useTranslations("Common");

  const tExchangeRate = useTranslations("ExchangeRate");
  const tHeader = useTranslations("TableHeader");

  const { exchangeRates, lastUpdated, isLoading, isError, error, refetch, isRefetching } =
    useExchangeRate({ baseCurrency: currencyBase ?? "THB" });

  const { excData } = useExchangeRateQuery(token, buCode);

  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");

  const [statusOpen, setStatusOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedExc, setSelectedExc] = useState<ExchangeRateItem | undefined>();

  const title = tExchangeRate("title");

  const onSubmit = () => {
    const transformed = excData.map((exc: ExchangeRateItem) => ({
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
    <Button onClick={onSubmit} disabled={isRefetching} data-id="exchange-rate-refresh-button">
      <RefreshCw className="h-4 w-4" />
      Refresh
    </Button>
  );

  const onEdit = (exc: ExchangeRateItem) => {
    setSelectedExc(exc);
    setDialogOpen(true);
  };

  const filters = (
    <div className="filter-container" data-id="exchange-rate-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="exchange-rate-list-search-input"
      />
      <div className="fxr-c gap-2">
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

  const content = <ExchangeRateList excList={excData} onEdit={onEdit} />;

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
