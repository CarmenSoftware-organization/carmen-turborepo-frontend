import { memo, useEffect, useMemo, useCallback } from "react";
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

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

const OrderUnit = ({ control, currentMode }: OrderUnitProps) => {
    const tProducts = useTranslations("Products");
    const { token, buCode } = useAuth();
    const { units } = useUnitQuery({
        token,
        buCode,
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const inventoryUnitId = watch("inventory_unit_id");

    // Use custom hook for unit management
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
        unitType: 'order',
        watch,
        setValue
    });

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    // Memoize filtered units
    const filteredUnits = useMemo(() => filterUnits({
        units,
        excludedUnitId: inventoryUnitId,
        existingUnits: existingUnits,
        editingId: editingId ?? undefined,
        compareField: 'from_unit_id'
    }), [units, inventoryUnitId, existingUnits, editingId]);

    // Memoize getUnitName
    const getUnitName = useCallback((unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    }, [units]);

    // Initialize from_unit_id when inventory unit changes
    useEffect(() => {
        if (!inventoryUnitId) return;

        newUnits.forEach((field, index) => {
            if (!field.from_unit_id) {
                setValue(`order_units.add.${index}.from_unit_id`, inventoryUnitId);
            }
        });
    }, [inventoryUnitId, newUnits, setValue]);

    // Auto-calculate conversion when units match or initialize to_unit_qty
    useEffect(() => {
        newUnits.forEach((field, index) => {
            const fromUnitId = field.from_unit_id || inventoryUnitId;
            const toUnitId = field.to_unit_id;

            if (!fromUnitId || !toUnitId) return;

            if (fromUnitId === toUnitId) {
                setValue(`order_units.add.${index}.to_unit_qty`, field.from_unit_qty);
            } else if (field.to_unit_qty === 0) {
                setValue(`order_units.add.${index}.to_unit_qty`, 1);
            }
        });
    }, [newUnits, inventoryUnitId, setValue]);

    const { append: appendOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    // Memoize derived state
    const hasOrderUnits = useMemo(
        () => displayUnits.length > 0 || newUnits.length > 0,
        [displayUnits.length, newUnits.length]
    );

    // Memoize handlers
    const handleAddUnit = useCallback(() => {
        appendOrderUnit({
            from_unit_id: "",
            from_unit_qty: 1,
            to_unit_id: inventoryUnitId,
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false
        });
    }, [appendOrderUnit, inventoryUnitId]);

    const handleRemoveUnit = useCallback((unitId: string) => {
        appendOrderUnitRemove({ product_order_unit_id: unitId });
    }, [appendOrderUnitRemove]);

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{tProducts("order_unit")}</h2>
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
                        {tProducts("add_order_unit")}
                    </Button>
                )}
            </div>

            {hasOrderUnits ? (
                <TableUnit
                    control={control}
                    currentMode={currentMode}
                    unitTitle={tProducts("order_unit")}
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
                    addFieldName="order_units.add"
                    unitFields={orderUnitFields}
                    removeUnit={removeOrderUnit}
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
                    ? tProducts("pls_select_order_unit")
                    : tProducts("no_order_units_defined")
                }
            </p>
        </div>
    );
});

EmptyState.displayName = "OrderUnitEmptyState";

export default memo(OrderUnit);
