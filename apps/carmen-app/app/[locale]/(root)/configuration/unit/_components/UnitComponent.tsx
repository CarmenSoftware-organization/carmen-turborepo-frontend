"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useDeleteUnit, useUnitMutation, useUnitQuery, useUpdateUnit } from "@/hooks/use-unit";
import { useQueryClient } from "@tanstack/react-query";
import { useURL } from "@/hooks/useURL";
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
import { InternalServerError } from "@/components/error-ui";

export default function UnitComponent() {
  const { token, buCode, permissions } = useAuth();
  const unitPerms = productManagementPermission.get(permissions, "unit");
  const tCommon = useTranslations("Common");
  const tUnit = useTranslations("Unit");
  const queryClient = useQueryClient();
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [statusOpen, setStatusOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<UnitDto | undefined>(undefined);

  const { units, isLoading, error } = useUnitQuery({
    token,
    buCode,
    params: {
      search,
      filter,
      sort,
      page: page ? Number(page) : 1,
      perpage: perpage ? Number(perpage) : 10,
    },
  });

  const { mutate: createUnit } = useUnitMutation(token, buCode);
  const { mutate: updateUnit } = useUpdateUnit(token, buCode, selectedUnit?.id ?? "");
  const { mutate: deleteUnit } = useDeleteUnit(token, buCode);

  if (error) return <InternalServerError />;

  const totalItems = units?.paginate?.total ?? 0;
  const totalPages = units?.paginate?.pages ?? 1;
  const currentPage = units?.paginate?.page ?? 1;
  const currentPerpage = units?.paginate?.perpage ?? 10;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

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

  const handleDelete = (unit: UnitDto) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      deleteUnit(unitToDelete.id, {
        onSuccess: () => {
          toastSuccess({ message: tUnit("delete_success") });
          queryClient.invalidateQueries({ queryKey: ["units"] });
          setDeleteDialogOpen(false);
          setUnitToDelete(undefined);
        },
        onError: (error) => {
          toastError({ message: tUnit("delete_error") });
          console.error("Failed to delete unit:", error);
        },
      });
    }
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
    <div className="action-btn-container" data-id="unit-list-action-buttons">
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
    <div className="filter-container" data-id="unit-list-filters">
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
      onDelete={handleDelete}
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
        open={deleteDialogOpen}
        onOpenChange={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title={tCommon("delete")}
        description={tCommon("del_desc")}
      />
    </>
  );
}
