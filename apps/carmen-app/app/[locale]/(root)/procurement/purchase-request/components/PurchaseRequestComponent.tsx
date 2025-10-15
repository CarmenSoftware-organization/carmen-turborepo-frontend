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
import { parseSortString } from "@/utils/table-sort";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";



export default function PurchaseRequestComponent() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tTableHeader = useTranslations("TableHeader");
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tDataControls = useTranslations("DataControls");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const sortFields = [
    { key: "", label: tTableHeader("all") },
    { key: "pr_no", label: tTableHeader("pr_no") },
    { key: "pr_date", label: tTableHeader("date") },
    { key: "workflow_name", label: tTableHeader("type") },
    { key: "pr_status", label: tTableHeader("status") },
    { key: "workflow_current_stage", label: tTableHeader("stage") },
    { key: "requestor_name", label: tTableHeader("requestor") },
    { key: "department_name", label: tTableHeader("department") },
    { key: "total_amount", label: tTableHeader("amount") },
  ];

  const { data: prs, isLoading } = usePurchaseRequest(token, buCode, {
    page: page ? parseInt(page) : 1,
    sort,
    search,
    perpage: perpage,
  });

  const totalItems = prs?.paginate?.total ?? 0;
  const totalPages = prs?.paginate?.pages ?? 1;

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);


  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const title = tPurchaseRequest("title");

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const actionButtons = (
    <TooltipProvider>
      <div
        className="action-btn-container"
        data-id="purchase-request-action-buttons"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size={"sm"} onClick={handleOpenDialog}>
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tPurchaseRequest("tooltip_pr_created")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outlinePrimary"
              className="group"
              size={"sm"}
              data-id="pr-list-export-button"
            >
              <FileDown />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tCommon("export")}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outlinePrimary" size={"sm"} data-id="pr-list-print-button">
              <Printer />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{tCommon("print")}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const filters = (
    <div className="filter-container" data-id="pr-list-filters">
      <div className="flex items-center gap-2">
        <SearchInput
          defaultValue={search}
          onSearch={setSearch}
          placeholder={tCommon("search")}
          data-id="pr-list-search-input"
        />
        <Button size={"sm"} className="h-8">
          {tDataControls("myPening")}
        </Button>
        <Button size={"sm"} className="h-8" variant={'outlinePrimary'}>
          {tDataControls("allDoc")}
        </Button>
        <Select>
          <SelectTrigger className="w-[120px] h-8 text-xs bg-muted">
            <SelectValue placeholder={tDataControls("allStage")} />
          </SelectTrigger>
          <SelectContent >
            <SelectItem value="all">{tDataControls("allStage")}</SelectItem>
            <SelectItem value="requestor">{tDataControls("requestor")}</SelectItem>
            <SelectItem value="approver">{tDataControls("department_head_approval")}</SelectItem>
            <SelectItem value="finnace">{tDataControls("finance_manager_approval")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SortComponent
                  fieldConfigs={sortFields}
                  sort={sort}
                  setSort={setSort}
                  data-id="pr-list-sort-dropdown"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tPurchaseRequest("tooltip_pr_sort")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"sm"}>
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {tDataControls("filter")}
            </TooltipContent>
          </Tooltip>

          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <ToggleView view={view} setView={setView} />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Switch between list and grid view</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

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
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <PurchaseRequestList
            purchaseRequests={prs?.data || []}
            currentPage={currentPageNumber}
            totalPages={totalPages}
            totalItems={totalItems}
            perpage={prs?.paginate?.perpage ?? 10}
            onPageChange={handlePageChange}
            isLoading={isLoading}
            sort={parseSortString(sort)}
            onSort={setSort}
            setPerpage={handleSetPerpage}
          />
        ) : (
          <PurchaseRequestGrid
            purchaseRequests={prs?.data}
            currentPage={currentPageNumber}
            totalPages={totalPages}
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
