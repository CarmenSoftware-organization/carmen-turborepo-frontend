import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UseFormReturn } from "react-hook-form";
import {
  PoFormValues,
  CreatePoDetailDto,
  UpdatePoDetailDto,
  PoDetailItemDto,
} from "../../_schema/po.schema";
import { useMemo, useState, useCallback } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { PoDetailItemDto as PoDetailItemDtoFromDto } from "@/dtos/po.dto";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createPoItemColumns, PoDetailItem } from "./PoItemColumns";

interface Props {
  readonly form: UseFormReturn<PoFormValues>;
  currentMode: formType;
  originalItems: PoDetailItemDtoFromDto[];
}

interface DetailState {
  add: CreatePoDetailDto[];
  update: UpdatePoDetailDto[];
  delete: { id: string }[];
}

export default function PoItems({ form, currentMode, originalItems }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { token, buCode } = useAuth();

  // Use local state instead of form.watch to avoid re-render loops
  const [detailState, setDetailState] = useState<DetailState>({
    add: [],
    update: [],
    delete: [],
  });

  // Sync state to form
  const syncToForm = useCallback(
    (newState: DetailState) => {
      const formValue: PoFormValues["details"] = {};
      if (newState.add.length > 0) formValue.add = newState.add;
      if (newState.update.length > 0) formValue.update = newState.update;
      if (newState.delete.length > 0) formValue.delete = newState.delete;

      if (Object.keys(formValue).length > 0) {
        form.setValue("details", formValue);
      } else {
        form.setValue("details", undefined);
      }
    },
    [form]
  );

  const updatedIds = useMemo(
    () => new Set(detailState.update.map((item) => item.id)),
    [detailState.update]
  );
  const deletedIds = useMemo(
    () => new Set(detailState.delete.map((item) => item.id)),
    [detailState.delete]
  );

  // Combine add, update, and original items for display
  const items: PoDetailItem[] = useMemo(() => {
    const addWithType = detailState.add.map((item, index) => ({
      ...item,
      _type: "add" as const,
      _index: index,
    }));
    const updateWithType = detailState.update.map((item, index) => ({
      ...item,
      _type: "update" as const,
      _index: index,
    }));
    const originalWithType = originalItems
      .filter((item) => item.id && !updatedIds.has(item.id) && !deletedIds.has(item.id))
      .map((item, index) => ({
        ...item,
        _type: "original" as const,
        _index: index,
      }));
    return [...addWithType, ...updateWithType, ...originalWithType];
  }, [detailState.add, detailState.update, originalItems, updatedIds, deletedIds]);

  const isEditMode = currentMode !== formType.VIEW;

  const getNextSequence = useCallback(() => {
    const allSequences = [
      ...detailState.add.map((item) => item.sequence),
      ...detailState.update.map((item) => item.sequence),
      ...originalItems.map((item) => item.sequence),
    ];
    return allSequences.length > 0 ? Math.max(...allSequences) + 1 : 1;
  }, [detailState.add, detailState.update, originalItems]);

  const onAdd = useCallback(() => {
    const newItem: CreatePoDetailDto = {
      sequence: getNextSequence(),
      product_id: "",
      product_name: "",
      product_local_name: null,
      order_unit_id: "",
      order_unit_name: "",
      order_unit_conversion_factor: 1,
      order_qty: 0,
      base_unit_id: "",
      base_unit_name: "",
      base_qty: 0,
      price: 0,
      sub_total_price: 0,
      net_amount: 0,
      total_price: 0,
      tax_profile_id: null,
      tax_profile_name: null,
      tax_rate: 0,
      tax_amount: 0,
      is_tax_adjustment: false,
      discount_rate: 0,
      discount_amount: 0,
      is_discount_adjustment: false,
      is_foc: false,
      pr_detail: [],
      description: "",
      note: "",
    };
    setDetailState((prev) => {
      const newState = { ...prev, add: [newItem, ...prev.add] };
      syncToForm(newState);
      return newState;
    });
  }, [syncToForm, getNextSequence]);

  const onDelete = useCallback(
    (item: PoDetailItem) => {
      setDetailState((prev) => {
        let newState: DetailState;

        if (item._type === "add") {
          const filteredAdd = prev.add.filter((_, index) => index !== item._index);
          newState = { ...prev, add: filteredAdd };
        } else if (item._type === "update") {
          const itemToDelete = prev.update[item._index];
          const filteredUpdate = prev.update.filter((_, index) => index !== item._index);
          newState = {
            ...prev,
            update: filteredUpdate,
            delete: [...prev.delete, { id: itemToDelete.id }],
          };
        } else {
          // Original item
          const originalItem = item as PoDetailItemDtoFromDto & {
            _type: "original";
            _index: number;
          };
          newState = {
            ...prev,
            delete: [...prev.delete, { id: originalItem.id! }],
          };
        }

        syncToForm(newState);
        return newState;
      });
    },
    [syncToForm]
  );

  const updateItemField = useCallback(
    (item: PoDetailItem, updates: Partial<CreatePoDetailDto>) => {
      setDetailState((prev) => {
        let newState: DetailState;

        if (item._type === "add") {
          const updatedAdd = prev.add.map((addItem, index) =>
            index === item._index ? { ...addItem, ...updates } : addItem
          );
          newState = { ...prev, add: updatedAdd };
        } else if (item._type === "update") {
          const updatedUpdate = prev.update.map((updateItem, index) =>
            index === item._index ? { ...updateItem, ...updates } : updateItem
          );
          newState = { ...prev, update: updatedUpdate };
        } else {
          // Move original item to update array with changes
          const { _type, _index, ...originalFields } = item as PoDetailItemDtoFromDto & {
            _type: "original";
            _index: number;
          };
          const newUpdateItem: UpdatePoDetailDto = {
            ...originalFields,
            id: originalFields.id!,
            product_local_name: originalFields.product_local_name ?? null,
            tax_profile_id: originalFields.tax_profile_id ?? null,
            tax_profile_name: originalFields.tax_profile_name ?? null,
            description: originalFields.description ?? "",
            note: originalFields.note ?? "",
            ...updates,
          };
          newState = { ...prev, update: [...prev.update, newUpdateItem] };
        }

        syncToForm(newState);
        return newState;
      });
    },
    [syncToForm]
  );

  const columns = useMemo(
    () =>
      createPoItemColumns({
        currentMode,
        buCode,
        token,
        tTableHeader,
        updateItemField,
        onDelete,
      }),
    [currentMode, buCode, token, tTableHeader, updateItemField, onDelete]
  );

  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row, index) => {
      if (row._type === "update") return (row as UpdatePoDetailDto).id;
      if (row._type === "original")
        return (row as PoDetailItemDtoFromDto & { _type: "original" }).id ?? `original-${index}`;
      return `new-${index}`;
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{tPurchaseOrder("items")}</p>
        {isEditMode && (
          <Button type="button" onClick={onAdd} size={"sm"} className="h-7 text-xs">
            <Plus className="h-3 w-3" />
            {tPurchaseOrder("add_item")}
          </Button>
        )}
      </div>
      <DataGrid
        table={table}
        recordCount={items.length}
        emptyMessage={tCommon("no_data")}
        tableLayout={{
          headerSticky: true,
          dense: false,
          rowBorder: true,
          headerBackground: true,
          headerBorder: true,
        }}
      >
        <div className="w-full space-y-2.5">
          <DataGridContainer>
            <ScrollArea className="max-h-[calc(100vh-250px)]">
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </DataGridContainer>
        </div>
      </DataGrid>
    </div>
  );
}
