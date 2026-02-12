"use client";

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
import { useListPageState } from "@/hooks/use-list-page-state";
import { useDeleteDialog } from "@/hooks/use-delete-dialog";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import { useState } from "react";
import AdjustmentTypeList from "./AdjustmentTypeList";
import { parseSortString } from "@/utils/table";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import { AdjustmentTypeDto } from "@/dtos/adjustment-type.dto";
import { useTranslations } from "next-intl";
import { InternalServerError, Unauthorized, Forbidden } from "@/components/error-ui";
import { getApiErrorType } from "@/utils/error";

export default function AdjustmentTypeComponent() {
  const { token, buCode } = useAuth();
  const tAdj = useTranslations("AdjustmentType");
  const tCommon = useTranslations("Common");

  const router = useRouter();
  const { search, setSearch, filter, setFilter, sort, setSort, page, perpage, handlePageChange, handleSetPerpage } = useListPageState();
  const [statusOpen, setStatusOpen] = useState(false);

  const { adjustmentTypeData, paginate, isLoading, error } = useAdjustmentTypeQuery(
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

  const { mutate: deleteAdjustmentType } = useDeleteAdjustmentTypeMutation(
    token,
    buCode
  );

  const deleteDialog = useDeleteDialog<AdjustmentTypeDto>(deleteAdjustmentType, {
    queryKey: [adjustmentTypeQueryKey, buCode],
    successMessage: tAdj("delete_success"),
    errorMessage: tAdj("delete_error"),
    logContext: "delete adjustment type",
  });

  if (error) {
    const errorType = getApiErrorType(error);
    if (errorType === "unauthorized") return <Unauthorized />;
    if (errorType === "forbidden") return <Forbidden />;
    return <InternalServerError />;
  }

  const currentPage = paginate?.current_page ?? 1;
  const totalPages = paginate?.last_page ?? 1;
  const totalItems = paginate?.total ?? 0;

  const handleAdd = () => {
    router.push("/configuration/adjustment-type/new");
  };

  const sortFields = [
    {
      key: "name",
      label: tAdj("name"),
    },
    {
      key: "code",
      label: tAdj("code"),
    },
    {
      key: "type",
      label: tAdj("type"),
    },
    {
      key: "is_active",
      label: tAdj("status"),
    },
  ];

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2">
      <Button size="sm" onClick={handleAdd}>
        <Plus className="h-4 w-4" />
        {tAdj("add")}
      </Button>

      <Button variant="outlinePrimary" size="sm">
        <FileDown className="h-4 w-4" />
        {tCommon("export")}
      </Button>

      <Button variant="outlinePrimary" size="sm">
        <Printer className="h-4 w-4" />
        {tCommon("print")}
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <SearchInput defaultValue={search} onSearch={setSearch} placeholder="Search..." />
      <div className="flex items-center gap-2">
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
      onDelete={deleteDialog.openDialog}
    />
  );

  return (
    <>
      <DataDisplayTemplate
        title={tAdj("title")}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />
      <DeleteConfirmDialog
        {...deleteDialog.dialogProps}
        title={tAdj("delete_adjustment_type")}
        description={tAdj("confirm_delete_description", { name: deleteDialog.entityToDelete?.name || "" })}
      />
    </>
  );
}
