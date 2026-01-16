"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PurchaseRequestTemplateList from "./PurchaseRequestTemplateList";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { useRouter } from "@/lib/navigation";
import { parseSortString } from "@/utils/table";
import { useAuth } from "@/context/AuthContext";
import { usePrTemplateQuery } from "@/hooks/use-pr-tmpl";

export default function PurchaseRequestTemplateComponent() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tDataControls = useTranslations("DataControls");
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const router = useRouter();
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");

  const { prTmplData, paginate, isLoading } = usePrTemplateQuery(token, buCode, {
    page: page ? Number(page) : 1,
    sort,
    search,
  });

  const currentPage = paginate?.page || 1;
  const totalItems = paginate?.total || 0;
  const perpageItem = paginate?.perpage || 10;
  const totalPages = paginate?.pages || 1;

  const sortFields = [{ key: "no", label: tDataControls("pr_no") }];

  const title = tPurchaseRequest("template");

  const actionButtons = (
    <div className="action-btn-container" data-id="pr-template-action-buttons">
      <Button size={"sm"} onClick={() => router.push("/procurement/purchase-request-template/new")}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="pr-template-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size={"sm"} data-id="pr-template-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="pr-template-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="pr-template-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="pr-template-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="pr-template-list-sort-dropdown"
        />
        <Button size={"sm"}>{tCommon("filter")}</Button>
      </div>
    </div>
  );

  const content = (
    <PurchaseRequestTemplateList
      prts={prTmplData ?? []}
      isLoading={isLoading}
      totalItems={totalItems ?? 0}
      currentPage={currentPage}
      totalPages={totalPages ?? 1}
      perpage={perpageItem ?? 10}
      onPageChange={() => {}}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={() => {}}
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
