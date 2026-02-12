"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRoleQuery, useDeleteRole, roleKeyList } from "@/hooks/use-role";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import ListRole from "./ListRole";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { RoleDto } from "@/dtos/role.dto";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function RoleComponent() {
  const { token, buCode } = useAuth();
  const router = useRouter();

  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tRole = useTranslations("Role");

  const { search, setSearch, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();

  const { roles, isLoading, paginate, error } = useRoleQuery({
    token,
    buCode,
    params: {
      search,
      sort,
      page: pageNumber,
      perpage: perpageNumber,
    },
  });

  const { mutate: deleteRole } = useDeleteRole(token, buCode);

  const deleteDialog = useDeleteDialog<RoleDto>(deleteRole, {
    queryKey: [roleKeyList, buCode],
    successMessage: tRole("del_success"),
    errorMessage: tRole("del_error"),
    logContext: "delete role",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const currentPage = paginate?.page ?? 1;
  const totalPages = paginate?.pages ?? 1;
  const totalItems = paginate?.total ?? 0;
  const perpageItems = paginate?.perpage ?? 10;

  const handleAdd = () => {
    router.push("/system-administration/role/new");
  };

  const sortFields = [
    {
      key: "name",
      label: tHeader("name"),
    },
  ];

  const title = tRole("title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="role-list-action-buttons">
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

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="role-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="role-list-search-input"
      />
      <div className="flex items-center gap-2">
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
      roles={roles ?? []}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onDelete={deleteDialog.openDialog}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      perpage={perpageItems}
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
        {...deleteDialog.dialogProps}
        title={tRole("del_role")}
        description={tRole("del_role_description")}
      />
    </>
  );
}
