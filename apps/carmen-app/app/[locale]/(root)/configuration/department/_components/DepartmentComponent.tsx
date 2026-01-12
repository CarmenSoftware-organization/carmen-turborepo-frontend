"use client";

import SignInDialog from "@/components/SignInDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDepartmentsQuery, useDepartmentDeleteMutation } from "@/hooks/use-departments";
import { useURL } from "@/hooks/useURL";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer, List, Grid } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import DepartmentList from "./DepartmentList";
import DepartmentGrid from "./DepartmentGrid";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";
import { DepartmentGetListDto } from "@/dtos/department.dto";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";

import { VIEW } from "@/constants/enum";

export default function DepartmentComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for department resource
  const departmentPerms = configurationPermission.get(permissions, "department");
  const queryClient = useQueryClient();

  const tDepartment = useTranslations("Department");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const router = useRouter();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentGetListDto | undefined>(
    undefined
  );
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { departments, isLoading, isUnauthorized } = useDepartmentsQuery(token, buCode, {
    search,
    page,
    sort,
    filter,
    perpage,
  });

  const { mutate: deleteDepartment, isPending: isDeleting } = useDepartmentDeleteMutation(
    token,
    buCode
  );

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

  const handleDelete = (department: DepartmentGetListDto) => {
    setDepartmentToDelete(department);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (departmentToDelete?.id) {
      deleteDepartment(departmentToDelete.id, {
        onSuccess: () => {
          toastSuccess({ message: tDepartment("delete_success") });
          queryClient.invalidateQueries({ queryKey: ["departments", buCode] });
          setDeleteDialogOpen(false);
          setDepartmentToDelete(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: tDepartment("delete_error") });
          console.error("Failed to delete department:", error);
          setDeleteDialogOpen(false);
          setDepartmentToDelete(undefined);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setDepartmentToDelete(undefined);
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
    <div className="action-btn-container" data-id="department-list-action-buttons">
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
          onDelete={handleDelete}
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
            onDelete={handleDelete}
            canUpdate={departmentPerms.canUpdate}
            canDelete={departmentPerms.canDelete}
          />
        ) : (
          <DepartmentGrid
            departments={departments?.data ?? []}
            isLoading={isLoading}
            onDelete={handleDelete}
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
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={tDepartment("confirm_delete")}
        description={tDepartment("confirm_delete_description", {
          name: departmentToDelete?.name || "",
        })}
        isLoading={isDeleting}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
