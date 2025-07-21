import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";
import { UnitData, IngredientUnitsFormData } from "./unit.type";
import TableUnit from "./TableUnit";

interface IngredientUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}



export default function IngredientUnit({ control, currentMode }: IngredientUnitProps) {
    const { token, tenantId } = useAuth();
    const { units } = useUnitQuery({
        token,
        tenantId,
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UnitData | null>(null);
    const ingredientUnits = watch("ingredient_units") as unknown as IngredientUnitsFormData;
    const existingIngredientUnits = ingredientUnits?.data || [];
    const removedIngredientUnits = watch("ingredient_units.remove") || [];
    const inventoryUnitId = watch("inventory_unit_id");

    const filteredUnits: UnitDto[] = units
        ?.data?.filter((unit: UnitDto) => !!unit.id)
        ?.filter((unit: UnitDto) => {
            if (unit.id === inventoryUnitId) return false;
            const otherIngredientUnits = existingIngredientUnits.filter(iu =>
                iu.id !== editingId
            );
            const existingToUnitIds = otherIngredientUnits.map(iu => iu.to_unit_id || "");
            return !existingToUnitIds.includes(unit.id ?? "");
        }) as UnitDto[];

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    const { append: appendIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    const { append: appendIngredientUnitUpdate } = useFieldArray({
        control,
        name: "ingredient_units.update"
    });

    // Filter out removed ingredient units
    const displayIngredientUnits = existingIngredientUnits.filter(
        ingredientUnit => !removedIngredientUnits.some(removed => removed.product_ingredient_unit_id === ingredientUnit.id)
    );

    const hasIngredientUnits = displayIngredientUnits.length > 0 || ingredientUnitFields.length > 0;

    const getUnitName = (unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    };

    const handleStartEdit = (ingredientUnit: UnitData) => {
        setEditingId(ingredientUnit.id ?? null);
        setEditForm(ingredientUnit);
    };

    const handleSaveEdit = (ingredientUnit: UnitData) => {
        if (!editForm || !ingredientUnit.id) return;

        const updatedIngredientUnit = {
            product_ingredient_unit_id: ingredientUnit.id,
            from_unit_id: editForm.from_unit_id,
            from_unit_qty: editForm.from_unit_qty,
            to_unit_id: editForm.to_unit_id,
            to_unit_qty: editForm.to_unit_qty,
            description: editForm.description ?? '',
            is_active: editForm.is_active ?? true,
            is_default: editForm.is_default ?? false
        };

        // Update the form state
        const currentIngredientUnits = watch("ingredient_units") as unknown as IngredientUnitsFormData;
        if (currentIngredientUnits?.data) {
            // Update the data array for UI
            const updatedData = currentIngredientUnits.data.map((item: UnitData) =>
                item.id === ingredientUnit.id
                    ? {
                        ...item,
                        from_unit_id: editForm.from_unit_id,
                        from_unit_qty: editForm.from_unit_qty,
                        to_unit_id: editForm.to_unit_id,
                        to_unit_qty: editForm.to_unit_qty,
                        description: editForm.description ?? '',
                        is_active: editForm.is_active ?? true,
                        is_default: editForm.is_default ?? false
                    }
                    : item
            );

            // Keep the complete data structure for local use
            const updatedIngredientUnits = {
                ...currentIngredientUnits,
                data: updatedData,
                update: [...(currentIngredientUnits.update || []), updatedIngredientUnit]
            };

            // Update the form state while preserving the data property
            setValue("ingredient_units", updatedIngredientUnits);
        } else {
            // Add to update array if data array doesn't exist
            appendIngredientUnitUpdate(updatedIngredientUnit);
        }

        setEditingId(null);
        setEditForm(null);
    };


    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ingredient Units</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                            appendIngredientUnit({
                                from_unit_id: inventoryUnitId,
                                from_unit_qty: 1,
                                to_unit_id: "",
                                to_unit_qty: 1,
                                description: "",
                                is_active: true,
                                is_default: false
                            });
                        }}
                        className="flex items-center gap-1.5 px-3"
                        disabled={!inventoryUnitId}
                    >
                        <Plus className="h-4 w-4" />
                        Add Ingredient Unit
                    </Button>
                )}
            </div>

            {hasIngredientUnits ? (
                <TableUnit
                    control={control}
                    currentMode={currentMode}
                    unitTitle="Ingredient"
                    displayUnits={displayIngredientUnits}
                    editingId={editingId}
                    editForm={editForm}
                    setEditingId={setEditingId}
                    setEditForm={setEditForm}
                    getUnitName={getUnitName}
                    filteredUnits={filteredUnits}
                    handleStartEdit={handleStartEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleRemove={(unitId) => appendIngredientUnitRemove({ product_ingredient_unit_id: unitId })}
                    addFieldName="ingredient_units.add"
                    unitFields={ingredientUnitFields}
                    removeUnit={removeIngredientUnit}
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    {!inventoryUnitId ? (
                        <p className="text-gray-500 mb-4">Please select inventory unit first</p>
                    ) : (
                        <p className="text-gray-500 mb-4">No ingredient units defined yet</p>
                    )}
                </div>
            )}
        </Card>
    );
}
