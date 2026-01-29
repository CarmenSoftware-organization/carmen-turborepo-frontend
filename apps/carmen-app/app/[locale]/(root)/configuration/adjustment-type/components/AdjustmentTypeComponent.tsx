"use client";

import { useAuth } from "@/context/AuthContext";
import { useAdjustmentTypeQuery } from "@/hooks/use-adjustment-type";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Plus, Printer, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { Link } from "@/lib/navigation";
import AdjustmentTypeList from "./AdjustmentTypeList";
export default function AdjustmentTypeComponent() {
  const { token, buCode } = useAuth();
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [filter, setFilter] = useURL("filter");
  const tAdj = useTranslations("AdjustmentType");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const [statusOpen, setStatusOpen] = useState(false);

  const { adjDatas, isLoading, paginate } = useAdjustmentTypeQuery(token, buCode, {
    page: page ? Number(page) : 1,
    perpage: perpage,
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

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const actionButtons = (
    <div className="action-btn-container" data-id="adj-type-list-action-buttons">
      <Button size="sm" asChild>
        <Link href="/configuration/adjustment-type/stock-in/new">
          <Plus className="h-4 w-4" />
          {tAdj("stock_in")}
        </Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/configuration/adjustment-type/stock-out/new">
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
    <AdjustmentTypeList
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
