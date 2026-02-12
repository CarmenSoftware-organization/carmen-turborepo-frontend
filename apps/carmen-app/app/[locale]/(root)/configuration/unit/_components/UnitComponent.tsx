"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDeleteUnit, useUnitMutation, useUnitQuery, useUpdateUnit } from "@/hooks/use-unit";
import { useQueryClient } from "@tanstack/react-query";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ListUnit from "./ListUnit";
import { UnitDto, CreateUnitDto, UpdateUnitDto } from "@/dtos/unit.dto";
import UnitDialog from "@/components/shared/UnitDialog";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { productManagementPermission } from "@/lib/permission";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function UnitComponent() {
  const { token, buCode, permissions } = useAuth();
  const unitPerms = productManagementPermission.get(permissions, "unit");
  const tCommon = useTranslations("Common");
  const tUnit = useTranslations("Unit");
  const queryClient = useQueryClient();
  const { search, setSearch, filter, setFilter, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>(undefined);

  const { units, isLoading, error } = useUnitQuery({
    token,
    buCode,
    params: {
      search,
      filter,
      sort,
      page: pageNumber,
      perpage: perpageNumber,
    },
  });

  const { mutate: createUnit } = useUnitMutation(token, buCode);
  const { mutate: updateUnit } = useUpdateUnit(token, buCode, selectedUnit?.id ?? "");
  const { mutate: deleteUnit } = useDeleteUnit(token, buCode);

  const deleteDialog = useDeleteDialog<UnitDto>(deleteUnit, {
    queryKey: ["units"],
    successMessage: tUnit("delete_success"),
    errorMessage: tUnit("delete_error"),
    logContext: "delete unit",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const totalItems = units?.paginate?.total ?? 0;
  const totalPages = units?.paginate?.pages ?? 1;
  const currentPage = units?.paginate?.page ?? 1;
  const currentPerpage = units?.paginate?.perpage ?? 10;

  const handleAdd = () => {
    setDialogMode(formType.ADD);
    setSelectedUnit(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (unit: UnitDto) => {
    setDialogMode(formType.EDIT);
    setSelectedUnit(unit);
    setDialogOpen(true);
  };

  const handleDialogSubmit = (data: CreateUnitDto) => {
    if (dialogMode === formType.ADD) {
      createUnit(data, {
        onSuccess: () => {
          toastSuccess({ message: tUnit("add_success") });
          // Invalidate all "units" queries to refetch data
          queryClient.invalidateQueries({ queryKey: ["units"] });
          setDialogOpen(false);
        },
        onError: (error) => {
          toastError({ message: tUnit("add_error") });
          console.error("Failed to create unit:", error);
        },
      });
    } else if (dialogMode === formType.EDIT && selectedUnit) {
      const updateData: UpdateUnitDto = {
        ...data,
        id: selectedUnit.id,
        created_at: selectedUnit.created_at,
        updated_at: selectedUnit.updated_at,
      };

      updateUnit(updateData, {
        onSuccess: () => {
          toastSuccess({ message: tUnit("update_success") });
          queryClient.invalidateQueries({ queryKey: ["units"] });
          setDialogOpen(false);
        },
        onError: (error) => {
          toastError({ message: tUnit("update_error") });
          console.error("Failed to update unit:", error);
        },
      });
    }
  };

  const sortFields = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ];

  const title = tUnit("title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="unit-list-action-buttons">
      <Button size="sm" onClick={handleAdd} disabled={!unitPerms.canCreate}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="unit-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>
      <Button variant="outlinePrimary" size="sm" data-id="unit-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="unit-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="unit-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="product-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="product-list-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListUnit
      units={units?.data ?? []}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      onEdit={handleEdit}
      onDelete={deleteDialog.openDialog}
      totalItems={totalItems}
      sort={parseSortString(sort)}
      onSort={setSort}
      perpage={currentPerpage}
      setPerpage={handleSetPerpage}
      canUpdate={unitPerms.canUpdate}
      canDelete={unitPerms.canDelete}
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
      <UnitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        unit={selectedUnit}
        onSubmit={handleDialogSubmit}
      />
      <DeleteConfirmDialog
        {...deleteDialog.dialogProps}
        title={tCommon("delete")}
        description={tCommon("del_desc")}
      />
    </>
  );
}
