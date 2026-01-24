import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import { UseFormReturn, useFieldArray } from "react-hook-form";
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

const createEmptyItem = (sequence: number): PoDetailItemDto => ({
  sequence,
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
});

export default function PoItems({ form, currentMode }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tTableHeader = useTranslations("TableHeader");
  const tCommon = useTranslations("Common");
  const { buCode } = useAuth();

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "details",
  });

  const isEditMode = currentMode !== formType.VIEW;

  const getNextSequence = useCallback(() => {
    const allSequences = fields.map((item) => item.sequence);
    return allSequences.length > 0 ? Math.max(...allSequences) + 1 : 1;
  }, [fields]);

  const onAdd = useCallback(() => {
    const newItem = createEmptyItem(getNextSequence());
    // prepend by inserting at index 0
    append(newItem);
  }, [append, getNextSequence]);

  const onDelete = useCallback(
    (item: PoDetailItem) => {
      remove(item._index);
    },
    [remove]
  );

  const updateItemField = useCallback(
    (item: PoDetailItem, updates: Partial<PoDetailItemDto>) => {
      const currentItem = fields[item._index];
      if (currentItem) {
        update(item._index, { ...currentItem, ...updates });
      }
    },
    [fields, update]
  );

  // Add _index to items for table rendering
  const itemsWithIndex: PoDetailItem[] = useMemo(() => {
    return fields.map((item, index) => ({
      ...item,
      _type: item.id ? ("original" as const) : ("add" as const),
      _index: index,
    }));
  }, [fields]);

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
