"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formType } from "@/dtos/form.dto";
import { SrCreate, SrDetailItemDto, SrDetailItemCreate } from "@/dtos/sr.dto";
import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
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

// Constant to prevent infinite re-renders (from form-pattern)
const EMPTY_ARRAY: SrDetailItemDto[] = [];

export default function ItemStoreRequisition({
  mode,
  form,
  itemsSr = EMPTY_ARRAY,
}: ItemStoreRequisitionProps) {
  const { token, buCode } = useAuth();
  const tStoreRequisition = useTranslations("StoreRequisition");

  // Local state for UI tracking (instead of useWatch)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [updatedNewItems, setUpdatedNewItems] = useState<Record<string, Partial<SrDetailItemCreate>>>({});

  const { fields, prepend, remove } = useFieldArray({
    control: form.control,
    name: "details.store_requisition_detail.add",
  });

  // Add new item
  const handleAdd = useCallback(() => {
    prepend({
      description: "",
      current_stage_status: "submit",
      product_id: "",
      requested_qty: 1,
      doc_version: 1,
    });
  }, [prepend]);

  // Update item field - updates form and local state for immediate UI
  const handleItemUpdate = useCallback(
    (index: number, fieldName: keyof SrDetailItemCreate, value: unknown) => {
      // Update form value
      form.setValue(
        `details.store_requisition_detail.add.${index}.${fieldName}` as `details.store_requisition_detail.add.${number}.${keyof SrDetailItemCreate}`,
        value as never,
        { shouldDirty: true }
      );

      // Update local state for immediate UI reflection
      const fieldId = fields[index]?.id;
      if (fieldId) {
        setUpdatedNewItems((prev) => ({
          ...prev,
          [fieldId]: {
            ...prev[fieldId],
            [fieldName]: value,
          },
        }));
      }
    },
    [form, fields]
  );

  // Remove new item
  const handleRemoveNewItem = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  // Remove original item (soft delete)
  const handleRemoveOriginalItem = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  // Confirm delete original item
  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;

    // Add to form's remove array
    const currentDeleteItems = form.getValues("details.store_requisition_detail.delete") || [];
    form.setValue("details.store_requisition_detail.delete", [
      ...currentDeleteItems,
      { id: itemToDelete },
    ]);

    // Update local state for UI
    setRemovedIds((prev) => new Set([...prev, itemToDelete]));
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  }, [itemToDelete, form]);

  // Helper to get item value (from local state or original)
  const getNewItemValue = useCallback(
    (fieldId: string, fieldName: keyof SrDetailItemCreate, defaultValue: unknown) => {
      return updatedNewItems[fieldId]?.[fieldName] ?? defaultValue;
    },
    [updatedNewItems]
  );

  // Transform to table data - memoized
  const tableData: SrItemRow[] = useMemo(() => {
    // Original items (from API) - filter out deleted items
    const originalItems: SrItemRow[] = itemsSr
      .filter((item) => !removedIds.has(item.id))
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

    // New items (from useFieldArray) - use local state for current values
    const newItems: SrItemRow[] = fields.map((field, index) => ({
      id: field.id,
      isNewItem: true,
      newItemIndex: index,
      product_id: getNewItemValue(field.id, "product_id", field.product_id) as string,
      product_name: undefined,
      description: getNewItemValue(field.id, "description", field.description) as string,
      requested_qty: getNewItemValue(field.id, "requested_qty", field.requested_qty) as number,
      current_stage_status: getNewItemValue(field.id, "current_stage_status", field.current_stage_status) as string,
    }));

    // New items first, then original items
    return [...newItems, ...originalItems];
  }, [itemsSr, fields, removedIds, getNewItemValue]);

  // Collect used product IDs for exclusion in lookup
  const usedProductIds = useMemo(() => {
    const ids: string[] = [];

    // From original items (not removed)
    itemsSr
      .filter((item) => !removedIds.has(item.id))
      .forEach((item) => {
        if (item.product_id) ids.push(item.product_id);
      });

    // From new items
    fields.forEach((field) => {
      const productId = getNewItemValue(field.id, "product_id", field.product_id) as string;
      if (productId) ids.push(productId);
    });

    return ids;
  }, [itemsSr, fields, removedIds, getNewItemValue]);

  // Stable columns - only recreate when necessary
  const columns = useMemo(
    () =>
      createSrItemColumns({
        currentMode: mode,
        token: token || "",
        buCode: buCode || "",
        onItemUpdate: handleItemUpdate,
        onRemoveNewItem: handleRemoveNewItem,
        onRemoveOriginalItem: handleRemoveOriginalItem,
        usedProductIds,
      }),
    [mode, token, buCode, handleItemUpdate, handleRemoveNewItem, handleRemoveOriginalItem, usedProductIds]
  );

  // Memoize getCoreRowModel
  const coreRowModel = useMemo(() => getCoreRowModel<SrItemRow>(), []);

  const table = useReactTable({
    data: tableData,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: coreRowModel,
  });

  const isViewMode = mode === formType.VIEW;

  return (
    <Card className="p-2 space-y-2">
      <div className="flex justify-between items-center p-2">
        <p className="text-base font-medium">{tStoreRequisition("items.title")}</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isViewMode}
            onClick={handleAdd}
          >
            <Plus className="h-4 w-4" />
            {tStoreRequisition("buttons.addItem")}
          </Button>
        </div>
      </div>

      <DataGrid
        table={table}
        recordCount={tableData.length}
        isLoading={false}
        loadingMode="skeleton"
        emptyMessage={tStoreRequisition("items.noItems")}
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
        title={tStoreRequisition("dialog.deleteItemTitle")}
        description={tStoreRequisition("dialog.deleteItemDescription")}
      />
    </Card>
  );
}
