"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useDeliveryPointMutation,
  useDeliveryPointQuery,
  useUpdateDeliveryPoint,
  useDeleteDeliveryPoint,
  queryKeyDeliveryPoint,
} from "@/hooks/use-delivery-point";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import ListDeliveryPoint from "./ListDeliveryPoint";
import { parseSortString } from "@/utils/table";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { DeliveryPointCreateDto, DeliveryPointUpdateDto } from "@/dtos/delivery-point.dto";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import DeliveryPointDialog from "@/components/shared/DeliveryPointDialog";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function DeliveryPointComponent() {
  const { token, buCode, permissions } = useAuth();

  const deliveryPointPerms = configurationPermission.get(permissions, "delivery_point");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tDeliveryPoint = useTranslations("DeliveryPoint");
  const queryClient = useQueryClient();

  const { search, setSearch, filter, setFilter, sort, setSort, pageNumber, perpageNumber, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<
    DeliveryPointUpdateDto | undefined
  >(undefined);

  const { deliveryPoints, isLoading, error } = useDeliveryPointQuery({
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

  const { mutate: createDeliveryPoint } = useDeliveryPointMutation(token, buCode);
  const { mutate: updateDeliveryPoint } = useUpdateDeliveryPoint(token, buCode);
  const { mutate: deleteDeliveryPoint } = useDeleteDeliveryPoint(token, buCode);

  const deleteDialog = useDeleteDialog<DeliveryPointUpdateDto>(deleteDeliveryPoint, {
    queryKey: [queryKeyDeliveryPoint],
    successMessage: tDeliveryPoint("del_success"),
    errorMessage: tDeliveryPoint("del_error"),
    logContext: "delete delivery point",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const deliveryPointsData = deliveryPoints?.data ?? [];
  const currentPage = deliveryPoints?.paginate.page ?? 1;
  const totalPages = deliveryPoints?.paginate.pages ?? 1;
  const totalItems = deliveryPoints?.paginate.total ?? deliveryPoints?.data?.length ?? 0;

  const handleAdd = () => {
    setDialogMode(formType.ADD);
    setSelectedDeliveryPoint(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (data: DeliveryPointUpdateDto) => {
    setDialogMode(formType.EDIT);
    setSelectedDeliveryPoint(data);
    setDialogOpen(true);
  };

  const refetchDeliveryPoints = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKeyDeliveryPoint],
      exact: false,
    });
  };

  const handleDialogSubmit = (data: DeliveryPointUpdateDto | DeliveryPointCreateDto) => {
    if (dialogMode === formType.ADD) {
      createDeliveryPoint(data, {
        onSuccess: () => {
          toastSuccess({ message: tDeliveryPoint("add_success") });
          refetchDeliveryPoints();
          setDialogOpen(false);
          setSelectedDeliveryPoint(undefined);
        },
        onError: () => {
          toastError({ message: tDeliveryPoint("add_error") });
        },
      });
    } else if (dialogMode === formType.EDIT && selectedDeliveryPoint) {
      const updateData = { ...data, id: selectedDeliveryPoint.id } as DeliveryPointUpdateDto;

      updateDeliveryPoint(updateData, {
        onSuccess: () => {
          toastSuccess({ message: tDeliveryPoint("edit_success") });
          refetchDeliveryPoints();
          setDialogOpen(false);
          setSelectedDeliveryPoint(undefined);
        },
        onError: () => {
          toastError({ message: tDeliveryPoint("edit_error") });
        },
      });
    }
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

  const title = tDeliveryPoint("title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="delivery-point-list-action-buttons">
      <Button size={"sm"} onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size="sm"
        data-id="delivery-point-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size="sm" data-id="delivery-point-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="delivery-point-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="delivery-point-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="delivery-point-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="delivery-point-sort-dropdown"
        />
      </div>
    </div>
  );

  const content = (
    <ListDeliveryPoint
      deliveryPoints={deliveryPointsData}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onEdit={handleEdit}
      onToggleStatus={deleteDialog.openDialog}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      perpage={deliveryPoints?.paginate.perpage}
      canUpdate={deliveryPointPerms.canUpdate}
      canDelete={deliveryPointPerms.canDelete}
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
      <DeliveryPointDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        mode={dialogMode}
        deliveryPoint={selectedDeliveryPoint}
        onSubmit={handleDialogSubmit}
        isLoading={isLoading}
      />
      <DeleteConfirmDialog
        {...deleteDialog.dialogProps}
        title={tDeliveryPoint("del_delivery_point")}
        description={tDeliveryPoint("del_delivery_point_description")}
      />
    </>
  );
}
