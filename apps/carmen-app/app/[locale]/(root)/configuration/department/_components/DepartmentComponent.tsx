"use client";

import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDepartmentsQuery, useDepartmentDeleteMutation } from "@/hooks/use-departments";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer, List, Grid } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import DepartmentList from "./DepartmentList";
import DepartmentGrid from "./DepartmentGrid";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";

import { VIEW } from "@/constants/enum";
import { DepartmentListItemDto } from "@/dtos/department.dto";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function DepartmentComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for department resource
  const departmentPerms = configurationPermission.get(permissions, "department");
  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const router = useRouter();
  const { search, setSearch, filter, setFilter, sort, setSort, page, perpage, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { departments, isLoading, error } = useDepartmentsQuery(token, buCode, {
    search,
    page,
    sort,
    filter,
    perpage,
  });

  const { mutate: deleteDepartment } = useDepartmentDeleteMutation(token, buCode);

  const deleteDialog = useDeleteDialog<DepartmentListItemDto>(deleteDepartment, {
    queryKey: ["departments", buCode],
    successMessage: tDepartment("delete_success"),
    errorMessage: tDepartment("delete_error"),
    logContext: "delete department",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const currentPage = departments?.paginate.page ?? 1;
  const totalPages = departments?.paginate.pages ?? 1;
  const totalItems = departments?.paginate.total ?? 0;

  const handleAdd = () => {
    router.push("/configuration/department/new");
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
    <div className="flex flex-col md:flex-row gap-2" data-id="department-list-action-buttons">
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
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size="sm" data-id="department-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="department-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="department-list-search-input"
      />
      <div className="flex items-center gap-2">
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
        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <Button
              variant={view === VIEW.LIST ? "default" : "outlinePrimary"}
              size="sm"
              onClick={() => setView(VIEW.LIST)}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
              {tCommon("list_view")}
            </Button>

            <Button
              variant={view === VIEW.GRID ? "default" : "outlinePrimary"}
              size="sm"
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
  );

  const content = (
    <>
      <div className="block lg:hidden">
        <DepartmentGrid
          departments={departments?.data ?? []}
          isLoading={isLoading}
          onDelete={deleteDialog.openDialog}
          canUpdate={departmentPerms.canUpdate}
          canDelete={departmentPerms.canDelete}
        />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
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
            onDelete={deleteDialog.openDialog}
            canUpdate={departmentPerms.canUpdate}
            canDelete={departmentPerms.canDelete}
          />
        ) : (
          <DepartmentGrid
            departments={departments?.data ?? []}
            isLoading={isLoading}
            onDelete={deleteDialog.openDialog}
            canUpdate={departmentPerms.canUpdate}
            canDelete={departmentPerms.canDelete}
          />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        title={tDepartment("title")}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <DeleteConfirmDialog
        {...deleteDialog.dialogProps}
        title={tDepartment("confirm_delete")}
        description={tDepartment("confirm_delete_description", {
          name: deleteDialog.entityToDelete?.name || "",
        })}
      />
    </>
  );
}
