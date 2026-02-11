"use client";

import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import { useMemo, useEffect } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";
import { getCoreRowModel, useReactTable, getExpandedRowModel } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { createPurchaseItemColumns } from "./PurchaseItemColumns";
import { usePurchaseItemTable, PR_ITEM_BULK_ACTION } from "../../_hooks/use-purchase-item-table";
import BulkActionDialog from "./dialogs/BulkActionDialog";
import SelectAllDialog from "./dialogs/SelectAllDialog";
import { useCurrenciesQuery } from "@/hooks/use-currency";
import { useSplitPr } from "@/hooks/use-purchase-request";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { fetchPriceCompare } from "@/hooks/use-bidding";
import { toast } from "sonner";
import Link from "next/link";

type InitValuesType = PurchaseRequestDetail[] | PurchaseRequestTemplateDetailDto[];

interface Props {
  currentMode: formType;
  items: PurchaseRequestDetail[];
  initValues?: InitValuesType;
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
  getCurrentStatus: (stageStatus: string | undefined) => string;
  workflow_id?: string;
  prStatus?: string;
  bu_code?: string;
  prId: string;
}

export default function PurchaseItemDataGrid({
  currentMode,
  items,
  initValues,
  addFields,
  onItemUpdate,
  onItemRemove,
  onAddItem,
  getItemValue,
  getCurrentStatus,
  workflow_id,
  prStatus,
  bu_code,
  prId,
}: Props) {
  const { dateFormat, currencyBase, token, buCode } = useAuth();
  const currentBuCode = bu_code ?? buCode;
  const tPr = useTranslations("PurchaseRequest");
  const tHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const tAction = useTranslations("Action");
  const { getCurrencyCode } = useCurrenciesQuery(token || "", currentBuCode || "");
  const splitPrMutation = useSplitPr(token, currentBuCode, prId);

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

  const usedProductIdsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const item of items) {
      const otherProductIds = items
        .filter((i) => i.id !== item.id)
        .map((i) => (getItemValue(i, "product_id") as string) || i.product_id)
        .filter(Boolean);
      map.set(item.id, otherProductIds);
    }
    return map;
  }, [items, getItemValue]);

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
        buCode: currentBuCode || "",
        tHeader,
        tAction,
        getCurrencyCode,
        usedProductIdsMap,
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
      currentBuCode,
      tHeader,
      tAction,
      getCurrencyCode,
      usedProductIdsMap,
    ]
  );

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const isNewA = !initValues?.some((initItem) => initItem.id === a.id);
      const isNewB = !initValues?.some((initItem) => initItem.id === b.id);

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
      onItemUpdate(item.id, "stage_status", status);
      onItemUpdate(item.id, "stage_message", message || null);
      onItemUpdate(item.id, "current_stage_status", status);
    }
    table.resetRowSelection();
  };

  useEffect(() => {
    if (bulkActionType === PR_ITEM_BULK_ACTION.APPROVED) {
      performBulkStatusUpdate(bulkActionType, "");
      setBulkActionType(null);
    } else if (bulkActionType === PR_ITEM_BULK_ACTION.SPLIT) {
      // Collect selected item IDs and call split API
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const detailIds = selectedRows.map((row) => row.original.id);

      if (detailIds.length > 0 && prId) {
        splitPrMutation.mutate(
          { detail_ids: detailIds },
          {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSuccess: (data: any) => {
              performBulkStatusUpdate(PR_ITEM_BULK_ACTION.REJECTED, "");
              toast.success(tPr("split_success"), {
                description: (
                  <Link
                    href={`/procurement/purchase-request/${currentBuCode}/${data?.data?.new_pr_id}`}
                    className="underline hover:text-white/80 font-bold"
                  >
                    {data?.data?.new_pr_no}
                  </Link>
                ),
              });
            },
            onError: () => {
              toastError({ message: tPr("split_failed") });
            },
          }
        );
      }
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
      <div className="flex items-center gap-2">
        <p className="font-semibold text-muted-foreground ">{tPr("items")}</p>
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
        <Button
          size={"sm"}
          className="h-7"
          onClick={async () => {
            for (const item of items) {
              const productId = getItemValue(item, "product_id") as string;
              const unitId = getItemValue(item, "inventory_unit_id") as string;
              const currencyId = getItemValue(item, "currency_id") as string;
              const deliveryDate = String(getItemValue(item, "delivery_date") ?? "").split("T")[0];
              if (!productId || !unitId || !currencyId) continue;

              try {
                const lists = await fetchPriceCompare(token || "", currentBuCode || "", {
                  product_id: productId,
                  unit_id: unitId,
                  currency_id: currencyId,
                  at_date: deliveryDate,
                });
                console.log(`Row ${item.id}:`, lists);
              } catch (error) {
                console.error(`Row ${item.id} error:`, error);
              }
            }
          }}
        >
          Auto Allowcate
        </Button>
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
          <Button
            size={"sm"}
            className="h-7"
            variant={"outline"}
            onClick={handleBulkActionClick(PR_ITEM_BULK_ACTION.SPLIT)}
          >
            {tAction("split")}
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
              <div className="pb-3">
                <DataGridTable />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tPr("confirm_delete")}
        description={tPr("confirm_delete_message")}
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
