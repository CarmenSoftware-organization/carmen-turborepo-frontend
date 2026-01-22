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
import { useURL } from "@/hooks/useURL";
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

export default function DeliveryPointComponent() {
  const { token, buCode, permissions } = useAuth();

  const deliveryPointPerms = configurationPermission.get(permissions, "delivery_point");
  const tCommon = useTranslations("Common");
  const tHeader = useTranslations("TableHeader");
  const tDeliveryPoint = useTranslations("DeliveryPoint");
  const queryClient = useQueryClient();

  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");
  const [statusOpen, setStatusOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<
    DeliveryPointUpdateDto | undefined
  >(undefined);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deliveryPointToDelete, setDeliveryPointToDelete] = useState<
    DeliveryPointUpdateDto | undefined
  >(undefined);

  const { deliveryPoints, isLoading } = useDeliveryPointQuery({
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

  const { mutate: createDeliveryPoint } = useDeliveryPointMutation(token, buCode);
  const { mutate: updateDeliveryPoint } = useUpdateDeliveryPoint(token, buCode);
  const { mutate: deleteDeliveryPoint } = useDeleteDeliveryPoint(token, buCode);

  const deliveryPointsData = deliveryPoints?.data ?? [];
  const currentPage = deliveryPoints?.paginate.page ?? 1;
  const totalPages = deliveryPoints?.paginate.pages ?? 1;
  const totalItems = deliveryPoints?.paginate.total ?? deliveryPoints?.data?.length ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

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

  const handleDelete = (data: DeliveryPointUpdateDto) => {
    setDeliveryPointToDelete(data);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deliveryPointToDelete?.id) {
      deleteDeliveryPoint(deliveryPointToDelete.id, {
        onSuccess: () => {
          toastSuccess({ message: tDeliveryPoint("del_success") });
          refetchDeliveryPoints();
          setDeleteDialogOpen(false);
          setDeliveryPointToDelete(undefined);
        },
        onError: () => {
          toastError({ message: tDeliveryPoint("del_error") });
        },
      });
    }
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
    <div className="action-btn-container" data-id="delivery-point-list-action-buttons">
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

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const filters = (
    <div className="filter-container" data-id="delivery-point-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="delivery-point-list-search-input"
      />
      <div className="fxr-c gap-2">
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
      onToggleStatus={handleDelete}
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
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tDeliveryPoint("del_delivery_point")}
        description={tDeliveryPoint("del_delivery_point_description")}
      />
    </>
  );
}
