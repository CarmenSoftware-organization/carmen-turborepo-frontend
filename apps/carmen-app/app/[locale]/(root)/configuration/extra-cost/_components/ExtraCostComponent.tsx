"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useExtraCostTypeQuery,
  useCreateExtraCostType,
  useUpdateExtraCostType,
  useDeleteExtraCostType,
} from "@/hooks/use-extra-cost-type";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { FileDown, Plus, Printer } from "lucide-react";
import { useState } from "react";
import ListExtraCost from "./ListExtraCost";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { ExtraCostTypeDto } from "@/dtos/extra-cost-type.dto";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import ExtraCostDialog from "./ExtraCostDialog";
import { useTranslations } from "next-intl";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function ExtraCostComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for extra_cost resource
  const extraCostPerms = configurationPermission.get(permissions, "extra_cost");
  const queryClient = useQueryClient();
  const tCommon = useTranslations("Common");
  const tConfig = useTranslations("Modules.Configuration");
  const tExtraCost = useTranslations("ExtraCost");

  const { search, setSearch, filter, setFilter, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedExtraCost, setSelectedExtraCost] = useState<ExtraCostTypeDto | undefined>(
    undefined
  );

  const { extraCostTypes, isLoading, error } = useExtraCostTypeQuery(token, buCode, {
    search,
    filter,
    sort,
    page: pageNumber,
    perpage: perpageNumber,
  });

  const { mutate: createExtraCost } = useCreateExtraCostType(token, buCode);
  const { mutate: updateExtraCost } = useUpdateExtraCostType(
    token,
    buCode,
    selectedExtraCost?.id ?? ""
  );
  const { mutate: deleteExtraCost } = useDeleteExtraCostType(token, buCode);

  const deleteDialog = useDeleteDialog<ExtraCostTypeDto>(deleteExtraCost, {
    queryKey: ["extra-cost-type", buCode],
    successMessage: tExtraCost("delete_success"),
    errorMessage: tExtraCost("delete_error"),
    logContext: "delete extra cost",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const extraCostData = Array.isArray(extraCostTypes) ? extraCostTypes : extraCostTypes?.data || [];
  const currentPage = extraCostTypes?.paginate?.page ?? 1;
  const totalPages = extraCostTypes?.paginate?.pages ?? 1;
  const totalItems = extraCostTypes?.paginate?.total ?? extraCostData.length;

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

  const handleDialogSubmit = (data: ExtraCostTypeDto) => {
    if (dialogMode === formType.ADD) {
      createExtraCost(data, {
        onSuccess: () => {
          toastSuccess({ message: tExtraCost("create_success") });
          queryClient.invalidateQueries({ queryKey: ["extra-cost-type", buCode] });
          setDialogOpen(false);
          setSelectedExtraCost(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: tExtraCost("create_error") });
          console.error("Failed to create extra cost:", error);
        },
      });
    } else if (dialogMode === formType.EDIT && selectedExtraCost) {
      const updateData = { ...data, id: selectedExtraCost.id };
      updateExtraCost(updateData, {
        onSuccess: () => {
          toastSuccess({ message: tExtraCost("update_success") });
          queryClient.invalidateQueries({ queryKey: ["extra-cost-type", buCode] });
          setDialogOpen(false);
          setSelectedExtraCost(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: tExtraCost("update_error") });
          console.error("Failed to update extra cost:", error);
        },
      });
    }
  };

  const sortFields = [
    {
      key: "name",
      label: tCommon("name"),
    },
    {
      key: "is_active",
      label: tCommon("status"),
    },
  ];

  const title = tConfig("extra_cost");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="extra-cost-list-action-buttons">
      {extraCostPerms.canCreate && (
        <Button size="sm" onClick={handleAdd}>
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Button>
      )}

      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="extra-cost-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size="sm" data-id="extra-cost-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="extra-cost-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        data-id="extra-cost-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
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
      perpage={extraCostTypes?.paginate?.perpage ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      onEdit={handleEdit}
      onToggleStatus={deleteDialog.openDialog}
      canUpdate={extraCostPerms.canUpdate}
      canDelete={extraCostPerms.canDelete}
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
        {...deleteDialog.dialogProps}
        title={tExtraCost("del_extra_cost")}
        description={tExtraCost("del_extra_cost_description")}
      />
    </>
  );
}
