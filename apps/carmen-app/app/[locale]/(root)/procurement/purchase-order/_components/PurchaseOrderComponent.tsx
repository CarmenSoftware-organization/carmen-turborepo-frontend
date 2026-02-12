"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useEffect, useState } from "react";
import PurchaseOrderList from "./PurchaseOrderList";
import DialogNewPo from "./DialogNewPo";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { parseSortString } from "@/utils/table";
import { useAuth } from "@/context/AuthContext";
import { usePoQuery } from "@/hooks/use-po";

export default function PurchaseOrderComponent() {
  const { token, buCode } = useAuth();

  const tCommon = useTranslations("Common");
  const tDataControls = useTranslations("DataControls");
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const { search, setSearch, sort, setSort, setPage, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { poData, paginate, isLoading, isUnauthorized } = usePoQuery(token, buCode);

  const sortFields = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "symbol", label: "Symbol" },
    { key: "is_active", label: "Status" },
    { key: "exchange_rate", label: "Exchange Rate" },
  ];

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const totalItems = paginate?.total;

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const title = tPurchaseOrder("title");

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="po-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="po-list-search-input"
      />

      <div className="flex items-center gap-2">
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="po-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tDataControls("filter")}
        </Button>
      </div>
    </div>
  );

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="po-action-buttons">
      <Button size={"sm"} onClick={handleOpenDialog}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="po-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size={"sm"} data-id="pr-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const content = (
    <PurchaseOrderList
      purchaseOrders={poData || []}
      currentPage={pageNumber}
      totalPages={paginate?.pages ?? 1}
      totalItems={totalItems ?? 0}
      perpage={perpageNumber}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
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
      <DialogNewPo open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
