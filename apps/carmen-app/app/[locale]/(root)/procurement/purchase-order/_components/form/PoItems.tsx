import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UseFormReturn, useWatch } from "react-hook-form";
import { PoFormValues, PoDetailItemDto } from "../../_schema/po.schema";
import { useMemo, useCallback } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { formType } from "@/dtos/form.dto";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { createPoItemColumns, PoDetailItem } from "./PoItemColumns";

interface Props {
  readonly form: UseFormReturn<PoFormValues>;
  currentMode: formType;
}

export default function PoItems({ form, currentMode }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { buCode } = useAuth();

  // Read items directly from form using useWatch for better performance
  const watchedDetails = useWatch({ control: form.control, name: "details" });
  const items = watchedDetails ?? [];

  const isEditMode = currentMode !== formType.VIEW;

  const getNextSequence = useCallback(() => {
    const allSequences = items.map((item) => item.sequence);
    return allSequences.length > 0 ? Math.max(...allSequences) + 1 : 1;
  }, [items]);

  const onAdd = useCallback(() => {
    const newItem: PoDetailItemDto = {
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
    form.setValue("details", [newItem, ...items]);
  }, [form, items, getNextSequence]);

  const onDelete = useCallback(
    (item: PoDetailItem) => {
      const newItems = items.filter((_, index) => index !== item._index);
      form.setValue("details", newItems.length > 0 ? newItems : undefined);
    },
    [form, items]
  );

  const updateItemField = useCallback(
    (item: PoDetailItem, updates: Partial<PoDetailItemDto>) => {
      const newItems = items.map((prevItem, index) =>
        index === item._index ? { ...prevItem, ...updates } : prevItem
      );
      form.setValue("details", newItems);
    },
    [form, items]
  );

  // Add _index to items for table rendering
  const itemsWithIndex: PoDetailItem[] = useMemo(() => {
    return items.map((item, index) => ({
      ...item,
      _type: item.id ? ("original" as const) : ("add" as const),
      _index: index,
    }));
  }, [items]);

  const columns = useMemo(
    () =>
      createPoItemColumns({
        currentMode,
        buCode,
        tTableHeader,
        updateItemField,
        onDelete,
      }),
    [currentMode, buCode, tTableHeader, updateItemField, onDelete]
  );

  const table = useReactTable({
    data: itemsWithIndex,
    columns,
    getRowId: (row, index) => {
      return row.id ?? `new-${index}`;
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
        recordCount={itemsWithIndex.length}
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
