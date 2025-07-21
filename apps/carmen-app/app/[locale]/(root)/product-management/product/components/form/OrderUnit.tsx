import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";
import { UnitData, OrderUnitsFormData } from "./unit.type";
import TableUnit from "./TableUnit";
import { filterUnits } from "@/utils/helper";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

export default function OrderUnit({ control, currentMode }: OrderUnitProps) {
    const { token, tenantId } = useAuth();
    const { units } = useUnitQuery({
        token,
        tenantId,
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<UnitData | null>(null);
    const orderUnits = watch("order_units") as OrderUnitsFormData;
    const existingOrderUnits = (orderUnits as OrderUnitsFormData)?.data || [];
    const newOrderUnits = watch("order_units.add") || [];
    const removedOrderUnits = watch("order_units.remove") || [];
    const inventoryUnitId = watch("inventory_unit_id");

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    const filteredUnits = filterUnits({
        units,
        excludedUnitId: inventoryUnitId,
        existingUnits: existingOrderUnits,
        editingId: editingId ?? undefined,
        compareField: 'from_unit_id'
    });

    useEffect(() => {
        const currentAddFields = watch("order_units.add") || [];

        currentAddFields.forEach((field, index) => {
            if (inventoryUnitId && (!field.from_unit_id || field.from_unit_id === "")) {
                setValue(`order_units.add.${index}.from_unit_id`, inventoryUnitId);
            }

            const fromUnitId = field.from_unit_id || inventoryUnitId || "";
            const toUnitId = field.to_unit_id;

            if (fromUnitId && toUnitId) {
                const fromUnitQty = field.from_unit_qty;

                if (fromUnitId === toUnitId) {
                    setValue(`order_units.add.${index}.to_unit_qty`, fromUnitQty);
                } else if (field.to_unit_qty === 0) {
                    setValue(`order_units.add.${index}.to_unit_qty`, 1);
                }
            }
        });
    }, [watch, inventoryUnitId, setValue]);

    const { append: appendOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    const { append: appendOrderUnitUpdate } = useFieldArray({
        control,
        name: "order_units.update"
    });

    const displayOrderUnits = existingOrderUnits.filter(
        (orderUnit: UnitData) => !removedOrderUnits.some(removed => removed.product_order_unit_id === orderUnit.id)
    );

    const hasOrderUnits = displayOrderUnits.length > 0 || newOrderUnits.length > 0;

    const getUnitName = (unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    };

    const handleStartEdit = (orderUnit: UnitData) => {
        setEditingId(orderUnit.id ?? null);
        if (!orderUnit.to_unit_id) {
            const inventoryUnitId = watch("inventory_unit_id");
            if (inventoryUnitId && inventoryUnitId !== orderUnit.from_unit_id) {
                orderUnit = {
                    ...orderUnit,
                    to_unit_id: inventoryUnitId
                };
            }
        }
        setEditForm(orderUnit);
    };

    const handleSaveEdit = (orderUnit: UnitData) => {
        if (!editForm || !orderUnit.id) return;

        const updatedOrderUnit = {
            product_order_unit_id: orderUnit.id,
            from_unit_id: editForm.from_unit_id,
            from_unit_qty: editForm.from_unit_qty,
            to_unit_id: editForm.to_unit_id,
            to_unit_qty: editForm.to_unit_qty,
            description: editForm.description ?? '',
            is_active: editForm.is_active ?? true,
            is_default: editForm.is_default ?? false
        };

        // Update the form state
        const currentOrderUnits = watch("order_units") as OrderUnitsFormData;
        if ((currentOrderUnits as OrderUnitsFormData)?.data) {
            // Update the data array for UI
            const updatedData = (currentOrderUnits as OrderUnitsFormData).data!.map((item: UnitData) =>
                item.id === orderUnit.id
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

            const existingUpdateIndex = (currentOrderUnits as OrderUnitsFormData).update?.findIndex(
                (item) => item.product_order_unit_id === orderUnit.id
            );

            // Create updated order_units object with the correct update array
            const updatedOrderUnits = { ...currentOrderUnits } as OrderUnitsFormData;
            updatedOrderUnits.data = updatedData;

            // If already in update array, replace it; otherwise append it
            if (existingUpdateIndex !== undefined && existingUpdateIndex >= 0) {
                updatedOrderUnits.update = [
                    ...((currentOrderUnits as OrderUnitsFormData).update?.slice(0, existingUpdateIndex) || []),
                    updatedOrderUnit,
                    ...((currentOrderUnits as OrderUnitsFormData).update?.slice(existingUpdateIndex + 1) || [])
                ];
            } else {
                updatedOrderUnits.update = [
                    ...((currentOrderUnits as OrderUnitsFormData).update || []),
                    updatedOrderUnit
                ];
            }

            // Update the form state
            setValue("order_units", updatedOrderUnits);
        } else {
            // Add to update array if data array doesn't exist
            appendOrderUnitUpdate(updatedOrderUnit);
        }

        setEditingId(null);
        setEditForm(null);
    };


    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Units</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                            appendOrderUnit({
                                from_unit_id: "",
                                from_unit_qty: 1,
                                to_unit_id: inventoryUnitId,
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
                        Add Order Unit
                    </Button>
                )}
            </div>

            {hasOrderUnits ? (
                <TableUnit
                    control={control}
                    currentMode={currentMode}
                    unitTitle="Order"
                    displayUnits={displayOrderUnits}
                    editingId={editingId}
                    editForm={editForm}
                    setEditingId={setEditingId}
                    setEditForm={setEditForm}
                    getUnitName={getUnitName}
                    filteredUnits={filteredUnits}
                    handleStartEdit={handleStartEdit}
                    handleSaveEdit={handleSaveEdit}
                    handleRemove={(unitId) => appendOrderUnitRemove({ product_order_unit_id: unitId })}
                    addFieldName="order_units.add"
                    unitFields={orderUnitFields}
                    removeUnit={removeOrderUnit}
                />
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    {!inventoryUnitId ? (
                        <p className="text-gray-500 mb-4">Please select inventory unit first</p>
                    ) : (
                        <p className="text-gray-500 mb-4">No order units defined yet</p>
                    )}
                </div>
            )}
        </Card>
    );
}
