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
import { filterUnits } from "@/utils/helper";
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
        editingId,
        editForm,
        setEditForm,
        displayUnits,
        existingUnits,
        newUnits,
        handleStartEdit,
        handleSaveEdit,
    } = useUnitManagement({
        unitType: 'ingredient',
        watch,
        setValue
    });

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    // Memoize filtered units
    const filteredUnits = useMemo(() => filterUnits({
        units,
        excludedUnitId: inventoryUnitId,
        existingUnits: existingUnits,
        editingId: editingId ?? undefined,
        compareField: 'to_unit_id'
    }), [units, inventoryUnitId, existingUnits, editingId]);

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
                    unitTitle={tProducts("ingredient_unit")}
                    displayUnits={displayUnits}
                    editingId={editingId}
                    editForm={editForm}
                    setEditingId={() => { }} // Not used anymore - handled in hook
                    setEditForm={setEditForm}
                    getUnitName={getUnitName}
                    filteredUnits={filteredUnits}
                    handleStartEdit={handleStartEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleRemove={handleRemoveUnit}
                    addFieldName="ingredient_units.add"
                    unitFields={ingredientUnitFields}
                    removeUnit={removeIngredientUnit}
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
