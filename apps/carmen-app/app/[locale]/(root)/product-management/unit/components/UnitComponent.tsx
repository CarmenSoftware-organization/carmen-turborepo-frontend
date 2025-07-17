"use client";

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { boolFilterOptions } from "@/constants/options";
import { useAuth } from "@/context/AuthContext";
import { useDeleteUnit, useUnitMutation, useUnitQuery, useUpdateUnit } from "@/hooks/use-unit";
import { useQueryClient } from "@tanstack/react-query";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import ListUnit from "./ListUnit";
import { UnitDto } from "@/dtos/unit.dto";
import UnitDialog from "@/components/shared/UnitDialog";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

export default function UnitComponent() {
  const { token, tenantId } = useAuth();
  const tCommon = useTranslations("Common");
  const tUnit = useTranslations("Unit");
  const queryClient = useQueryClient();
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [statusOpen, setStatusOpen] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedUnit, setSelectedUnit] = useState<UnitDto | undefined>(undefined);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<UnitDto | undefined>(undefined);

  const { units, isLoading } = useUnitQuery({
    token,
    tenantId,
    params: {
      search,
      filter,
      sort,
      page,
    }
  });

  const { mutate: createUnit } = useUnitMutation(token, tenantId);
  const { mutate: updateUnit } = useUpdateUnit(token, tenantId, selectedUnit?.id ?? "");
  const { mutate: deleteUnit } = useDeleteUnit(token, tenantId, selectedUnit?.id ?? "");

  const currentPage = units?.paginate.page ?? 1;
  const totalPages = units?.paginate.pages ?? 1;

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

  const handleAdd = () => {
    setDialogMode(formType.ADD);
    setSelectedUnit(undefined);
    setDialogOpen(true);
  }

  const handleEdit = (unit: UnitDto) => {
    setDialogMode(formType.EDIT);
    setSelectedUnit(unit);
    setDialogOpen(true);
  }

  const handleDelete = (unit: UnitDto) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  }

  const handleConfirmDelete = () => {
    if (unitToDelete) {
      deleteUnit(undefined, {
        onSuccess: () => {
          toastSuccess({ message: 'Delete unit successfully' });
          queryClient.invalidateQueries({ queryKey: ["units", tenantId] });
          setDeleteDialogOpen(false);
          setUnitToDelete(undefined);
        },
        onError: (error) => {
          toastError({ message: 'Failed to delete unit' });
          console.error("Failed to delete unit:", error);
        }
      });
    }
  }

  const handleDialogSubmit = (data: any) => {
    if (dialogMode === formType.ADD) {
      createUnit(data, {
        onSuccess: () => {
          toastSuccess({ message: 'Create unit successfully' });
          queryClient.invalidateQueries({ queryKey: ["units", tenantId] });
        },
        onError: (error) => {
          console.error("Failed to create unit:", error);
        }
      });
    } else if (dialogMode === formType.EDIT && selectedUnit) {
      const updateData = { ...data, id: selectedUnit.id };
      updateUnit(updateData, {
        onSuccess: () => {
          toastSuccess({ message: 'Update unit successfully' });
          queryClient.invalidateQueries({ queryKey: ["units", tenantId] });
        },
        onError: (error) => {
          toastError({ message: 'Failed to create unit' });
          console.error("Failed to update unit:", error);
        }
      });
    }
  }

  const sortFields = [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ];

  const title = tUnit("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="unit-list-action-buttons">
      <Button size={"sm"} onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="delivery-point-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button
        variant="outline"
        size={"sm"}
        data-id="delivery-point-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
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
          options={boolFilterOptions}
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
    />
  )

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
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}