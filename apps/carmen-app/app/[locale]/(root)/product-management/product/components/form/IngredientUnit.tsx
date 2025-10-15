import { memo, useMemo, useCallback } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";
import TableUnit from "./TableUnit";
import { useTranslations } from "next-intl";
import { useUnitManagement } from "./hooks/useUnitManagement";

interface IngredientUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

const IngredientUnit = ({ control, currentMode }: IngredientUnitProps) => {
    const tProducts = useTranslations("Products");
    const { token, buCode } = useAuth();
    const { units } = useUnitQuery({
        token,
        buCode,
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const inventoryUnitId = watch("inventory_unit_id");

    // Use shared hook for unit management
    const {
        displayUnits,
        newUnits,
    } = useUnitManagement({
        unitType: 'ingredient',
        control,
        watch,
        setValue
    });

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    // Memoize getUnitName
    const getUnitName = useCallback((unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    }, [units]);

    const { append: appendIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    // Memoize derived state
    const hasIngredientUnits = useMemo(
        () => displayUnits.length > 0 || newUnits.length > 0,
        [displayUnits.length, newUnits.length]
    );

    // Memoize handlers
    const handleAddUnit = useCallback(() => {
        appendIngredientUnit({
            from_unit_id: inventoryUnitId,
            from_unit_qty: 1,
            to_unit_id: "",
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false
        });
    }, [appendIngredientUnit, inventoryUnitId]);

    const handleRemoveUnit = useCallback((unitId: string) => {
        appendIngredientUnitRemove({ product_ingredient_unit_id: unitId });
    }, [appendIngredientUnitRemove]);

    // Handle default change - ensure only one default exists
    const handleDefaultChange = useCallback((index: number, isDataField: boolean, checked: boolean) => {
        if (!checked) return; // Only handle when setting to true

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unitsData = watch('ingredient_units') as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUpdate = unitsData?.update || [];

        // Update all existing units to false if not the current one
        if (unitsData?.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unitsData.data.forEach((unit: any, i: number) => {
                if (isDataField && i === index) return; // Skip the current one

                // Set to false in data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValue(`ingredient_units.data.${i}.is_default` as any, false, { shouldDirty: true });

                // Add to update array if not already there
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const existingUpdateIndex = currentUpdate.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (u: any) => u.product_ingredient_unit_id === unit.id
                );

                const updatedUnit = {
                    product_ingredient_unit_id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                    description: unit.description || '',
                    is_active: unit.is_active ?? true,
                    is_default: false
                };

                if (existingUpdateIndex >= 0) {
                    currentUpdate[existingUpdateIndex] = updatedUnit;
                } else {
                    currentUpdate.push(updatedUnit);
                }
            });
        }

        // Update all new units to false if not the current one
        if (unitsData?.add) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unitsData.add.forEach((_: any, i: number) => {
                if (!isDataField && i === index) return;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValue(`ingredient_units.add.${i}.is_default` as any, false, { shouldDirty: true });
            });
        }

        // Set the current one to true
        if (isDataField) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue(`ingredient_units.data.${index}.is_default` as any, true, { shouldDirty: true });

            // Add current unit to update array
            const currentUnit = unitsData.data[index];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingUpdateIndex = currentUpdate.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (u: any) => u.product_ingredient_unit_id === currentUnit.id
            );

            const updatedUnit = {
                product_ingredient_unit_id: currentUnit.id,
                from_unit_id: currentUnit.from_unit_id,
                from_unit_qty: currentUnit.from_unit_qty,
                to_unit_id: currentUnit.to_unit_id,
                to_unit_qty: currentUnit.to_unit_qty,
                description: currentUnit.description || '',
                is_active: currentUnit.is_active ?? true,
                is_default: true
            };

            if (existingUpdateIndex >= 0) {
                currentUpdate[existingUpdateIndex] = updatedUnit;
            } else {
                currentUpdate.push(updatedUnit);
            }
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue(`ingredient_units.add.${index}.is_default` as any, true, { shouldDirty: true });
        }

        // Update the update array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue('ingredient_units.update' as any, currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{tProducts("ingredient_unit")}</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="outlinePrimary"
                        size="sm"
                        onClick={handleAddUnit}
                        className="flex items-center gap-1.5 px-3"
                        disabled={!inventoryUnitId}
                    >
                        <Plus className="h-4 w-4" />
                        {tProducts("add_ingredient_unit")}
                    </Button>
                )}
            </div>

            {hasIngredientUnits ? (
                <TableUnit
                    control={control}
                    currentMode={currentMode}
                    displayUnits={displayUnits}
                    getUnitName={getUnitName}
                    handleRemove={handleRemoveUnit}
                    addFieldName="ingredient_units.add"
                    unitFields={ingredientUnitFields}
                    removeUnit={removeIngredientUnit}
                    inventoryUnitId={inventoryUnitId}
                    handleDefaultChange={handleDefaultChange}
                />
            ) : (
                <EmptyState inventoryUnitId={inventoryUnitId} />
            )}
        </Card>
    );
};

// Extract empty state component for better readability
const EmptyState = memo(({ inventoryUnitId }: { inventoryUnitId?: string }) => {
    const tProducts = useTranslations("Products");

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <p className="text-gray-500 mb-4">
                {!inventoryUnitId
                    ? tProducts("pls_select_ingredient_unit")
                    : tProducts("no_ingredient_units_defined")
                }
            </p>
        </div>
    );
});

EmptyState.displayName = "IngredientUnitEmptyState";

export default memo(IngredientUnit);
