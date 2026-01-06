import { useCallback } from "react";
import { Control, useFieldArray, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { UnitDto, UnitData, UnitFormData } from "@/dtos/unit.dto";
import { ProductFormValues } from "@/dtos/product.dto";

type UnitType = "order" | "ingredient";

interface OrderUnitUpdate {
  product_order_unit_id: string;
  from_unit_id: string;
  from_unit_qty: number;
  to_unit_id: string;
  to_unit_qty: number;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

interface IngredientUnitUpdate {
  product_ingredient_unit_id: string;
  from_unit_id: string;
  from_unit_qty: number;
  to_unit_id: string;
  to_unit_qty: number;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

interface UseUnitFormProps {
  unitType: UnitType;
  control: Control<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  setValue: UseFormSetValue<ProductFormValues>;
  units: { data: UnitDto[] } | undefined;
  displayUnits: UnitData[];
  inventoryUnitId: string;
}

interface UseUnitFormReturn {
  fields: UnitFormData[];
  prependUnit: (unit: UnitFormData) => void;
  removeUnit: (index: number) => void;
  getUnitName: (unitId: string) => string;
  getAvailableUnits: (currentUnitId?: string) => UnitDto[];
  handleDefaultChange: (index: number, isDataField: boolean, checked: boolean) => void;
  handleFieldChange: (
    dataIndex: number,
    field: "from_unit_id" | "from_unit_qty" | "to_unit_id" | "to_unit_qty",
    value: string | number
  ) => void;
  handleAddUnit: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  handleRemoveUnit: (unitId: string) => void;
}

export const useUnitForm = ({
  unitType,
  control,
  watch,
  setValue,
  units,
  displayUnits,
  inventoryUnitId,
}: UseUnitFormProps): UseUnitFormReturn => {
  const isOrderUnit = unitType === "order";

  const {
    fields,
    prepend: prependUnit,
    remove: removeUnit,
  } = useFieldArray({
    control,
    name: isOrderUnit ? "order_units.add" : "ingredient_units.add",
  });

  const { append: appendOrderRemove } = useFieldArray({
    control,
    name: "order_units.remove",
  });

  const { append: appendIngredientRemove } = useFieldArray({
    control,
    name: "ingredient_units.remove",
  });

  const getUnitName = useCallback(
    (unitId: string) => {
      return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? "-";
    },
    [units]
  );

  const getAvailableUnits = useCallback(
    (currentUnitId?: string) => {
      if (!units?.data) return [];

      const usedUnitIds = new Set<string>();

      displayUnits.forEach((unit: UnitData) => {
        if (unit.from_unit_id) {
          usedUnitIds.add(unit.from_unit_id);
        }
        if (unit.to_unit_id) {
          usedUnitIds.add(unit.to_unit_id);
        }
      });

      fields.forEach((field) => {
        if (field.from_unit_id) {
          usedUnitIds.add(field.from_unit_id);
        }
        if (field.to_unit_id) {
          usedUnitIds.add(field.to_unit_id);
        }
      });

      return units.data.filter(
        (unit: UnitDto) => !usedUnitIds.has(unit.id) || unit.id === currentUnitId
      );
    },
    [units, displayUnits, fields]
  );

  const createOrderUnitUpdate = (
    unitId: string,
    unit: {
      from_unit_id: string;
      from_unit_qty: number;
      to_unit_id: string;
      to_unit_qty: number;
      description?: string;
      is_active?: boolean;
    },
    isDefault: boolean
  ): OrderUnitUpdate => ({
    product_order_unit_id: unitId,
    from_unit_id: unit.from_unit_id,
    from_unit_qty: unit.from_unit_qty,
    to_unit_id: unit.to_unit_id,
    to_unit_qty: unit.to_unit_qty,
    description: unit.description || "",
    is_active: unit.is_active ?? true,
    is_default: isDefault,
  });

  const createIngredientUnitUpdate = (
    unitId: string,
    unit: {
      from_unit_id: string;
      from_unit_qty: number;
      to_unit_id: string;
      to_unit_qty: number;
      description?: string;
      is_active?: boolean;
    },
    isDefault: boolean
  ): IngredientUnitUpdate => ({
    product_ingredient_unit_id: unitId,
    from_unit_id: unit.from_unit_id,
    from_unit_qty: unit.from_unit_qty,
    to_unit_id: unit.to_unit_id,
    to_unit_qty: unit.to_unit_qty,
    description: unit.description || "",
    is_active: unit.is_active ?? true,
    is_default: isDefault,
  });

  const handleDefaultChange = useCallback(
    (index: number, isDataField: boolean, checked: boolean) => {
      if (!checked) return;

      if (isOrderUnit) {
        const unitsData = watch("order_units");
        const currentUpdate = [...(unitsData?.update || [])];

        if (unitsData?.data) {
          unitsData.data.forEach((unit, i: number) => {
            if (isDataField && i === index) return;

            setValue(`order_units.data.${i}.is_default`, false, { shouldDirty: true });

            const existingUpdateIndex = currentUpdate.findIndex(
              (u) => u.product_order_unit_id === unit.id
            );

            const updatedUnit = createOrderUnitUpdate(unit.id!, unit, false);

            if (existingUpdateIndex >= 0) {
              currentUpdate[existingUpdateIndex] = updatedUnit;
            } else {
              currentUpdate.push(updatedUnit);
            }
          });
        }

        if (unitsData?.add) {
          unitsData.add.forEach((_, i: number) => {
            if (!isDataField && i === index) return;
            setValue(`order_units.add.${i}.is_default`, false, { shouldDirty: true });
          });
        }

        if (isDataField && unitsData?.data) {
          setValue(`order_units.data.${index}.is_default`, true, { shouldDirty: true });

          const currentUnit = unitsData.data[index];
          const existingUpdateIndex = currentUpdate.findIndex(
            (u) => u.product_order_unit_id === currentUnit.id
          );

          const updatedUnit = createOrderUnitUpdate(currentUnit.id!, currentUnit, true);

          if (existingUpdateIndex >= 0) {
            currentUpdate[existingUpdateIndex] = updatedUnit;
          } else {
            currentUpdate.push(updatedUnit);
          }
        } else {
          setValue(`order_units.add.${index}.is_default`, true, { shouldDirty: true });
        }

        setValue("order_units.update", currentUpdate, { shouldDirty: true });
      } else {
        const unitsData = watch("ingredient_units");
        const currentUpdate = [...(unitsData?.update || [])];

        if (unitsData?.data) {
          unitsData.data.forEach((unit, i: number) => {
            if (isDataField && i === index) return;

            setValue(`ingredient_units.data.${i}.is_default`, false, { shouldDirty: true });

            const existingUpdateIndex = currentUpdate.findIndex(
              (u) => u.product_ingredient_unit_id === unit.id
            );

            const updatedUnit = createIngredientUnitUpdate(unit.id!, unit, false);

            if (existingUpdateIndex >= 0) {
              currentUpdate[existingUpdateIndex] = updatedUnit;
            } else {
              currentUpdate.push(updatedUnit);
            }
          });
        }

        if (unitsData?.add) {
          unitsData.add.forEach((_, i: number) => {
            if (!isDataField && i === index) return;
            setValue(`ingredient_units.add.${i}.is_default`, false, { shouldDirty: true });
          });
        }

        if (isDataField && unitsData?.data) {
          setValue(`ingredient_units.data.${index}.is_default`, true, { shouldDirty: true });

          const currentUnit = unitsData.data[index];
          const existingUpdateIndex = currentUpdate.findIndex(
            (u) => u.product_ingredient_unit_id === currentUnit.id
          );

          const updatedUnit = createIngredientUnitUpdate(currentUnit.id!, currentUnit, true);

          if (existingUpdateIndex >= 0) {
            currentUpdate[existingUpdateIndex] = updatedUnit;
          } else {
            currentUpdate.push(updatedUnit);
          }
        } else {
          setValue(`ingredient_units.add.${index}.is_default`, true, { shouldDirty: true });
        }

        setValue("ingredient_units.update", currentUpdate, { shouldDirty: true });
      }
    },
    [watch, setValue, isOrderUnit]
  );

  const handleFieldChange = useCallback(
    (
      dataIndex: number,
      field: "from_unit_id" | "from_unit_qty" | "to_unit_id" | "to_unit_qty",
      value: string | number
    ) => {
      if (isOrderUnit) {
        const unitsData = watch("order_units");
        if (!unitsData?.data || !unitsData.data[dataIndex]) return;

        const currentUnit = unitsData.data[dataIndex];
        const currentUpdate = [...(unitsData?.update || [])];

        const existingUpdateIndex = currentUpdate.findIndex(
          (u) => u.product_order_unit_id === currentUnit.id
        );

        const updatedUnit: OrderUnitUpdate = {
          product_order_unit_id: currentUnit.id!,
          from_unit_id: field === "from_unit_id" ? (value as string) : currentUnit.from_unit_id,
          from_unit_qty: field === "from_unit_qty" ? (value as number) : currentUnit.from_unit_qty,
          to_unit_id: field === "to_unit_id" ? (value as string) : currentUnit.to_unit_id,
          to_unit_qty: field === "to_unit_qty" ? (value as number) : currentUnit.to_unit_qty,
          description: currentUnit.description || "",
          is_active: currentUnit.is_active ?? true,
          is_default: currentUnit.is_default ?? false,
        };

        if (existingUpdateIndex >= 0) {
          currentUpdate[existingUpdateIndex] = updatedUnit;
        } else {
          currentUpdate.push(updatedUnit);
        }

        setValue("order_units.update", currentUpdate, { shouldDirty: true });
      } else {
        const unitsData = watch("ingredient_units");
        if (!unitsData?.data || !unitsData.data[dataIndex]) return;

        const currentUnit = unitsData.data[dataIndex];
        const currentUpdate = [...(unitsData?.update || [])];

        const existingUpdateIndex = currentUpdate.findIndex(
          (u) => u.product_ingredient_unit_id === currentUnit.id
        );

        const updatedUnit: IngredientUnitUpdate = {
          product_ingredient_unit_id: currentUnit.id!,
          from_unit_id: field === "from_unit_id" ? (value as string) : currentUnit.from_unit_id,
          from_unit_qty: field === "from_unit_qty" ? (value as number) : currentUnit.from_unit_qty,
          to_unit_id: field === "to_unit_id" ? (value as string) : currentUnit.to_unit_id,
          to_unit_qty: field === "to_unit_qty" ? (value as number) : currentUnit.to_unit_qty,
          description: currentUnit.description || "",
          is_active: currentUnit.is_active ?? true,
          is_default: currentUnit.is_default ?? false,
        };

        if (existingUpdateIndex >= 0) {
          currentUpdate[existingUpdateIndex] = updatedUnit;
        } else {
          currentUpdate.push(updatedUnit);
        }

        setValue("ingredient_units.update", currentUpdate, { shouldDirty: true });
      }
    },
    [watch, setValue, isOrderUnit]
  );

  const handleAddUnit = useCallback(
    (e?: React.MouseEvent<HTMLButtonElement>) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }

      const newUnit: UnitFormData = isOrderUnit
        ? {
            from_unit_id: "",
            from_unit_qty: 1,
            to_unit_id: inventoryUnitId,
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false,
          }
        : {
            from_unit_id: inventoryUnitId,
            from_unit_qty: 1,
            to_unit_id: "",
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false,
          };

      prependUnit(newUnit);
    },
    [prependUnit, inventoryUnitId, isOrderUnit]
  );

  const handleRemoveUnit = useCallback(
    (unitId: string) => {
      if (isOrderUnit) {
        appendOrderRemove({ product_order_unit_id: unitId });
      } else {
        appendIngredientRemove({ product_ingredient_unit_id: unitId });
      }
    },
    [appendOrderRemove, appendIngredientRemove, isOrderUnit]
  );

  return {
    fields: fields as UnitFormData[],
    prependUnit,
    removeUnit,
    getUnitName,
    getAvailableUnits,
    handleDefaultChange,
    handleFieldChange,
    handleAddUnit,
    handleRemoveUnit,
  };
};
