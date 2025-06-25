"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import { useAuth } from "@/context/AuthContext";
import { useLocationsQuery } from "@/hooks/useLocation";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { FileDown, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { boolFilterOptions } from "@/constants/options";
import { useState, useEffect } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListLocations from "./ListLocations";
import { Link } from "@/lib/navigation";
import SignInDialog from "@/components/SignInDialog";

export default function LocationComponent() {
  const tCommon = useTranslations("Common");
  const tStoreLocation = useTranslations("StoreLocation");
  const tHeader = useTranslations("TableHeader");
  const { token, tenantId } = useAuth();
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page] = useURL("page");
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const {
    data: locations,
    isLoading,
    error,
  } = useLocationsQuery({
    token,
    tenantId,
    params: {
      search,
      filter,
      sort,
      page,
      perPage: "10",
    },
  });

  useEffect(() => {
    if (
      (error as { response?: { status?: number } })?.response?.status === 401
    ) {
      setLoginDialogOpen(true);
    }
  }, [error, setLoginDialogOpen]);

  const sortFields = [{ key: "name", label: tHeader("name") }];

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="store-location-list-action-buttons"
    >
      <Button size="sm" asChild>
        <Link href="/configuration/location/new">
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Link>
      </Button>
      <Button
        variant="outline"
        className="group"
        size="sm"
        data-id="store-location-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size="sm" data-id="store-location-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
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
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          options={boolFilterOptions}
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
    <ListLocations locations={locations?.data ?? []} isLoading={isLoading} />
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
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
