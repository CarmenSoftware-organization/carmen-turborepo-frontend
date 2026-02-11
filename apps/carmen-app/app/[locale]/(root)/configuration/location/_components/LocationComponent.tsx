"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import { useAuth } from "@/context/AuthContext";
import { useLocationsQuery, useDeleteLocation } from "@/hooks/use-locations";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useTranslations } from "next-intl";
import { FileDown, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListLocations from "./ListLocations";
import { useRouter } from "@/lib/navigation";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";
import { StoreLocationDto } from "@/dtos/location.dto";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function LocationComponent() {
  const tCommon = useTranslations("Common");
  const tStoreLocation = useTranslations("StoreLocation");
  const tHeader = useTranslations("TableHeader");
  const { token, buCode, permissions } = useAuth();
  const router = useRouter();

  const locationPerms = configurationPermission.get(permissions, "store_location");

  const { search, setSearch, filter, setFilter, sort, setSort, page, perpage, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);

  const {
    data: locations,
    isLoading,
    error,
  } = useLocationsQuery({
    token,
    buCode,
    params: {
      search,
      filter,
      sort,
      page,
      perpage,
    },
  });

  const { mutate: deleteLocation } = useDeleteLocation(token, buCode);

  const deleteDialog = useDeleteDialog<StoreLocationDto>(deleteLocation, {
    queryKey: ["locations", buCode],
    successMessage: tStoreLocation("del_success"),
    errorMessage: tStoreLocation("del_error"),
    logContext: "delete location",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const sortFields = [{ key: "name", label: tHeader("name") }];

  const actionButtons = (
    <div className="action-btn-container" data-id="store-location-list-action-buttons">
      <Button
        size="sm"
        data-id="store-location-add-button"
        onClick={() => router.push("/configuration/location/new")}
        disabled={!locationPerms.canCreate}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="store-location-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size="sm" data-id="store-location-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="location-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="location-list-search-input"
      />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="location-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="location-list-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListLocations
      locations={locations?.data ?? []}
      isLoading={isLoading}
      currentPage={locations?.paginate.current_page ?? 1}
      totalPages={locations?.paginate.total_pages ?? 1}
      totalItems={locations?.paginate.total ?? 0}
      perpage={locations?.paginate.perpage ?? 10}
      sort={parseSortString(sort)}
      onSort={setSort}
      onPageChange={handlePageChange}
      onDelete={deleteDialog.openDialog}
      canUpdate={locationPerms.canUpdate}
      canDelete={locationPerms.canDelete}
      setPerpage={handleSetPerpage}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title={tStoreLocation("title")}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
        data-id="location-list-template"
      />
      <DeleteConfirmDialog
        {...deleteDialog.dialogProps}
        title="Delete Location"
        description="Are you sure you want to delete this location? This action cannot be undone."
      />
    </>
  );
}
