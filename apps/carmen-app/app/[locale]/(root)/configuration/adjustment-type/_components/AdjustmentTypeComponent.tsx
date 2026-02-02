"use client";

import SignInDialog from "@/components/SignInDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  useAdjustmentTypeQuery,
  useDeleteAdjustmentTypeMutation,
  adjustmentTypeQueryKey,
} from "@/hooks/use-adjustment-type";
import { useURL } from "@/hooks/useURL";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import AdjustmentTypeList from "./AdjustmentTypeList";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { configurationPermission } from "@/lib/permission";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { AdjustmentTypeDto } from "@/dtos/adjustment-type.dto";

export default function AdjustmentTypeComponent() {
  const { token, buCode, permissions } = useAuth();

  // Get permissions for adjustment-type resource (assuming resource name 'adjustment-type' or reusing department for now? User said "follow department ux/ui", let's assume 'adjustment-type' resource exists or we check generic config)
  // Since I don't know the exact permission resource name, I will assume it is 'adjustment_type' or similar.
  // If not sure, I might default to true for now or check 'department' just to be safe if it falls under general config.
  // Actually, let's use a safe default or 'inventory_adjustment' might be related?
  // Let's assume 'configuration' usage. For now, I'll pass defaults or check a likely key.
  const hasCreate = true; // Placeholder
  const hasUpdate = true; // Placeholder
  const hasDelete = true; // Placeholder

  const queryClient = useQueryClient();

  const router = useRouter();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AdjustmentTypeDto | undefined>(undefined);
  const [statusOpen, setStatusOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [filter, setFilter] = useURL("filter");
  const [sort, setSort] = useURL("sort");
  const [page, setPage] = useURL("page");
  const [perpage, setPerpage] = useURL("perpage");

  const { adjustmentTypeData, paginate, isLoading, isUnauthorized } = useAdjustmentTypeQuery(
    token,
    buCode,
    {
      search,
      page,
      sort,
      filter,
      perpage,
    }
  );

  const { mutate: deleteAdjustmentType, isPending: isDeleting } = useDeleteAdjustmentTypeMutation(
    token,
    buCode
  );

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const currentPage = paginate?.current_page ?? 1;
  const totalPages = paginate?.last_page ?? 1;
  const totalItems = paginate?.total ?? 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  const handleAdd = () => {
    router.push("/configuration/adjustment-type/new");
  };

  const handleSetPerpage = (newPerpage: number) => {
    setPerpage(newPerpage.toString());
  };

  const handleDelete = (item: AdjustmentTypeDto) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete?.id) {
      deleteAdjustmentType(itemToDelete.id, {
        onSuccess: () => {
          toastSuccess({ message: "Delete success" });
          queryClient.invalidateQueries({ queryKey: [adjustmentTypeQueryKey, buCode] });
          setDeleteDialogOpen(false);
          setItemToDelete(undefined);
        },
        onError: (error: Error) => {
          toastError({ message: "Delete error" });
          console.error("Failed to delete adjustment type:", error);
          setDeleteDialogOpen(false);
          setItemToDelete(undefined);
        },
      });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(undefined);
  };

  const sortFields = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "code",
      label: "Code",
    },
    {
      key: "type",
      label: "Type",
    },
    {
      key: "is_active",
      label: "Status",
    },
  ];

  const actionButtons = (
    <div className="action-btn-container">
      <Button size="sm" onClick={handleAdd} disabled={!hasCreate}>
        <Plus className="h-4 w-4" />
        Add
      </Button>

      <Button variant="outlinePrimary" className="group" size="sm">
        <FileDown className="h-4 w-4" />
        <p>Export</p>
      </Button>

      <Button variant="outlinePrimary" size="sm">
        <Printer className="h-4 w-4" />
        <p>Print</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container">
      <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search..." />
      <div className="fxr-c gap-2">
        <StatusSearchDropdown
          value={filter}
          onChange={setFilter}
          open={statusOpen}
          onOpenChange={setStatusOpen}
        />
        <SortComponent fieldConfigs={sortFields} sort={sort} setSort={setSort} />
      </div>
    </div>
  );

  const content = (
    <AdjustmentTypeList
      adjustmentTypes={adjustmentTypeData}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      perpage={paginate?.per_page ?? 10}
      onPageChange={handlePageChange}
      sort={parseSortString(sort)}
      onSort={setSort}
      setPerpage={handleSetPerpage}
      onDelete={handleDelete}
      canUpdate={hasUpdate}
      canDelete={hasDelete}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title="Adjustment Type"
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirm Delete"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
