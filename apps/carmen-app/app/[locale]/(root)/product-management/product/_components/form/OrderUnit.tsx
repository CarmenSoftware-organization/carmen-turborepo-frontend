import { memo, useEffect, useMemo, useCallback, useRef, FC } from "react";
import { Control, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto, UnitRow, UnitFormData, UnitData } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { useUnitManagement } from "./hooks/useUnitManagement";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ProductFormValues } from "@/dtos/product.dto";
import UnitCombobox from "@/components/lookup/UnitCombobox";
import ConversionPreview from "@/components/ConversionPreview";
import NumberInput from "@/components/form-custom/NumberInput";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

// Component to watch and display conversion preview with real-time updates
interface ConversionPreviewWatcherProps {
    control: Control<ProductFormValues>;
    unit: UnitRow;
    getUnitName: (unitId: string) => string;
}

const ConversionPreviewWatcher: FC<ConversionPreviewWatcherProps> = ({ control, unit, getUnitName }) => {
    const fromUnitId = useWatch({
        control,
        name: unit.isNew
            ? `order_units.add.${unit.fieldIndex}.from_unit_id` as `order_units.add.${number}.from_unit_id`
            : `order_units.data.${unit.dataIndex}.from_unit_id` as `order_units.data.${number}.from_unit_id`,
        defaultValue: unit.from_unit_id
    });

    const toUnitId = useWatch({
        control,
        name: unit.isNew
            ? `order_units.add.${unit.fieldIndex}.to_unit_id` as `order_units.add.${number}.to_unit_id`
            : `order_units.data.${unit.dataIndex}.to_unit_id` as `order_units.data.${number}.to_unit_id`,
        defaultValue: unit.to_unit_id
    });

    const fromUnitQty = useWatch({
        control,
        name: unit.isNew
            ? `order_units.add.${unit.fieldIndex}.from_unit_qty` as `order_units.add.${number}.from_unit_qty`
            : `order_units.data.${unit.dataIndex}.from_unit_qty` as `order_units.data.${number}.from_unit_qty`,
        defaultValue: unit.from_unit_qty
    });

    const toUnitQty = useWatch({
        control,
        name: unit.isNew
            ? `order_units.add.${unit.fieldIndex}.to_unit_qty` as `order_units.add.${number}.to_unit_qty`
            : `order_units.data.${unit.dataIndex}.to_unit_qty` as `order_units.data.${number}.to_unit_qty`,
        defaultValue: unit.to_unit_qty || 1
    });

    if (fromUnitId && toUnitId) {
        return (
            <ConversionPreview
                fromUnitId={fromUnitId as string}
                toUnitId={toUnitId as string}
                fromUnitQty={fromUnitQty as number}
                toUnitQty={toUnitQty as number}
                getUnitName={getUnitName}
            />
        );
    }
    return null;
};

