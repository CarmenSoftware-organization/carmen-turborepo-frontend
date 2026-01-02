"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import VendorList from "./VendorList";
import SignInDialog from "@/components/SignInDialog";
import { useVendor } from "@/hooks/use-vendor";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { vendorManagementPermission } from "@/lib/permission";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const sortFields = [{ key: "name", label: "Name" }];

export default function VendorComponent() {
  const { token, buCode, permissions } = useAuth();
  const router = useRouter();
  // Get permissions for vendor resource
  const vendorPerms = vendorManagementPermission.get(permissions, "vendor");

  const tCommon = useTranslations("Common");
  const tVendor = useTranslations("Vendor");
  const tAction = useTranslations("Action");
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const { vendors, isLoading, isUnauthorized } = useVendor(token, buCode, {
    search,
    sort,
    page: page ? Number(page) : 1,
    perpage: perpage ? Number(perpage) : 10,
  });

  const totalItems = vendors?.paginate?.total ?? 0;
  const totalPages = vendors?.paginate?.pages ?? 1;
  const currentPage = vendors?.paginate?.page ?? 1;
  const currentPerpage = vendors?.paginate?.perpage ?? 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const title = tVendor("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="vendor-action-buttons">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              disabled={!vendorPerms.canCreate}
              onClick={() => {
                router.push("/vendor-management/vendor/new");
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent> {tVendor("add_vendor")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outlinePrimary"
              className="group"
              size="sm"
              data-id="vendor-export-button"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("export")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outlinePrimary" size="sm" data-id="vendor-print-button">
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("print")}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="vendor-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="vendor-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="vendor-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="vendor-list-sort-dropdown"
        />
        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const content = (
    <VendorList
      vendors={vendors?.data ?? []}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      totalItems={totalItems}
      perpage={currentPerpage}
      setPerpage={handleSetPerpage}
      canUpdate={vendorPerms.canUpdate}
      canDelete={vendorPerms.canDelete}
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

      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
