"use client";

import SignInDialog from "@/components/SignInDialog";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { boolFilterOptions } from "@/constants/options";
import { useAuth } from "@/context/AuthContext";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { useURL } from "@/hooks/useURL";
import { Link } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useState } from "react";
import DepartmentList from "./DepartmentList";
import { SortConfig, SortDirection } from "@/utils/table-sort";

export default function DepartmentComponent() {
  const { token, tenantId } = useAuth();
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");

  const { departments, isLoading, isUnauthorized } = useDepartmentsQuery(token, tenantId, {
    search,
    page,
    sort,
    filter,
  });
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSelectedDepartments(departments?.data.map((dept: any) => dept.id) ?? []);
    } else {
      setSelectedDepartments([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedDepartments((prev) => {
      if (prev.includes(id)) {
        return prev.filter(deptId => deptId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const currentPage = departments?.paginate.page ?? 1;
  const totalPages = departments?.paginate.pages ?? 1;

  const parsedSort = useMemo((): SortConfig | undefined => {
    if (!sort) return undefined;

    const parts = sort.split(":");

    if (parts.length === 1) {
      return {
        field: parts[0],
        direction: 'asc',
      };
    }
    if (parts.length === 2) {
      return {
        field: parts[0],
        direction: parts[1] as SortDirection,
      };
    }

    return undefined;
  }, [sort]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

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
    }
  }, [setSort, sort]);

  if (isUnauthorized) {
    return <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />;
  }

  const sortFields = [
    { key: "name", label: tCommon("name") },
    { key: "description", label: tCommon("description") },
    { key: "is_active", label: tCommon("status") },
  ];

  const title = tDepartment("title");

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="department-list-action-buttons"
    >
      <Button size={"sm"} asChild>
        <Link href="/configuration/department/new">
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Link>
      </Button>
      <Button variant="outline" size={"sm"} data-id="department-export-button">
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="department-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="department-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="department-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          options={boolFilterOptions}
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="department-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="department-list-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <DepartmentList
      departments={departments?.data ?? []}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      sort={parsedSort}
      onSort={handleSort}
      selectedDepartments={selectedDepartments}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
    />
  )

  return (
    <DataDisplayTemplate
      content={content}
      title={title}
      actionButtons={actionButtons}
      filters={filters}
    />
  );
}