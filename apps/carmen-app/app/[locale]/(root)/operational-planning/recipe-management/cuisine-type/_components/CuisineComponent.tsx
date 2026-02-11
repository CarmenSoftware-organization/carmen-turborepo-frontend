"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { mockCuisineTypeData } from "@/mock-data/operational-planning";
import CuisineList from "./CuisineList";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function CuisineComponent() {
  const t = useTranslations("OperationalPlanning.CuisineType");
  const tCommon = useTranslations("Common");
  const { search, setSearch, sort, setSort } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);

  const sortFields = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
  ];

  const title = t("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="cuisine-type-action-buttons">
      <Button variant={"outline"} size={"sm"}>
        <FileUp className="h-4 w-4" />
        {tCommon("import")}
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="cuisine-type-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="cuisine-type-list-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
      <Button size={"sm"}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="cuisine-type-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="cuisine-type-list-search-input"
      />
      <div className="flex items-center gap-2">
        <Button size={"sm"} variant={"outline"}>
          No Recipe
        </Button>
        <Button size={"sm"} variant={"outline"}>
          Has Recipe
        </Button>
        <Button size={"sm"} variant={"outline"}>
          Asian
        </Button>
        <Button size={"sm"} variant={"outline"}>
          European
        </Button>
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="cuisine-type-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="cuisine-type-list-sort-dropdown"
        />
        <Button size={"sm"}>Add Filter</Button>
      </div>
    </div>
  );

  const content = <CuisineList cuisineTypes={mockCuisineTypeData} />;

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
