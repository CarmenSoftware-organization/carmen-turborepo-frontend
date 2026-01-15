"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Grid, List, Plus, Printer } from "lucide-react";
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
import { usePurchaseRequest } from "@/hooks/use-purchase-request";
import { useDebounce } from "../_hooks/use-debounce";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSortString } from "@/utils/table";
import { convertStatus } from "@/utils/status";
import FilterPurchaseRequest, { PurchaseRequestFilterValues } from "./FilterPurchaseRequest";
import ExportDropdown, { ExportFormat } from "@/components/ui-custom/ExportDropdown";
import { exportToExcel, exportToPDF, exportToWord, ExportData } from "@/utils/export";
import ErrorBoundary from "./ErrorBoundary";
import SelectWorkflowStage from "./form-pr/SelectWorkflowStage";
import SelectPrStatus from "./SelectPrStatus";
import { FETCH_TYPE } from "../_constants/pr-status";
import DataGridLoading from "@/components/loading/DataGridLoading";

export default function PurchaseRequestComponent() {
  const { token, buCode, businessUnits } = useAuth();
  const tCommon = useTranslations("Common");
  const tTableHeader = useTranslations("TableHeader");
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tDataControls = useTranslations("DataControls");
  const tStatus = useTranslations("Status");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);
  const [search, setSearch] = useURL("search");
  const [keyword, setKeyword] = useState(search || "");
  const debouncedKeyword = useDebounce(keyword, 500);
  const [fetchType, setFetchType] = useState<FETCH_TYPE | undefined>(FETCH_TYPE.MY_PENDING);

  const buCodes = businessUnits?.map((bu) => bu.code).join(",") || buCode;

  const [currentBuCode, setCurrentBuCode] = useState(buCodes);
  const [activeTab, setActiveTab] = useState(buCode);

  // Sync currentBuCode when buCodes changes (e.g., after businessUnits loads)
  useEffect(() => {
    if (fetchType === "my-pending") {
      setCurrentBuCode(buCodes);
    }
  }, [buCodes, fetchType]);

  useEffect(() => {
    if (debouncedKeyword !== search) {
      setSearch(debouncedKeyword);
    }
  }, [debouncedKeyword, search, setSearch]);

  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const [filterStatus, setFilterStatus] = useURL("filter_status");
  const [filterStage, setFilterStage] = useURL("stage");
  const [filterType, setFilterType] = useURL("filter_type");
  const [filterDepartment, setFilterDepartment] = useURL("filter_department");
  const [filterDateFrom, setFilterDateFrom] = useURL("filter_date_from");
  const [filterDateTo, setFilterDateTo] = useURL("filter_date_to");

  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

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

  const getCurrentFilterValues = (): PurchaseRequestFilterValues => {
    const dateRange =
      filterDateFrom || filterDateTo
        ? {
            from: filterDateFrom ? new Date(filterDateFrom) : undefined,
            to: filterDateTo ? new Date(filterDateTo) : undefined,
          }
        : undefined;

    return {
      status: filterStatus || undefined,
      stage: filterStage || undefined,
      prType: filterType || undefined,
      department: filterDepartment || undefined,
      dateRange,
    };
  };

  const { prs, isLoading } = usePurchaseRequest(
    token,
    currentBuCode,
    {
      page: page,
      sort,
      search,
      perpage: perpage,
      filter:
        filterStage && filterStage !== "all" ? `workflow_current_stage:${filterStage}` : undefined,
    },
    fetchType
  );

  useEffect(() => {
    if (prs?.data && prs.data.length > 0) {
      const availableBuCodes = prs.data.map((bu: any) => bu.bu_code);
      if (!activeTab || !availableBuCodes.includes(activeTab)) {
        setActiveTab(availableBuCodes[0]);
      }
    }
  }, [prs?.data, activeTab]);

  useEffect(() => {
    if (search) {
      setPage("");
    }
  }, [search, setPage]);

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handleApplyFilter = (filters: PurchaseRequestFilterValues) => {
    setFilterStatus(filters.status || "");
    setFilterStage(filters.stage || "");
    setFilterType(filters.prType || "");
    setFilterDepartment(filters.department || "");

    if (filters.dateRange?.from) {
      setFilterDateFrom(filters.dateRange.from.toISOString().split("T")[0]);
    } else {
      setFilterDateFrom("");
    }

    if (filters.dateRange?.to) {
      setFilterDateTo(filters.dateRange.to.toISOString().split("T")[0]);
    } else {
      setFilterDateTo("");
    }
    setPage("");
  };

  const handleResetFilter = () => {
    setFilterStatus("");
    setFilterStage("");
    setFilterType("");
    setFilterDepartment("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setPage("");
  };

  const handleExport = (format: ExportFormat) => {
    if (!prs?.data || prs.data.length === 0) {
      console.warn("No data to export");
      return;
    }

    const exportData: ExportData = {
      filename: `Purchase_Requests_${new Date().toISOString().split("T")[0]}`,
      headers: [
        tTableHeader("pr_no"),
        tTableHeader("date"),
        tTableHeader("type"),
        tTableHeader("status"),
        tTableHeader("stage"),
        tTableHeader("requestor"),
        tTableHeader("department"),
        tTableHeader("amount"),
      ],
      rows: (prs?.data || [])
        .flatMap((bu: any) => bu.data || [])
        .map((pr: any) => [
          pr.pr_no || "-",
          pr.pr_date || "-",
          pr.workflow_name || "-",
          getStatusLabel(pr.pr_status) || "-",
          pr.workflow_current_stage || "-",
          pr.requestor_name || "-",
          pr.department_name || "-",
          pr.total_amount?.toLocaleString() || "0",
        ]),
    };

    switch (format) {
      case "excel":
        exportToExcel(exportData);
        break;
      case "word":
        exportToWord(exportData);
        break;
      case "pdf":
        exportToPDF(exportData);
        break;
    }
  };

  const title = tPurchaseRequest("title");

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const actionButtons = (
    <div className="action-btn-container" data-id="purchase-request-action-buttons">
      <Button size={"sm"} onClick={handleOpenDialog}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <ExportDropdown onExport={handleExport}>
        <Button
          variant="outlinePrimary"
          className="group"
          size={"sm"}
          data-id="pr-list-export-button"
        >
          <FileDown className="h-4 w-4" />
          <p>{tCommon("export")}</p>
        </Button>
      </ExportDropdown>

      <Button variant="outlinePrimary" size={"sm"} data-id="pr-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="space-y-2">
      <div className="filter-container" data-id="pr-list-filters">
        <SearchInput
          defaultValue={search}
          onSearch={setSearch}
          onInputChange={setKeyword}
          placeholder={tCommon("search")}
          data-id="pr-list-search-input"
        />
        <div className="flex items-center gap-2">
          <SortComponent
            fieldConfigs={sortFields}
            sort={sort}
            setSort={setSort}
            data-id="pr-list-sort-dropdown"
          />

          <FilterPurchaseRequest
            onApply={handleApplyFilter}
            onReset={handleResetFilter}
            initialValues={getCurrentFilterValues()}
          />

          <div className="hidden lg:block">
            <div className="flex items-center gap-2">
              <Button
                variant={view === VIEW.LIST ? "default" : "outlinePrimary"}
                size={"sm"}
                onClick={() => setView(VIEW.LIST)}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
                {tCommon("list_view")}
              </Button>
              <Button
                variant={view === VIEW.GRID ? "default" : "outlinePrimary"}
                size={"sm"}
                onClick={() => setView(VIEW.GRID)}
                aria-label="Grid view"
              >
                <Grid className="h-4 w-4" />
                {tCommon("grid_view")}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size={"sm"}
          className="h-8"
          onClick={() => {
            setCurrentBuCode(buCodes);
            setFetchType(FETCH_TYPE.MY_PENDING);
            setActiveTab(buCode);
            setFilterStage("");
          }}
          variant={fetchType === FETCH_TYPE.MY_PENDING ? "default" : "outlinePrimary"}
        >
          {tDataControls("myPending")}
        </Button>
        <Button
          size={"sm"}
          className="h-8"
          variant={fetchType ? "outlinePrimary" : "default"}
          onClick={() => {
            setCurrentBuCode(buCode);
            setFetchType(undefined);
            setActiveTab(buCode);
            setFilterStage("");
          }}
        >
          {tDataControls("allDoc")}
        </Button>

        {fetchType !== FETCH_TYPE.MY_PENDING && (
          <SelectPrStatus status={filterStatus} setStatus={setFilterStatus} />
        )}

        <SelectWorkflowStage
          token={token}
          buCode={currentBuCode}
          onSetStage={(stage) => {
            setFilterStage(stage);
            if (stage && stage !== "all") {
              setFetchType(undefined);
            }
          }}
          value={filterStage}
        />
      </div>
    </div>
  );

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const currentPageNumber = Number(page || "1");

  const content = (
    <ErrorBoundary>
      {isLoading ? (
        <DataGridLoading />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {prs?.data?.map((bu: any) => (
              <TabsTrigger key={bu.bu_code} value={bu.bu_code}>
                {bu.bu_name}
              </TabsTrigger>
            ))}
          </TabsList>
          {prs?.data?.map((bu: any) => (
            <TabsContent key={bu.bu_code} value={bu.bu_code}>
              <div className="block lg:hidden">
                <PurchaseRequestGrid
                  purchaseRequests={bu.data}
                  currentPage={bu.paginate?.page ?? currentPageNumber}
                  totalPages={bu.paginate?.pages ?? 1}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                  convertStatus={getStatusLabel}
                />
              </div>

              <div className="hidden lg:block">
                {view === VIEW.LIST ? (
                  <PurchaseRequestList
                    purchaseRequests={bu.data || []}
                    currentPage={bu.paginate?.page ?? currentPageNumber}
                    totalPages={bu.paginate?.pages ?? 1}
                    totalItems={bu.paginate?.total ?? 0}
                    perpage={bu.paginate?.perpage ?? 10}
                    onPageChange={handlePageChange}
                    sort={parseSortString(sort)}
                    onSort={setSort}
                    setPerpage={handleSetPerpage} // Note: global perpage change
                    convertStatus={getStatusLabel}
                    buCode={bu.bu_code}
                  />
                ) : (
                  <PurchaseRequestGrid
                    purchaseRequests={bu.data}
                    currentPage={bu.paginate?.page ?? currentPageNumber}
                    totalPages={bu.paginate?.pages ?? 1}
                    onPageChange={handlePageChange}
                    isLoading={isLoading}
                    convertStatus={getStatusLabel}
                  />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </ErrorBoundary>
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
