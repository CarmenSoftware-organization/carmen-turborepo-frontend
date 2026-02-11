"use client";

import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Plus, Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { Link } from "@/lib/navigation";
import { useInventoryAdjustmentQuery } from "@/hooks/use-inventory-adjustment";
import InventoryAdjustmentList from "./InventoryAdjustmentList";

export default function InventoryAdjustmentComponent() {
  const { token, buCode } = useAuth();
  const { dateFormat } = useBuConfig();
  const { search, setSearch, filter, setFilter, sort, setSort, perpageNumber, pageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const tAdj = useTranslations("InventoryAdjustment");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const [statusOpen, setStatusOpen] = useState(false);

  const { adjDatas, isLoading, paginate } = useInventoryAdjustmentQuery(token, buCode, {
    page: pageNumber,
    perpage: perpageNumber,
    search,
    filter,
    sort,
  });

  const title = tAdj("title");

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

  useEffect(() => {
    if (search) {
      setSort("");
    }
  }, [search, setSort]);

  const actionButtons = (
    <div className="action-btn-container" data-id="adj-type-list-action-buttons">
      <Button size="sm" asChild>
        <Link href="/inventory-management/inventory-adjustment/stock-in/new">
          <Plus className="h-4 w-4" />
          {tAdj("stock_in")}
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/inventory-management/inventory-adjustment/stock-out/new">
          <Plus className="h-4 w-4" />
          {tAdj("stock_out")}
        </Link>
      </Button>
      <Button variant="outlinePrimary" className="group" size="sm" data-id="adj-type-export-button">
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size="sm" data-id="adj-type-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="adj-type-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="adj-type-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="adj-type-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="adj-type-sort-dropdown"
        />
      </div>
    </div>
  );

  const parsedSort = sort
    ? {
        field: sort.split(":")[0],
        direction: sort.split(":")[1] as "asc" | "desc",
      }
    : undefined;

  const content = (
    <InventoryAdjustmentList
      adjDatas={adjDatas}
      isLoading={isLoading}
      currentPage={paginate?.current_page ?? 1}
      totalPages={paginate?.total_pages ?? 1}
      totalItems={paginate?.total_items ?? 0}
      perpage={paginate?.per_page ?? 10}
      onPageChange={handlePageChange}
      setPerpage={handleSetPerpage}
      sort={parsedSort}
      onSort={setSort}
      dateFormat={dateFormat ?? "yyyy-MM-dd"}
    />
  );

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
