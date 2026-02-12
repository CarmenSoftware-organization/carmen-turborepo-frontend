"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PeriodEndList from "./PeriodEndList";
import { mockPeriodEndData } from "@/mock-data/inventory-management";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function PeriodEndComponent() {
  const t = useTranslations("InventoryManagement");
  const tCommon = useTranslations("Common");
  const { search, setSearch, sort, setSort } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);

  const sortFields = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
  ];

  const title = t("PeriodEnd.title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="period-end-action-buttons">
      <Button size={"sm"}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="period-end-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="period-end-list-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="period-end-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="period-end-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="period-end-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="period-end-list-sort-dropdown"
        />
        <Button size={"sm"}>Add Filter</Button>
      </div>
    </div>
  );

  const content = <PeriodEndList periodEnds={mockPeriodEndData} />;

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
