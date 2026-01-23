import { memo, useEffect, useMemo, useRef } from "react";
import { Control, useFormContext } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitRow, UnitFormData, UnitData } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ProductFormValues } from "@/dtos/product.dto";
import { useUnitManagement } from "../../_hooks/use-unit-management";
import { useUnitForm } from "../../_hooks/use-unit-form";
import { useUnitColumns } from "../../_hooks/use-unit-columns";
import UnitCard from "./UnitCard";

interface OrderUnitProps {
  readonly token: string;
  readonly buCode: string;
  readonly control: Control<ProductFormValues>;
  readonly currentMode: formType;
}

const OrderUnit = ({ control, currentMode, token, buCode }: OrderUnitProps) => {
  const tProducts = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const { units } = useUnitQuery({
    token,
    buCode,
    params: {
      perpage: -1,
    },
  });
  const { watch, setValue } = useFormContext<ProductFormValues>();
  const inventoryUnitId = watch("inventory_unit_id");

  const { displayUnits, newUnits } = useUnitManagement({
    unitType: "order",
    control,
    watch,
    setValue,
  });

  const {
    fields: orderUnitFields,
    removeUnit: removeOrderUnit,
    getUnitName,
    getAvailableUnits,
    handleDefaultChange,
    handleFieldChange,
    handleAddUnit,
    handleRemoveUnit,
  } = useUnitForm({
    unitType: "order",
    control,
    watch,
    setValue,
    units,
    displayUnits,
    inventoryUnitId,
  });

  const isInitializingRef = useRef(false);

  useEffect(() => {
    if (isInitializingRef.current) return;

    newUnits.forEach((field: UnitFormData, index: number) => {
      const fromUnitId = field.from_unit_id || inventoryUnitId;
      const toUnitId = field.to_unit_id;

      if (!fromUnitId || !toUnitId) return;

      if (fromUnitId === toUnitId && field.to_unit_qty !== field.from_unit_qty) {
        setValue(`order_units.add.${index}.to_unit_qty`, field.from_unit_qty, {
          shouldDirty: false,
        });
      } else if (field.to_unit_qty === 0) {
        setValue(`order_units.add.${index}.to_unit_qty`, 1, { shouldDirty: false });
      }
    });
  }, [newUnits.length, inventoryUnitId, setValue, newUnits]);

  const hasOrderUnits = useMemo(
    () => displayUnits.length > 0 || newUnits.length > 0,
    [displayUnits.length, newUnits.length]
  );

  const inventoryUnitName = inventoryUnitId ? getUnitName(inventoryUnitId) : "";

  const allUnits: UnitRow[] = useMemo(
    () => [
      ...orderUnitFields.map((field, index) => ({
        ...field,
        to_unit_id: field.to_unit_id || "",
        to_unit_qty: field.to_unit_qty || 1,
        is_default: field.is_default || false,
        description: "",
        is_active: true,
        isNew: true,
        fieldIndex: index,
      })),
      ...displayUnits.map((unit: UnitData, index: number) => ({
        ...unit,
        isNew: false,
        dataIndex: index,
      })),
    ],
    [displayUnits, orderUnitFields]
  );

  const columns = useUnitColumns({
    unitType: "order",
    control,
    currentMode,
    getUnitName,
    getAvailableUnits,
    handleDefaultChange,
    handleFieldChange,
    handleRemoveUnit,
    removeUnit: removeOrderUnit,
    inventoryUnitName,
    translations: {
      orderUnit: tProducts("order_unit"),
      ingredientUnit: tProducts("ingredient_unit"),
      inventoryUnit: tProducts("inventory_unit"),
      toInventoryUnit: tProducts("to_inventory_unit"),
      default: tProducts("default"),
      conversion: tProducts("conversion"),
      action: tProducts("action"),
      delete: tCommon("delete"),
      cancel: tCommon("cancel"),
      deleteDescription: tCommon("del_desc"),
    },
  });

  const table = useReactTable({
    data: allUnits,
    columns,
    getRowId: (row) => row.id ?? "",
    state: {},
    getCoreRowModel: getCoreRowModel(),
    meta: {
      getRowClassName: (row: UnitRow) => {
        return row.isNew ? "bg-green-50" : "bg-amber-50";
      },
    },
  });

  return (
    <UnitCard
      title={tProducts("order_unit")}
      addTooltip={tProducts("add_order_unit")}
      onAdd={handleAddUnit}
      disabled={!inventoryUnitId}
      showAddButton={currentMode !== formType.VIEW}
      hasUnits={hasOrderUnits}
      emptyMessage={
        inventoryUnitId ? tProducts("no_order_units_defined") : tProducts("pls_select_order_unit")
      }
      noDataMessage={tCommon("no_data")}
      table={table}
      data={allUnits}
      rowClassName={(row: UnitRow) => (row.isNew ? "bg-green-50" : "bg-amber-50")}
    />
  );
};

export default memo(OrderUnit);
