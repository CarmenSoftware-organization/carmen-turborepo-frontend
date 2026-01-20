"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRoleQuery, useDeleteRole } from "@/hooks/use-role";
import { useURL } from "@/hooks/useURL";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ListRole from "./ListRole";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { RoleDto } from "@/dtos/role.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

export default function RoleComponent() {
  const { token, buCode } = useAuth();
  const router = useRouter();

  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tRole = useTranslations("Role");
  const queryClient = useQueryClient();

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<RoleDto | undefined>(undefined);

  const { roles, isLoading } = useRoleQuery({
    token,
    buCode,
    params: {
      search,
      sort,
      page: page ? Number(page) : 1,
      perpage: perpage ? Number(perpage) : 10,
    },
  });

  const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole(token, buCode);

  const rolesData = roles?.data ?? [];
  const currentPage = roles?.paginate?.page ?? 1;
  const totalPages = roles?.paginate?.pages ?? 1;
  const totalItems = roles?.paginate?.total ?? roles?.data?.length ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleAdd = () => {
    router.push("/system-administration/role/new");
  };

  const handleDelete = (data: RoleDto) => {
    setRoleToDelete(data);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (roleToDelete?.id) {
      deleteRole(roleToDelete.id, {
        onSuccess: () => {
          toastSuccess({ message: tRole("del_success") });
          queryClient.invalidateQueries({ queryKey: ["roles", buCode] });
          setDeleteDialogOpen(false);
          setRoleToDelete(undefined);
        },
        onError: () => {
          toastError({ message: tRole("del_error") });
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setRoleToDelete(undefined);
  };

  const sortFields = [
    {
      key: "name",
      label: tHeader("name"),
    },
  ];

  const title = tRole("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="role-list-action-buttons">
      <Button size={"sm"} onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button variant="outlinePrimary" className="group" size="sm" data-id="role-export-button">
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size="sm" data-id="role-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const filters = (
    <div className="filter-container" data-id="role-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="role-list-search-input"
      />
      <div className="fxr-c gap-2">
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="role-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListRole
      roles={rolesData}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onDelete={handleDelete}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      perpage={roles?.paginate?.perpage ?? 10}
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
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={tRole("del_role")}
        description={tRole("del_role_description")}
        isLoading={isDeleting}
      />
    </>
  );
}
