"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PurchaseRequestList from "./PurchaseRequestList";
import PurchaseRequestGrid from "./PurchaseRequestGrid";
import DialogNewPr from "./DialogNewPr";
import { VIEW } from "@/constants/enum";
import SignInDialog from "@/components/SignInDialog";
import { useAuth } from "@/context/AuthContext";
import ToggleView from "@/components/ui-custom/ToggleView";
import { usePurchaseRequest } from "@/hooks/usePurchaseRequest";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const sortFields = [
  { key: "", label: "All" },
  { key: "pr_no", label: "PR Number" },
  { key: "date", label: "Date" },
  { key: "department", label: "Department" },
  { key: "requestor", label: "Requestor" },
  { key: "amonut", label: "Amount" },
];

export default function PurchaseRequestComponent() {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [page, setPage] = useURL("page");

  const { data: prs, isLoading } = usePurchaseRequest(token, tenantId, {
    page: page ? parseInt(page) : 1,
    sort,
    search,
  });

  const totalItems = prs?.paginate.total;

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const title = "Purchase Request";

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="purchase-request-action-buttons"
    >
      <Button size={"sm"} onClick={handleOpenDialog}>
        <Plus />
        {tCommon("add")} Purchase Request
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="pr-list-export-button"
      >
        <FileDown />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="pr-list-print-button">
        <Printer />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="pr-list-filters">
      <div className="flex items-center gap-2 w-2/3">
        <SearchInput
          defaultValue={search}
          onSearch={setSearch}
          placeholder={tCommon("search")}
          data-id="pr-list-search-input"
        />
        <Button size={"sm"} className="h-8">
          My Pending
        </Button>
        <Button size={"sm"} className="h-8" variant={'outline'}>
          All Document
        </Button>
        <Select>
          <SelectTrigger className="w-[250px] h-8 text-xs">
            <SelectValue placeholder="All Stage" />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="all">All Stage</SelectItem>
            <SelectItem value="requestor">Requestor</SelectItem>
            <SelectItem value="approver">Department Head Approval</SelectItem>
            <SelectItem value="finnace">Finance Manager Approval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="pr-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          Filter
        </Button>
        <div className="hidden lg:block">
          <ToggleView view={view} setView={setView} />
        </div>
      </div>
    </div>
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const currentPageNumber = parseInt(page || "1");

  const content = (
    <>
      <div className="block lg:hidden">
        <PurchaseRequestGrid
          purchaseRequests={prs?.data}
          currentPage={currentPageNumber}
          totalPages={prs?.paginate.pages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <PurchaseRequestList
            purchaseRequests={prs?.data}
            currentPage={currentPageNumber}
            totalPages={prs?.paginate.pages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            totalItems={totalItems}
          />
        ) : (
          <PurchaseRequestGrid
            purchaseRequests={prs?.data}
            currentPage={currentPageNumber}
            totalPages={prs?.paginate.pages}
            onPageChange={handlePageChange}
            isLoading={isLoading}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <DialogNewPr open={dialogOpen} onOpenChange={setDialogOpen} />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
