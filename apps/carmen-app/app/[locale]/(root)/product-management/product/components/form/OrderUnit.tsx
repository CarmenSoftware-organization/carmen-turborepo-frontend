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
import { useTranslations } from "next-intl";
import { useUnitManagement } from "./hooks/useUnitManagement";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        params: {
            perpage: -1
        }
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const inventoryUnitId = watch("inventory_unit_id");

    // Use custom hook for unit management
    const {
        displayUnits,
        newUnits,
    } = useUnitManagement({
        unitType: 'order',
        control,
        watch,
        setValue
    });

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

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

    // Handle default change - ensure only one default exists
    const handleDefaultChange = useCallback((index: number, isDataField: boolean, checked: boolean) => {
        if (!checked) return; // Only handle when setting to true

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unitsData = watch('order_units') as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentUpdate = unitsData?.update || [];

        // Update all existing units to false if not the current one
        if (unitsData?.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            unitsData.data.forEach((unit: any, i: number) => {
                if (isDataField && i === index) return; // Skip the current one

                // Set to false in data
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                setValue(`order_units.data.${i}.is_default` as any, false, { shouldDirty: true });

                // Add to update array if not already there
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const existingUpdateIndex = currentUpdate.findIndex(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (u: any) => u.product_order_unit_id === unit.id
                );

                const updatedUnit = {
                    product_order_unit_id: unit.id,
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
                setValue(`order_units.add.${i}.is_default` as any, false, { shouldDirty: true });
            });
        }

        // Set the current one to true
        if (isDataField) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setValue(`order_units.data.${index}.is_default` as any, true, { shouldDirty: true });

            // Add current unit to update array
            const currentUnit = unitsData.data[index];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const existingUpdateIndex = currentUpdate.findIndex(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (u: any) => u.product_order_unit_id === currentUnit.id
            );

            const updatedUnit = {
                product_order_unit_id: currentUnit.id,
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
            setValue(`order_units.add.${index}.is_default` as any, true, { shouldDirty: true });
        }

        // Update the update array
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue('order_units.update' as any, currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);

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
                <h2 className="text-base text-muted-foreground font-semibold">{tProducts("order_unit")}</h2>
                {currentMode !== formType.VIEW && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    onClick={handleAddUnit}
                                    disabled={!inventoryUnitId}
                                    className="w-7 h-7"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tProducts("add_order_unit")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {hasOrderUnits ? (
                <TableUnit
                    control={control}
                    currentMode={currentMode}
                    displayUnits={displayUnits}
                    getUnitName={getUnitName}
                    handleRemove={handleRemoveUnit}
                    addFieldName="order_units.add"
                    unitFields={orderUnitFields}
                    removeUnit={removeOrderUnit}
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
                    ? tProducts("pls_select_order_unit")
                    : tProducts("no_order_units_defined")
                }
            </p>
        </div>
    );
});

EmptyState.displayName = "OrderUnitEmptyState";

export default memo(OrderUnit);
