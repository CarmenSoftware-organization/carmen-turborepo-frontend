import { useState, useCallback, useMemo } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { ProductFormValues } from "../../../pd-schema";
import { UnitData, OrderUnitsFormData, IngredientUnitsFormData } from "../unit.type";

type UnitType = 'order' | 'ingredient';

interface UseUnitManagementProps {
    unitType: UnitType;
    watch: UseFormWatch<ProductFormValues>;
    setValue: UseFormSetValue<ProductFormValues>;
}

export const useUnitManagement = ({ unitType, watch, setValue }: UseUnitManagementProps) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UnitData | null>(null);

    const fieldName = unitType === 'order' ? 'order_units' : 'ingredient_units';
    const idFieldName = unitType === 'order' ? 'product_order_unit_id' : 'product_ingredient_unit_id';

    // Get current units data
    const unitsData = watch(fieldName) as OrderUnitsFormData | IngredientUnitsFormData;
    const existingUnits = useMemo(() => unitsData?.data || [], [unitsData?.data]);
    const newUnits = useMemo(() => watch(`${fieldName}.add`) || [], [watch(`${fieldName}.add`)]);
    const removedUnits = useMemo(() => watch(`${fieldName}.remove`) || [], [watch(`${fieldName}.remove`)]);

    // Display units (filter out removed)
    const displayUnits = useMemo(() =>
        existingUnits.filter((unit: UnitData) =>
            !removedUnits.some((removed: { [key: string]: string }) =>
                removed[idFieldName] === unit.id
            )
        ),
        [existingUnits, removedUnits, idFieldName]
    );

    const handleStartEdit = useCallback((unit: UnitData) => {
        setEditingId(unit.id ?? null);
        const inventoryUnitId = watch("inventory_unit_id");

        if (!unit.to_unit_id && inventoryUnitId && inventoryUnitId !== unit.from_unit_id) {
            setEditForm({
                ...unit,
                to_unit_id: inventoryUnitId
            });
        } else {
            setEditForm(unit);
        }
    }, [watch]);

    const handleSaveEdit = useCallback((unit: UnitData) => {
        if (!editForm || !unit.id) return;

        const updatedUnit = {
            [idFieldName]: unit.id,
            from_unit_id: editForm.from_unit_id,
            from_unit_qty: editForm.from_unit_qty,
            to_unit_id: editForm.to_unit_id,
            to_unit_qty: editForm.to_unit_qty,
            description: editForm.description ?? '',
            is_active: editForm.is_active ?? true,
            is_default: editForm.is_default ?? false
        };

        // Update display data
        const updatedData = existingUnits.map((item: UnitData) =>
            item.id === unit.id
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

        // Check if already in update array
        const currentUpdates = unitsData.update || [];
        const existingUpdateIndex = currentUpdates.findIndex(
            (item) => {
                const itemId = unitType === 'order'
                    ? (item as { product_order_unit_id: string }).product_order_unit_id
                    : (item as { product_ingredient_unit_id: string }).product_ingredient_unit_id;
                return itemId === unit.id;
            }
        );

        const newUpdates = existingUpdateIndex >= 0
            ? [
                ...currentUpdates.slice(0, existingUpdateIndex),
                updatedUnit,
                ...currentUpdates.slice(existingUpdateIndex + 1)
            ]
            : [...currentUpdates, updatedUnit];

        // Update form state
        setValue(fieldName, {
            ...unitsData,
            data: updatedData,
            update: newUpdates
        } as any, {
            shouldValidate: false,
            shouldDirty: true,
            shouldTouch: false
        });

        setEditingId(null);
        setEditForm(null);
    }, [editForm, existingUnits, unitsData, setValue, fieldName, idFieldName]);

    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setEditForm(null);
    }, []);

    return {
        editingId,
        editForm,
        setEditForm,
        displayUnits,
        existingUnits,
        newUnits,
        removedUnits,
        handleStartEdit,
        handleSaveEdit,
        handleCancelEdit,
    };
};
