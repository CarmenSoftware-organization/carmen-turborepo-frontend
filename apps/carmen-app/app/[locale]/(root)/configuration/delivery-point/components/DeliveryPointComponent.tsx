"use client";

import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useDeliveryPointMutation,
  useDeliveryPointQuery,
} from "@/hooks/use-delivery-point";
import { backendApi } from "@/lib/backend-api";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import ListDeliveryPoint from "./ListDeliveryPoint";
import { parseSortString } from "@/utils/table-sort";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import {
  DeliveryPointCreateDto,
  DeliveryPointUpdateDto,
} from "@/dtos/delivery-point.dto";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQueryClient } from "@tanstack/react-query";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import DeliveryPointDialog from "@/components/shared/DeliveryPointDialog";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function DeliveryPointComponent() {
  const { token, buCode } = useAuth();
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

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<formType>(formType.ADD);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState<
    DeliveryPointUpdateDto | undefined
  >(undefined);

  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deliveryPointToDelete, setDeliveryPointToDelete] = useState<
    DeliveryPointUpdateDto | undefined
  >(undefined);

  const [selectedDeliveryPoints, setSelectedDeliveryPoints] = useState<
    string[]
  >([]);

  const { deliveryPoints, isLoading } = useDeliveryPointQuery({
    token,
    buCode,
    params: {
      search,
      filter,
      sort,
      page: page ? parseInt(page) : 1,
      perpage: perpage ? parseInt(perpage) : 10,
    },
  });

  const { mutate: createDeliveryPoint } = useDeliveryPointMutation(
    token,
    buCode,
  );

  const deliveryPointsData = deliveryPoints?.data ?? [];
  const currentPage = deliveryPoints?.paginate.page ?? 1;
  const totalPages = deliveryPoints?.paginate.pages ?? 1;
  const totalItems =
    deliveryPoints?.paginate.total ?? deliveryPoints?.data?.length ?? 0;

  const handleSelectAll = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedDeliveryPoints(
        deliveryPoints?.data.map((dept: DeliveryPointUpdateDto) => dept.id) ?? [],
      );
    } else {
      setSelectedDeliveryPoints([]);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedDeliveryPoints((prev) => {
      if (prev.includes(id)) {
        return prev.filter((dpId) => dpId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage.toString());
    },
    [setPage],
  );

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

  const handleConfirmDelete = async () => {
    if (deliveryPointToDelete?.id) {
      try {
        const API_URL = `${backendApi}/api/config/${buCode}/delivery-point/${deliveryPointToDelete.id}`;
        const response = await fetch(API_URL, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "bu-code": buCode,
          },
        });

        if (response.ok) {
          toastSuccess({ message: "Delete delivery point successfully" });
          const currentParams = {
            search,
            filter,
            sort,
            page: page ? parseInt(page) : 1,
            perpage: perpage ? parseInt(perpage) : 10,
          };
          queryClient.invalidateQueries({
            queryKey: ["delivery-point", currentParams],
          });
          queryClient.refetchQueries({
            queryKey: ["delivery-point", currentParams],
          });
          setDeleteDialogOpen(false);
          setDeliveryPointToDelete(undefined);
        } else {
          throw new Error("Failed to delete");
        }
      } catch (error) {
        toastError({ message: "Failed to delete delivery point" });
        console.error("Failed to delete delivery point:", error);
      }
    }
  };

  const handleDialogSubmit = (
    data: DeliveryPointUpdateDto | DeliveryPointCreateDto,
  ) => {
    if (dialogMode === formType.ADD) {
      createDeliveryPoint(data, {
        onSuccess: () => {
          toastSuccess({ message: "Create delivery point successfully" });
          const currentParams = {
            search,
            filter,
            sort,
            page: page ? parseInt(page) : 1,
            perpage: perpage ? parseInt(perpage) : 10,
          };
          queryClient.invalidateQueries({
            queryKey: ["delivery-point", currentParams],
          });
          queryClient.refetchQueries({
            queryKey: ["delivery-point", currentParams],
          });
          setDialogOpen(false);
          setSelectedDeliveryPoint(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: "Failed to create delivery point" });
          console.error("Failed to create delivery point:", error);
        },
      });
    } else if (dialogMode === formType.EDIT && selectedDeliveryPoint) {
      const updateData = { ...data, id: selectedDeliveryPoint.id };

      // Use direct API call instead of hook
      const updateDeliveryPoint = async () => {
        try {
          const API_URL = `${backendApi}/api/config/${buCode}/delivery-point/${selectedDeliveryPoint.id}`;
          const response = await fetch(API_URL, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "bu-code": buCode,
            },
            body: JSON.stringify(updateData),
          });

          if (response.ok) {
            const updatedData = await response.json();
            toastSuccess({ message: "Update delivery point successfully" });

            // Get current query params for proper cache key
            const currentParams = {
              search,
              filter,
              sort,
              page: page ? parseInt(page) : 1,
              perpage: perpage ? parseInt(perpage) : 10,
            };

            // Update cache with exact query key used by the query
            queryClient.setQueryData(
              ["delivery-point", currentParams],
              (oldData: unknown) => {
                const data = oldData as { data?: DeliveryPointUpdateDto[] };
                if (data?.data) {
                  const updatedList = data.data.map((item: DeliveryPointUpdateDto) => {
                    if (item.id === selectedDeliveryPoint.id) {
                      return { ...item, ...updatedData };
                    }
                    return item;
                  });
                  const newData = { ...data, data: updatedList };
                  console.log("New cache data:", newData);
                  return newData;
                }
                return oldData;
              },
            );

            // Force refetch to ensure consistency
            await queryClient.refetchQueries({
              queryKey: ["delivery-point"],
              exact: false,
            });

            setDialogOpen(false);
            setSelectedDeliveryPoint(undefined);
          } else {
            throw new Error("Failed to update");
          }
        } catch (error) {
          toastError({ message: "Failed to update delivery point" });
          console.error("Failed to update delivery point:", error);
        }
      };

      updateDeliveryPoint();
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
    <div
      className="action-btn-container"
      data-id="delivery-point-list-action-buttons"
    >
      <Button size="sm" onClick={handleAdd}>
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
        {tCommon("export")}
      </Button>
      <Button
        variant="outlinePrimary"
        size="sm"
        data-id="delivery-point-print-button"
      >
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const handleSort = useCallback(
    (field: string) => {
      if (!sort) {
        setSort(`${field}:asc`);
      } else {
        const [currentField, currentDirection] = sort.split(":");

        if (currentField === field) {
          const newDirection = currentDirection === "asc" ? "desc" : "asc";
          setSort(`${field}:${newDirection}`);
        } else {
          setSort(`${field}:asc`);
        }
        setPage("1");
      }
    },
    [setSort, sort, setPage],
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
      onSort={handleSort}
      onSelectAll={handleSelectAll}
      onSelect={handleSelect}
      selectedDeliveryPoints={selectedDeliveryPoints}
      setPerpage={handleSetPerpage}
      perpage={deliveryPoints?.paginate.perpage}
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
      />
    </>
  );
}
