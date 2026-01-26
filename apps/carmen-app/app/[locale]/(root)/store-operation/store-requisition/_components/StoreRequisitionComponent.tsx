"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import StoreRequisitionList from "./StoreRequisitionList";
import { Link } from "@/lib/navigation";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { useAuth } from "@/context/AuthContext";
import { useDeleteSr, useStoreRequisitionQuery } from "@/hooks/use-sr";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";

export default function StoreRequisitionComponent() {
  const { token, buCode, dateFormat } = useAuth();

  const tCommon = useTranslations("Common");
  const [search, setSearch] = useURL("search");
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useURL("sort");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortFields = [
    { key: "name", label: "Name" },
    { key: "is_active", label: "Status" },
  ];

  const { srData, paginate, isLoading, error } = useStoreRequisitionQuery({
    token,
    buCode,
    params: {
      search,
      sort,
    },
  });
  const deleteMutation = useDeleteSr(token, buCode);

  const handleOpenDeleteDialog = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setDeleteId(null);
        toastSuccess({ message: "Delete Store Requisition Success" });
      },
      onError: () => {
        toastError({ message: "Delete Store Requisition Failed" });
      },
    });
  };

  console.log(srData);

  const title = "Store Requisition";

  const actionButtons = (
    <div className="action-btn-container" data-id="store-requisition-action-buttons">
      <Button size={"sm"} asChild>
        <Link href="/store-operation/store-requisition/new">
          <Plus className="h-4 w-4" />
          {tCommon("add")}
        </Link>
      </Button>
      <Button
        variant="outline"
        className="group"
        size={"sm"}
        data-id="store-requisition-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>
      <Button variant="outline" size={"sm"} data-id="store-requisition-list-print-button">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="store-requisition-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="store-requisition-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="store-requisition-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="store-requisition-sort-dropdown"
        />
        <Button size={"sm"}>Add Filter</Button>
      </div>
    </div>
  );

  const content = (
    <StoreRequisitionList
      storeRequisitions={srData ?? []}
      isLoading={isLoading}
      dateFormat={dateFormat ?? "yyyy-MM-dd"}
      onDelete={handleOpenDeleteDialog}
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
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title="Delete Store Requisition"
        description="Are you sure you want to delete this store requisition? This action cannot be undone."
      />
    </>
  );
}
