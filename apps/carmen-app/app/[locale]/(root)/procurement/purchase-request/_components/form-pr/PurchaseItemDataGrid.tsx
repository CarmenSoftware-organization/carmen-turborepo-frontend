"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail, StageStatus, ItemStatus } from "@/dtos/purchase-request.dto";
import { useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { getCoreRowModel, useReactTable, getExpandedRowModel } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { createPurchaseItemColumns } from "./PurchaseItemColumns";
import { usePurchaseItemTable, PR_ITEM_BULK_ACTION } from "../../_hooks/use-purchase-item-table";
import BulkActionDialog from "./dialogs/BulkActionDialog";
import SelectAllDialog from "./dialogs/SelectAllDialog";

const EMPTY_ARRAY: PurchaseRequestDetail[] = [];

interface Props {
  currentMode: formType;
  items: PurchaseRequestDetail[];
  initValues?: PurchaseRequestDetail[];
  addFields: unknown[];
  onItemUpdate: (
    itemId: string,
    fieldName: string,
    value: unknown,
    selectedProduct?: unknown
  ) => void;
  onItemRemove: (itemId: string, isNewItem?: boolean, itemIndex?: number) => void;
  onAddItem: () => void;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
  getCurrentStatus: (stagesStatusValue: string | StageStatus[] | undefined) => string;
  workflow_id?: string;
  prStatus?: string;
}

export default function PurchaseItemDataGrid({
  currentMode,
  items,
  initValues = EMPTY_ARRAY,
  addFields,
  onItemUpdate,
  onItemRemove,
  onAddItem,
  getItemValue,
  getCurrentStatus,
  workflow_id,
  prStatus,
}: Props) {
  const { dateFormat, currencyBase, token, buCode } = useAuth();
  const tPr = useTranslations("PurchaseRequest");
  const tHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const tAction = useTranslations("Action");

  const {
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleRemoveItemClick,
    handleConfirmDelete,
    selectAllDialogOpen,
    setSelectAllDialogOpen,
    selectMode,
    setSelectMode,
    bulkActionDialogOpen,
    setBulkActionDialogOpen,
    bulkActionType,
    setBulkActionType,
    bulkActionMessage,
    setBulkActionMessage,
    sorting,
    setSorting,
    handleBulkActionClick,
  } = usePurchaseItemTable({
    onItemUpdate,
    onItemRemove,
    getItemValue,
  });

  const columns = useMemo(
    () =>
      createPurchaseItemColumns({
        currentMode,
        initValues,
        addFields,
        prStatus,
        getItemValue,
        getCurrentStatus,
        onItemUpdate,
        handleRemoveItemClick,
        setSelectAllDialogOpen,
        dateFormat: dateFormat || "yyyy-MM-dd",
        currencyBase: currencyBase || "THB",
        token: token || "",
        buCode: buCode || "",
        tHeader,
        tAction,
      }),
    [
      currentMode,
      initValues,
      addFields,
      prStatus,
      getItemValue,
      getCurrentStatus,
      onItemUpdate,
      handleRemoveItemClick,
      setSelectAllDialogOpen,
      dateFormat,
      currencyBase,
      token,
      buCode,
      tHeader,
      tPr,
      tAction,
    ]
  );

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const isNewA = !initValues.some((initItem) => initItem.id === a.id);
      const isNewB = !initValues.some((initItem) => initItem.id === b.id);

      if (isNewA && !isNewB) return -1;
      if (!isNewA && isNewB) return 1;

      const seqA = a.sequence_no ?? 0;
      const seqB = b.sequence_no ?? 0;
      return seqA - seqB;
    });
  }, [items, initValues]);

  const table = useReactTable({
    data: sortedItems,
    columns,
    getRowId: (row) => row.id,
    state: {
      sorting,
    },
    enableRowSelection: currentMode !== formType.VIEW,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length;

  const performBulkStatusUpdate = (status: string, message: string) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    for (const row of selectedRows) {
      const item = row.original;
      const currentStagesStatus = (getItemValue(item, "stages_status") || item.stages_status) as
        | string
        | StageStatus[]
        | undefined;

      // Create new stages_status by appending new status to array
      let newStagesStatus: StageStatus[];

      if (Array.isArray(currentStagesStatus)) {
        // If already array, append to it
        newStagesStatus = [
          ...currentStagesStatus,
          {
            seq: currentStagesStatus.length + 1,
            name: null,
            status: status,
            message: message,
          },
        ];
      } else {
        // If not array or is string, create new array
        newStagesStatus = [
          {
            seq: 1,
            name: null,
            status: status,
            message: message,
          },
        ];
      }

      onItemUpdate(item.id, "stages_status", newStagesStatus);
    }
    table.resetRowSelection();
  };

  useEffect(() => {
    if (bulkActionType === PR_ITEM_BULK_ACTION.APPROVED) {
      performBulkStatusUpdate(bulkActionType, "");
      setBulkActionType(null);
    }
  }, [bulkActionType]);

  const handleBulkActionConfirm = () => {
    if (bulkActionType) {
      performBulkStatusUpdate(bulkActionType, bulkActionMessage);
      setBulkActionDialogOpen(false);
      setBulkActionType(null);
      setBulkActionMessage("");
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-muted-foreground ">{tPr("items")}</p>
        <div className="flex items-center gap-2">
          {currentMode !== formType.VIEW && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onAddItem();
                    }}
                    size="sm"
                    className={cn("w-7 h-7", !workflow_id && "bg-muted-foreground")}
                    disabled={!workflow_id}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tPr("add_item")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      {selectedRowsCount > 0 && currentMode !== formType.VIEW && (
        <div className="flex items-center gap-2">
          <Button
            onClick={handleBulkActionClick(PR_ITEM_BULK_ACTION.APPROVED)}
            size="sm"
            className="h-7"
          >
            {tAction("approve")}
          </Button>
          <Button
            onClick={handleBulkActionClick(PR_ITEM_BULK_ACTION.REVIEW)}
            size="sm"
            className="h-7"
            variant={"outlinePrimary"}
          >
            {tAction("review")}
          </Button>
          <Button
            onClick={handleBulkActionClick(PR_ITEM_BULK_ACTION.REJECTED)}
            size="sm"
            className="h-7"
            variant={"destructive"}
          >
            {tAction("reject")}
          </Button>
        </div>
      )}
      <DataGrid
        table={table}
        recordCount={items.length}
        isLoading={false}
        loadingMode="skeleton"
        emptyMessage={tCommon("no_data")}
        tableLayout={{
          headerSticky: true,
          dense: true,
          rowBorder: true,
          headerBackground: false,
          headerBorder: true,
          width: "fixed",
        }}
      >
        <div className="w-full space-y-2">
          <DataGridContainer className="">
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
      />

      <SelectAllDialog
        open={selectAllDialogOpen}
        onOpenChange={setSelectAllDialogOpen}
        selectMode={selectMode}
        onSelectModeChange={setSelectMode}
        items={items}
        table={table}
        getItemValue={getItemValue}
        getCurrentStatus={getCurrentStatus}
      />

      <BulkActionDialog
        open={bulkActionDialogOpen}
        onOpenChange={setBulkActionDialogOpen}
        bulkActionType={bulkActionType}
        bulkActionMessage={bulkActionMessage}
        onMessageChange={setBulkActionMessage}
        onConfirm={handleBulkActionConfirm}
      />
    </div>
  );
}
