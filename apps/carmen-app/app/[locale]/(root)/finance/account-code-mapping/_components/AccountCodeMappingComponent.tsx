"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, FileUp, Plus, Printer, Scan } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import AccountCodeMappingList from "./AccountCodeMappingList";
import { mockAccountCodeMappingData } from "@/mock-data/finance";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function AccountCodeMappingComponent() {
  const tCommon = useTranslations("Common");
  const { search, setSearch, sort, setSort } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);

  const sortFields = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
  ];

  const title = "Account Code Mapping";

  const actionButtons = (
    <div className="action-btn-container" data-id="account-code-mapping-action-buttons">
      <Button size={"sm"}>
        <Scan className="h-4 w-4" />
        {tCommon("scan")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="account-code-mapping-import-button">
        <FileUp className="h-4 w-4" />
        {tCommon("import")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="account-code-mapping-export-button">
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="account-code-mapping-print-button">
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
    <div className="filter-container" data-id="account-code-mapping-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="account-code-mapping-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="account-code-mapping-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="account-code-mapping-sort-dropdown"
        />
        <Button size={"sm"}>Add Filter</Button>
      </div>
    </div>
  );

  const content = <AccountCodeMappingList mappings={mockAccountCodeMappingData} />;

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
