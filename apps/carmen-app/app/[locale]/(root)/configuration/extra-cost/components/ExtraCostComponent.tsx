"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { boolFilterOptions } from "@/constants/options";
import { useAuth } from "@/context/AuthContext";
import { useExtraCostTypeQuery, useCreateExtraCostType, useUpdateExtraCostType, useDeleteExtraCostType } from "@/hooks/useExtraCostType";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useCallback, useState } from "react";
import ListExtraCost from "./ListExtraCost";
import { parseSortString } from "@/utils/table-sort";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import ExtraCostDialog from "./ExtraCostDialog";

export default function ExtraCostComponent() {
  const { token, tenantId } = useAuth();
  const queryClient = useQueryClient();

  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [statusOpen, setStatusOpen] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedExtraCost, setSelectedExtraCost] = useState<ExtraCostTypeDto | undefined>(undefined);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [extraCostToDelete, setExtraCostToDelete] = useState<ExtraCostTypeDto | undefined>(undefined);

  const [selectedExtraCosts, setSelectedExtraCosts] = useState<string[]>([]);

  const { extraCostTypes, isLoading } = useExtraCostTypeQuery(
    token,
    tenantId,
    {
      search,
      filter,
      sort,
      page: page ? parseInt(page) : 1,
    }
  );

  const { mutate: createExtraCost } = useCreateExtraCostType(token, tenantId);
  const { mutate: updateExtraCost } = useUpdateExtraCostType(token, tenantId, selectedExtraCost?.id ?? "");
  const { mutate: deleteExtraCost } = useDeleteExtraCostType(token, tenantId, extraCostToDelete?.id ?? "");

  const extraCostData = Array.isArray(extraCostTypes) ? extraCostTypes : extraCostTypes?.data || [];
  const currentPage = extraCostTypes?.paginate?.page ?? 1;
  const totalPages = extraCostTypes?.paginate?.pages ?? 1;
  const totalItems = extraCostTypes?.paginate?.total ?? extraCostData.length;

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedExtraCosts(extraCostData.map((ec: ExtraCostTypeDto) => ec.id) ?? []);
    } else {
      setSelectedExtraCosts([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedExtraCosts((prev) => {
      if (prev.includes(id)) {
        return prev.filter(ecId => ecId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage.toString());
  }, [setPage]);

  const handleAdd = () => {
    setDialogMode(formType.ADD);
    setSelectedExtraCost(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (data: ExtraCostTypeDto) => {
    setDialogMode(formType.EDIT);
    setSelectedExtraCost(data);
    setDialogOpen(true);
  };

  const handleDelete = (data: ExtraCostTypeDto) => {
    setExtraCostToDelete(data);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (extraCostToDelete) {
      deleteExtraCost(undefined, {
        onSuccess: () => {
          toastSuccess({ message: 'Delete extra cost successfully' });
          queryClient.invalidateQueries({ queryKey: ["credit-note", tenantId] });
          setDeleteDialogOpen(false);
          setExtraCostToDelete(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: 'Failed to delete extra cost' });
          console.error("Failed to delete extra cost:", error);
        }
      });
    }
  };

  const handleDialogSubmit = (data: ExtraCostTypeDto) => {
    if (dialogMode === formType.ADD) {
      createExtraCost(data, {
        onSuccess: () => {
          toastSuccess({ message: 'Create extra cost successfully' });
          queryClient.invalidateQueries({ queryKey: ["credit-note", tenantId] });
          setDialogOpen(false);
          setSelectedExtraCost(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: 'Failed to create extra cost' });
          console.error("Failed to create extra cost:", error);
        }
      });
    } else if (dialogMode === formType.EDIT && selectedExtraCost) {
      const updateData = { ...data, id: selectedExtraCost.id };
      updateExtraCost(updateData, {
        onSuccess: () => {
          toastSuccess({ message: 'Update extra cost successfully' });
          queryClient.invalidateQueries({ queryKey: ["credit-note", tenantId] });
          setDialogOpen(false);
          setSelectedExtraCost(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: 'Failed to update extra cost' });
          console.error("Failed to update extra cost:", error);
        }
      });
    }
  };

  const sortFields = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "is_active",
      label: "Status",
    },
  ];

  const title = "Extra Cost";

  const actionButtons = (
    <div
      className="action-btn-container"
      data-id="extra-cost-list-action-buttons"
    >
      <Button size="sm" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        Add
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="extra-cost-export-button"
      >
        <FileDown className="h-4 w-4" />
        Export
      </Button>
      <Button
        variant="outlinePrimary"
        size="sm"
        data-id="extra-cost-print-button"
      >
        <Printer className="h-4 w-4" />
        Print
      </Button>
    </div>
  );

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

  const filters = (
    <div className="filter-container" data-id="extra-cost-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder="Search"
        data-id="extra-cost-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          options={boolFilterOptions}
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="extra-cost-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="extra-cost-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListExtraCost
      extraCosts={extraCostData}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onEdit={handleEdit}
      onToggleStatus={handleDelete}
      onSort={handleSort}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
      selectedExtraCosts={selectedExtraCosts}
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
      <ExtraCostDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        extraCost={selectedExtraCost}
        onSubmit={handleDialogSubmit}
        isLoading={isLoading}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
