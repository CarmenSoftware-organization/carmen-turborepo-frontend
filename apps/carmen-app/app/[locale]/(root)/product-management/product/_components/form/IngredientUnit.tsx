import { memo, useMemo } from "react";
import { Control, useFormContext } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitRow, UnitData } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ProductFormValues } from "@/dtos/product.dto";
import { useUnitManagement } from "../../_hooks/use-unit-management";
import { useUnitForm } from "../../_hooks/use-unit-form";
import { useUnitColumns } from "../../_hooks/use-unit-columns";
import UnitCard from "./UnitCard";

interface IngredientUnitProps {
  readonly token: string;
  readonly buCode: string;
  readonly control: Control<ProductFormValues>;
  readonly currentMode: formType;
  readonly isUseinRecipe?: boolean;
}

const IngredientUnit = ({
  control,
  currentMode,
  isUseinRecipe,
  token,
  buCode,
}: IngredientUnitProps) => {
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
    unitType: "ingredient",
    control,
    watch,
    setValue,
  });

  const {
    fields: ingredientUnitFields,
    removeUnit: removeIngredientUnit,
    getUnitName,
    getAvailableUnits,
    handleDefaultChange,
    handleFieldChange,
    handleAddUnit,
    handleRemoveUnit,
  } = useUnitForm({
    unitType: "ingredient",
    control,
    watch,
    setValue,
    units,
    displayUnits,
    inventoryUnitId,
  });

  const hasIngredientUnits = useMemo(
    () => displayUnits.length > 0 || newUnits.length > 0,
    [displayUnits.length, newUnits.length]
  );

  const inventoryUnitName = getUnitName(inventoryUnitId);

  const allUnits: UnitRow[] = useMemo(
    () => [
      ...ingredientUnitFields.map((field, index) => ({
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
    [displayUnits, ingredientUnitFields]
  );

  const columns = useUnitColumns({
    unitType: "ingredient",
    control,
    currentMode,
    getUnitName,
    getAvailableUnits,
    handleDefaultChange,
    handleFieldChange,
    handleRemoveUnit,
    removeUnit: removeIngredientUnit,
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
  });

  return (
    <UnitCard
      title={tProducts("ingredient_unit")}
      addTooltip={tProducts("add_ingredient_unit")}
      onAdd={handleAddUnit}
      disabled={!inventoryUnitId}
      showAddButton={currentMode !== formType.VIEW}
      hasUnits={hasIngredientUnits}
      emptyMessage={
        inventoryUnitId
          ? tProducts("no_ingredient_units_defined")
          : tProducts("pls_select_ingredient_unit")
      }
      noDataMessage={tCommon("no_data")}
      table={table}
      data={allUnits}
      isUseinRecipe={isUseinRecipe}
    />
  );
};

export default memo(IngredientUnit);
