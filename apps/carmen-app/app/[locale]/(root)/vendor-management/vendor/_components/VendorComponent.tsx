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
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useEffect, useState } from "react";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { vendorManagementPermission } from "@/lib/permission";

const sortFields = [{ key: "name", label: "Name" }];

export default function VendorComponent() {
  const { token, buCode, permissions } = useAuth();
  const router = useRouter();
  // Get permissions for vendor resource
  const vendorPerms = vendorManagementPermission.get(permissions, "vendor");

  const tCommon = useTranslations("Common");
  const tVendor = useTranslations("Vendor");
  const tAction = useTranslations("Action");
  const { search, setSearch, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { vendors, isLoading, isUnauthorized } = useVendor(token, buCode, {
    search,
    sort,
    page: pageNumber,
    perpage: perpageNumber,
  });

  const totalItems = vendors?.paginate?.total ?? 0;
  const totalPages = vendors?.paginate?.pages ?? 1;
  const currentPage = vendors?.paginate?.page ?? 1;
  const currentPerpage = vendors?.paginate?.perpage ?? 10;

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const title = tVendor("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="vendor-action-buttons">
      <Button
        size={"sm"}
        disabled={!vendorPerms.canCreate}
        onClick={() => {
          router.push("/vendor-management/vendor/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button variant="outlinePrimary" className="group" size="sm" data-id="vendor-export-button">
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size="sm" data-id="vendor-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
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
          {tCommon("filter")}
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
