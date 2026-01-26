"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { SrCreate, SrDetailItemDto, SrDetailItemCreate } from "@/dtos/sr.dto";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createSrItemColumns, SrItemRow } from "./SrItemColumns";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useTranslations } from "next-intl";

interface ItemStoreRequisitionProps {
  readonly mode: formType;
  readonly form: UseFormReturn<SrCreate>;
  readonly itemsSr?: SrDetailItemDto[];
}

export default function ItemStoreRequisition({
  mode,
  form,
  itemsSr = [],
}: ItemStoreRequisitionProps) {
  const { token, buCode } = useAuth();
  const t = useTranslations("StoreRequisition");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "details.store_requisition_detail.add",
  });

  const watchedFields = useWatch({
    control: form.control,
    name: "details.store_requisition_detail.add",
  });

  const handleAdd = useCallback(() => {
    prepend({
      description: "",
      current_stage_status: "submit",
      product_id: "",
      requested_qty: 1,
      doc_version: 1,
    });
  }, [prepend]);

  // Use form.setValue instead of update to avoid re-creating columns on every change
  const handleItemUpdate = useCallback(
    (index: number, fieldName: keyof SrDetailItemCreate, value: unknown) => {
      form.setValue(
        `details.store_requisition_detail.add.${index}.${fieldName}` as `details.store_requisition_detail.add.${number}.${keyof SrDetailItemCreate}`,
        value as never,
        { shouldDirty: true }
      );
    },
    [form]
  );

  const handleRemoveNewItem = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleRemoveOriginalItem = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;

    // Add item to delete array in form
    const currentDeleteItems = form.getValues("details.store_requisition_detail.delete") || [];
    form.setValue("details.store_requisition_detail.delete", [
      ...currentDeleteItems,
      { id: itemToDelete },
    ]);

    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, [itemToDelete, form]);

  // Get items marked for deletion to filter them from display
  const deleteItems = useWatch({
    control: form.control,
    name: "details.store_requisition_detail.delete",
  });

  const deletedIds = useMemo(() => {
    return new Set((deleteItems || []).map((item) => item.id));
  }, [deleteItems]);

  // Transform data for the table
  // itemsSr = existing items from API (read-only display)
  // fields = new items being added (editable)
  const tableData: SrItemRow[] = useMemo(() => {
    // Only show itemsSr (from API) - filter out deleted items
    const originalItems: SrItemRow[] = itemsSr
      .filter((item) => !deletedIds.has(item.id))
      .map((item, index) => ({
        id: item.id,
        isNewItem: false,
        originalIndex: index,
        product_id: item.product_id,
        product_name: item.product_name,
        description: item.description,
        requested_qty: item.requested_qty,
        current_stage_status: item.current_stage_status,
      }));

    // Only show fields (new items) - these are editable
    const newItems: SrItemRow[] = fields.map((field, index) => {
      const currentValues = watchedFields?.[index];
      return {
        id: field.id,
        isNewItem: true,
        newItemIndex: index,
        product_id: currentValues?.product_id ?? field.product_id,
        product_name: undefined,
        description: currentValues?.description ?? field.description,
        requested_qty: currentValues?.requested_qty ?? field.requested_qty,
        current_stage_status: currentValues?.current_stage_status ?? field.current_stage_status,
      };
    });

    // New items first, then original items
    return [...newItems, ...originalItems];
  }, [itemsSr, fields, watchedFields, deletedIds]);

  // Collect all used product IDs (from both original and new items)
  const usedProductIds = useMemo(() => {
    const ids: string[] = [];
    // From original items (not deleted)
    itemsSr
      .filter((item) => !deletedIds.has(item.id))
      .forEach((item) => {
        if (item.product_id) ids.push(item.product_id);
      });
    // From new items
    watchedFields?.forEach((field) => {
      if (field?.product_id) ids.push(field.product_id);
    });
    return ids;
  }, [itemsSr, watchedFields, deletedIds]);

  const columns = useMemo(
    () =>
      createSrItemColumns({
        currentMode: mode,
        token: token || "",
        buCode: buCode || "",
        onItemUpdate: handleItemUpdate,
        onRemoveNewItem: handleRemoveNewItem,
        onRemoveOriginalItem: handleRemoveOriginalItem,
        tHeader: (key: string) => t(`items.${key}`),
        usedProductIds,
      }),
    [mode, token, buCode, handleItemUpdate, handleRemoveNewItem, handleRemoveOriginalItem, t, usedProductIds]
  );

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const isViewMode = mode === formType.VIEW;

  return (
    <Card className="p-2 space-y-2">
      <div className="flex justify-between items-center p-2">
        <p className="text-base font-medium">{t("items.title")}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isViewMode}
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            {t("buttons.addItem")}
          </Button>
        </div>
      </div>

      <DataGrid
        table={table}
        recordCount={tableData.length}
        isLoading={false}
        loadingMode="skeleton"
        emptyMessage={t("items.noItems")}
        tableLayout={{
          headerSticky: true,
          dense: true,
          rowBorder: true,
          headerBackground: false,
          headerBorder: true,
          width: "fixed",
        }}
      >
        <DataGridContainer>
          <ScrollArea>
            <div className="pb-3">
              <DataGridTable />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DataGridContainer>
      </DataGrid>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={t("dialog.deleteItemTitle")}
        description={t("dialog.deleteItemDescription")}
      />
    </Card>
  );
}
