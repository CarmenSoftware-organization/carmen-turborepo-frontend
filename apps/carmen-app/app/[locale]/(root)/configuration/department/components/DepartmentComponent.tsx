"use client";

import SignInDialog from "@/components/SignInDialog";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDepartmentsQuery } from "@/hooks/useDepartments";
import { useURL } from "@/hooks/useURL";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DepartmentList from "./DepartmentList";
import { parseSortString } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";

export default function DepartmentComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for department resource
  const departmentPerms = configurationPermission.get(permissions, "department");

  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const router = useRouter();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const { departments, isLoading, isUnauthorized } = useDepartmentsQuery(token, buCode, {
    search,
    page,
    sort,
    filter,
    perpage
  });

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const currentPage = departments?.paginate.page ?? 1;
  const totalPages = departments?.paginate.pages ?? 1;
  const totalItems = departments?.paginate.total ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleAdd = () => {
    router.push("/configuration/department/new");
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const sortFields = [
    {
      key: "name",
      label: tHeader("name"),
    },
    {
      key: "is_active",
      label: tHeader("status"),
    },
  ];

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="department-list-action-buttons"
    >
      <Button
        size="sm"
        onClick={handleAdd}
        data-id="department-add-button"
        disabled={!departmentPerms.canCreate}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="department-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
        size="sm"
        data-id="department-print-button"
      >
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
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
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
      totalItems={totalItems}
      perpage={departments?.paginate.perpage ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      canUpdate={departmentPerms.canUpdate}
      canDelete={departmentPerms.canDelete}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title={tDepartment("title")}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
