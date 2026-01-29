import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery } from "@/hooks/use-currency";
import { UseFormReturn } from "react-hook-form";
import { PrtFormValues, CreatePrtDetailDto, UpdatePrtDetailDto } from "../../_schema/prt.schema";
import { useMemo, useState, useCallback } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestTemplateDetailDto } from "@/dtos/pr-template.dto";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createPrtItemColumns, PrtDetailItem } from "./PrtItemColumns";

interface Props {
  readonly form: UseFormReturn<PrtFormValues>;
  currentMode: formType;
  originalItems: PurchaseRequestTemplateDetailDto[];
  readonly buCode: string;
  readonly token: string;
  readonly defaultCurrencyId: string;
}

interface DetailState {
  add: CreatePrtDetailDto[];
  update: UpdatePrtDetailDto[];
  delete: { id: string }[];
}

export default function PrtItems({
  form,
  currentMode,
  originalItems,
  buCode,
  token,
  defaultCurrencyId,
}: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { getCurrencyCode } = useCurrenciesQuery(token, buCode);

  // Use local state instead of form.watch to avoid re-render loops
  const [detailState, setDetailState] = useState<DetailState>({
    add: [],
    update: [],
    delete: [],
  });

  // Sync state to form
  const syncToForm = useCallback(
    (newState: DetailState) => {
      const formValue: PrtFormValues["purchase_request_template_detail"] = {};
      if (newState.add.length > 0) formValue.add = newState.add;
      if (newState.update.length > 0) formValue.update = newState.update;
      if (newState.delete.length > 0) formValue.delete = newState.delete;

      if (Object.keys(formValue).length > 0) {
        form.setValue("purchase_request_template_detail", formValue);
      } else {
        form.setValue("purchase_request_template_detail", undefined);
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
  const items: PrtDetailItem[] = useMemo(() => {
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
      .filter((item) => !updatedIds.has(item.id) && !deletedIds.has(item.id))
      .map((item, index) => ({
        ...item,
        _type: "original" as const,
        _index: index,
      }));
    return [...addWithType, ...updateWithType, ...originalWithType];
  }, [detailState.add, detailState.update, originalItems, updatedIds, deletedIds]);

  const isEditMode = currentMode !== formType.VIEW;

  const onAdd = useCallback(() => {
    const newItem: CreatePrtDetailDto = {
      location_id: "",
      location_name: "",
      product_id: "",
      product_name: "",
      inventory_unit_id: "",
      inventory_unit_name: null,
      requested_qty: 0,
      requested_unit_id: "",
      requested_unit_name: "",
      requested_unit_conversion_factor: 1,
      foc_qty: 0,
      foc_unit_name: "",
      currency_id: defaultCurrencyId,
      tax_amount: 0,
      discount_amount: 0,
      is_active: true,
    };
    setDetailState((prev) => {
      const newState = { ...prev, add: [newItem, ...prev.add] };
      syncToForm(newState);
      return newState;
    });
  }, [syncToForm]);

  const onDelete = useCallback(
    (item: PrtDetailItem) => {
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
          const originalItem = item as PurchaseRequestTemplateDetailDto & {
            _type: "original";
            _index: number;
          };
          newState = {
            ...prev,
            delete: [...prev.delete, { id: originalItem.id }],
          };
        }

        syncToForm(newState);
        return newState;
      });
    },
    [syncToForm]
  );

  const updateItemField = useCallback(
    (item: PrtDetailItem, updates: Partial<CreatePrtDetailDto>) => {
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
          const { _type, _index, ...originalFields } = item as PurchaseRequestTemplateDetailDto & {
            _type: "original";
            _index: number;
          };
          const newUpdateItem: UpdatePrtDetailDto = {
            ...originalFields,
            delivery_point_name: originalFields.delivery_point_name ?? undefined,
            inventory_unit_name: originalFields.inventory_unit_name ?? undefined,
            exchange_rate_date: originalFields.exchange_rate_date ?? undefined,
            tax_profile_id: originalFields.tax_profile_id ?? undefined,
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
      createPrtItemColumns({
        currentMode,
        buCode,
        token,
        tTableHeader,
        getCurrencyCode,
        updateItemField,
        onDelete,
      }),
    [currentMode, buCode, token, tTableHeader, getCurrencyCode, updateItemField, onDelete]
  );

  const table = useReactTable({
    data: items,
    columns,
    getRowId: (row, index) => {
      if (row._type === "update") return (row as UpdatePrtDetailDto).id;
      if (row._type === "original")
        return (row as PurchaseRequestTemplateDetailDto & { _type: "original" }).id;
      return `new-${index}`;
    },
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-medium">{tPurchaseRequest("items")}</p>
        {isEditMode && (
          <Button type="button" onClick={onAdd} size={"sm"} className="h-7 text-xs">
            <Plus className="h-3 w-3" />
            {tPurchaseRequest("add_item")}
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