const OrderUnit = ({ control, currentMode }: OrderUnitProps) => {
    const tProducts = useTranslations("Products");
    const tCommon = useTranslations("Common");
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

    const {
        displayUnits,
        newUnits,
    } = useUnitManagement({
        unitType: 'order',
        control,
        watch,
        setValue
    });

    // Get updated unit IDs to check which rows are being edited
    const updatedUnits = watch("order_units.update") || [];
    const updatedUnitIds = useMemo(() => {
        return new Set(updatedUnits.map(u => u.product_order_unit_id));
    }, [updatedUnits]);

    // Helper function to get row background color
    const getRowBgClass = useCallback((unit: UnitRow) => {
        if (unit.isNew) return 'bg-green-50';
        if (!unit.isNew && unit.id && updatedUnitIds.has(unit.id) && currentMode === formType.EDIT) {
            return 'bg-amber-50';
        }
        return '';
    }, [updatedUnitIds, currentMode]);

    const { fields: orderUnitFields, prepend: prependOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    const getUnitName = useCallback((unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    }, [units]);

    const isInitializingRef = useRef(false);
    const previousLengthRef = useRef(newUnits.length);

    useEffect(() => {
        if (!inventoryUnitId || isInitializingRef.current) return;
        if (previousLengthRef.current === newUnits.length) return;

        isInitializingRef.current = true;

        newUnits.forEach((field: UnitFormData, index: number) => {
            if (!field.from_unit_id) {
                setValue(`order_units.add.${index}.from_unit_id`, inventoryUnitId, { shouldDirty: false });
            }
        });

        previousLengthRef.current = newUnits.length;

        setTimeout(() => {
            isInitializingRef.current = false;
        }, 0);
    }, [inventoryUnitId, newUnits.length, setValue]);

    useEffect(() => {
        if (isInitializingRef.current) return;

        newUnits.forEach((field: UnitFormData, index: number) => {
            const fromUnitId = field.from_unit_id || inventoryUnitId;
            const toUnitId = field.to_unit_id;

            if (!fromUnitId || !toUnitId) return;

            if (fromUnitId === toUnitId && field.to_unit_qty !== field.from_unit_qty) {
                setValue(`order_units.add.${index}.to_unit_qty`, field.from_unit_qty, { shouldDirty: false });
            } else if (field.to_unit_qty === 0) {
                setValue(`order_units.add.${index}.to_unit_qty`, 1, { shouldDirty: false });
            }
        });
    }, [newUnits.length, inventoryUnitId, setValue]);

    const { append: appendOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    const hasOrderUnits = useMemo(
        () => displayUnits.length > 0 || newUnits.length > 0,
        [displayUnits.length, newUnits.length]
    );

    const handleDefaultChange = useCallback((index: number, isDataField: boolean, checked: boolean) => {
        if (!checked) return;

        const unitsData = watch('order_units');

        const currentUpdate = unitsData?.update || [];

        if (unitsData?.data) {
            unitsData.data.forEach((unit, i: number) => {
                if (isDataField && i === index) return; // Skip the current one
                setValue(`order_units.data.${i}.is_default` as `order_units.data.${number}.is_default`, false, { shouldDirty: true });
                const existingUpdateIndex = currentUpdate.findIndex(
                    (u) => u.product_order_unit_id === unit.id
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

        if (unitsData?.add) {
            unitsData.add.forEach((_, i: number) => {
                if (!isDataField && i === index) return;
                setValue(`order_units.add.${i}.is_default` as `order_units.add.${number}.is_default`, false, { shouldDirty: true });
            });
        }
        if (isDataField && unitsData?.data) {
            setValue(`order_units.data.${index}.is_default` as `order_units.data.${number}.is_default`, true, { shouldDirty: true });
            const currentUnit = unitsData.data[index];
            const existingUpdateIndex = currentUpdate.findIndex(
                (u) => u.product_order_unit_id === currentUnit.id
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
            setValue(`order_units.add.${index}.is_default` as `order_units.add.${number}.is_default`, true, { shouldDirty: true });
        }
        setValue('order_units.update', currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);

    const handleAddUnit = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        prependOrderUnit({
            from_unit_id: inventoryUnitId,
            from_unit_qty: 1,
            to_unit_id: inventoryUnitId,
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false
        });
    }, [prependOrderUnit, inventoryUnitId]);

    const handleRemoveUnit = useCallback((unitId: string) => {
        appendOrderUnitRemove({ product_order_unit_id: unitId });
    }, [appendOrderUnitRemove]);

    // Handler to sync data field changes to update array
    const handleFieldChange = useCallback((
        dataIndex: number,
        field: 'from_unit_id' | 'from_unit_qty' | 'to_unit_id' | 'to_unit_qty',
        value: string | number
    ) => {
        const unitsData = watch('order_units');
        if (!unitsData?.data || !unitsData.data[dataIndex]) return;

        const currentUnit = unitsData.data[dataIndex];
        const currentUpdate = unitsData?.update || [];

        // Find if this unit is already in update array
        const existingUpdateIndex = currentUpdate.findIndex(
            (u) => u.product_order_unit_id === currentUnit.id
        );

        const updatedUnit = {
            product_order_unit_id: currentUnit.id,
            from_unit_id: field === 'from_unit_id' ? value as string : currentUnit.from_unit_id,
            from_unit_qty: field === 'from_unit_qty' ? value as number : currentUnit.from_unit_qty,
            to_unit_id: field === 'to_unit_id' ? value as string : currentUnit.to_unit_id,
            to_unit_qty: field === 'to_unit_qty' ? value as number : currentUnit.to_unit_qty,
            description: currentUnit.description || '',
            is_active: currentUnit.is_active ?? true,
            is_default: currentUnit.is_default ?? false
        };

        if (existingUpdateIndex >= 0) {
            currentUpdate[existingUpdateIndex] = updatedUnit;
        } else {
            currentUpdate.push(updatedUnit);
        }

        setValue('order_units.update', currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);

    // Filter available units - exclude units that are already used
    const getAvailableUnits = useCallback((currentUnitId?: string) => {
        if (!units?.data) return [];

        // Get all used unit IDs from both existing data and new fields
        const usedUnitIds = new Set<string>();

        // Add units from existing data (displayUnits)
        displayUnits.forEach((unit: UnitData) => {
            if (unit.from_unit_id) {
                usedUnitIds.add(unit.from_unit_id);
            }
        });

        // Add units from new fields (orderUnitFields)
        orderUnitFields.forEach((field) => {
            if (field.from_unit_id) {
                usedUnitIds.add(field.from_unit_id);
            }
        });

        // Filter units: include if not used OR if it's the current unit being edited
        return units.data.filter((unit: UnitDto) =>
            !usedUnitIds.has(unit.id) || unit.id === currentUnitId
        );
    }, [units, displayUnits, orderUnitFields]);

    // Table logic
    const inventoryUnitName = inventoryUnitId ? getUnitName(inventoryUnitId) : '';

    const allUnits: UnitRow[] = useMemo(() => [
        ...orderUnitFields.map((field, index) => ({
            ...field,
            to_unit_id: field.to_unit_id || "",
            to_unit_qty: field.to_unit_qty || 1,
            is_default: field.is_default || false,
            description: "",
            is_active: true,
            isNew: true,
            fieldIndex: index
        })),
        ...displayUnits.map((unit: UnitData, index: number) => ({ ...unit, isNew: false, dataIndex: index }))
    ], [displayUnits, orderUnitFields]);

    const columns = useMemo<ColumnDef<UnitRow>[]>(
        () => [
            {
                accessorKey: "from_unit",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("order_unit")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    if (unit.isNew) {
                        const availableUnits = getAvailableUnits(unit.from_unit_id);
                        return (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={unit.from_unit_qty}
                                    min={0}
                                    step={0}
                                    disabled
                                    className="w-16 h-7 text-right bg-muted cursor-not-allowed"
                                />
                                <FormField
                                    control={control}
                                    name={`order_units.add.${unit.fieldIndex!}.from_unit_id` as `order_units.add.${number}.from_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitCombobox
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    availableUnits={availableUnits}
                                                    disabled={currentMode === formType.VIEW}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        );
                    }

                    if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
                        const availableUnits = getAvailableUnits(unit.from_unit_id);
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`order_units.data.${unit.dataIndex}.from_unit_qty` as `order_units.data.${number}.from_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(unit.dataIndex!, 'from_unit_qty', value);
                                                    }}
                                                    min={0}
                                                    step={0}
                                                    disabled
                                                    classNames="w-16 h-7 bg-muted cursor-not-allowed"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`order_units.data.${unit.dataIndex}.from_unit_id` as `order_units.data.${number}.from_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitCombobox
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(unit.dataIndex!, 'from_unit_id', value);
                                                    }}
                                                    availableUnits={availableUnits}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        );
                    }
                    return (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{unit.from_unit_qty}</span>
                            <span>{unit.from_unit_name || getUnitName(unit.from_unit_id)}</span>
                        </div>
                    );
                },
                enableSorting: false,
                size: 180,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                accessorKey: "to_unit",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("to_inventory_unit")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;

                    if (unit.isNew) {
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`order_units.add.${unit.fieldIndex!}.to_unit_qty` as `order_units.add.${number}.to_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    min={1}
                                                    step={1}
                                                    classNames="w-16 h-7"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`order_units.add.${unit.fieldIndex!}.to_unit_id` as `order_units.add.${number}.to_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input
                                                    className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                                                    value={getUnitName(field.value)}
                                                    disabled
                                                    readOnly
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        );
                    }

                    if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`order_units.data.${unit.dataIndex}.to_unit_qty` as `order_units.data.${number}.to_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(unit.dataIndex!, 'to_unit_qty', value);
                                                    }}
                                                    min={1}
                                                    step={1}
                                                    classNames="w-16 h-7"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Input
                                    className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                                    value={getUnitName(unit.to_unit_id)}
                                    disabled
                                    readOnly
                                />
                            </div>
                        );
                    }
                    return (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="font-medium">{unit.to_unit_qty}</span>
                            <span>{unit.to_unit_name || getUnitName(unit.to_unit_id)}</span>
                        </div>
                    );
                },
                enableSorting: false,
                size: 180,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            {
                accessorKey: "is_default",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("default")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    

                    if (unit.isNew) {
                        return (
                            <div className="flex justify-center">
                                <FormField
                                    control={control}
                                    name={`order_units.add.${unit.fieldIndex!}.is_default` as `order_units.add.${number}.is_default`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        handleDefaultChange(unit.fieldIndex!, false, checked as boolean);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        );
                    }

                    if (currentMode === formType.EDIT && unit.dataIndex !== undefined) {
                        return (
                            <div className="flex justify-center">
                                <FormField
                                    control={control}
                                    name={`order_units.data.${unit.dataIndex}.is_default` as `order_units.data.${number}.is_default`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={(checked) => {
                                                        handleDefaultChange(unit.dataIndex!, true, checked as boolean);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        );
                    }

                    return (
                        <div className="flex justify-center">
                            <Checkbox checked={unit.is_default} disabled />
                        </div>
                    );
                },
                enableSorting: false,
                size: 100,
                meta: {
                    cellClassName: (rowData: any) => rowData ? `text-center ${getRowBgClass(rowData)}` : 'text-center',
                    headerClassName: "text-center",
                },
            },
            {
                id: "conversion",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("conversion")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    return (
                        <ConversionPreviewWatcher
                            control={control}
                            unit={unit}
                            getUnitName={getUnitName}
                        />
                    );
                },
                enableSorting: false,
                size: 180,
                meta: {
                    cellClassName: (rowData: any) => rowData ? getRowBgClass(rowData) : '',
                },
            },
            ...(currentMode !== formType.VIEW ? [{
                id: "action",
                header: () => (
                    <span className="text-muted-foreground text-[0.8rem]">{tProducts("action")}</span>
                ),
                cell: ({ row }: { row: { original: UnitRow } }) => {
                    const unit = row.original;
                    
                    if (unit.isNew) {
                        return (
                            <div className="text-right">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeOrderUnit(unit.fieldIndex!)}
                                    className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-transparent"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    }

                    return (
                        <div className="text-right">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-transparent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl">{tCommon("delete")} {tProducts("order_unit")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <p className="text-muted-foreground">{tCommon("del_desc")}</p>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2 mt-4">
                                        <AlertDialogCancel className="mt-0">
                                            {tCommon("cancel")}
                                        </AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemoveUnit(unit.id!)} className="bg-red-600">
                                            {tCommon("delete")}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    );
                },
                enableSorting: false,
                size: 100,
                meta: {
                    cellClassName: (rowData: any) => rowData ? `text-right ${getRowBgClass(rowData)}` : 'text-right',
                    headerClassName: "text-right",
                },
            }] : [])
        ],
        [tProducts, control, getUnitName, currentMode, handleRemoveUnit, removeOrderUnit, inventoryUnitId, inventoryUnitName, handleDefaultChange, getAvailableUnits, handleFieldChange, getRowBgClass]
    );

    const table = useReactTable({
        data: allUnits,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        getCoreRowModel: getCoreRowModel(),
        meta: {
            getRowClassName: (row: UnitRow) => {
                return row.isNew ? "bg-green-50" : "bg-amber-50";
            }
        }
    });

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-base text-muted-foreground font-semibold">{tProducts("order_unit")}</h2>
                {currentMode !== formType.VIEW && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleAddUnit}
                                    disabled={!inventoryUnitId}
                                    className="w-6 h-6"
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
                <DataGrid
                    table={table}
                    recordCount={allUnits.length}
                    isLoading={false}
                    loadingMode="skeleton"
                    emptyMessage={tCommon("no_data")}
                    tableLayout={{
                        headerSticky: true,
                        dense: true,
                        rowBorder: true,
                        headerBackground: true,
                        headerBorder: true,
                    }}
                >
                    <div className="w-full">
                        <DataGridContainer>
                            {/* <ScrollArea className="max-h-96">
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea> */}
                            <DataGridTable />
                        </DataGridContainer>
                    </div>
                </DataGrid>
            ) : (
                <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-muted-foreground">
                        {inventoryUnitId
                            ? tProducts("no_order_units_defined")
                            : tProducts("pls_select_order_unit")
                        }
                    </p>
                </div>
            )}
        </Card>
    );
};

export default memo(OrderUnit);
