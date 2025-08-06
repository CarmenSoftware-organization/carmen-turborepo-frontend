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
import { useState, useEffect, useMemo, useCallback } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListLocations from "./ListLocations";
import { Link } from "@/lib/navigation";
import SignInDialog from "@/components/SignInDialog";
import { SortConfig, SortDirection } from "@/utils/table-sort";

export default function LocationComponent() {
  const tCommon = useTranslations("Common");
  const tStoreLocation = useTranslations("StoreLocation");
  const tHeader = useTranslations("TableHeader");
  const { token, tenantId } = useAuth();
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [statusOpen, setStatusOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

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
      perpage: 10,
    },
  });

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedLocations(locations?.data.map((location: any) => location.id) ?? []);
    } else {
      setSelectedLocations([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedLocations((prev) => {
      if (prev.includes(id)) {
        return prev.filter(locationId => locationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  useEffect(() => {
    if (
      (error as { response?: { status?: number } })?.response?.status === 401
    ) {
      setLoginDialogOpen(true);
    }
  }, [error, setLoginDialogOpen]);

  const sortFields = [{ key: "name", label: tHeader("name") }];


  const handleSort = useCallback((field: string) => {
    if (!sort) {
      setSort(`${field}:asc`);
    } else {
      const [currentField, currentDirection] = sort.split(':');

      if (currentField === field) {
        const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        setSort(`${field}:${newDirection}`);
      } else {
        setSort(`${field}:asc`);
      }
      setPage("1");
    }
  }, [setSort, sort, setPage]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

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
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="store-location-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outlinePrimary" size="sm" data-id="store-location-print-button">
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

  const parsedSort = useMemo((): SortConfig | undefined => {
    if (!sort) return undefined;

    const parts = sort.split(':');
    if (parts.length !== 2) return undefined;

    return {
      field: parts[0],
      direction: parts[1] as SortDirection
    };
  }, [sort]);

  const content = (
    <ListLocations
      locations={locations?.data ?? []}
      isLoading={isLoading}
      sort={parsedSort}
      onSort={handleSort}
      onPageChange={handlePageChange}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
      selectedLocations={selectedLocations}
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
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
