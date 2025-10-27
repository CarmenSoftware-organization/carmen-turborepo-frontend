import { memo, useMemo, useCallback, FC } from "react";
import { Control, useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto, UnitRow, UnitData } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { useUnitManagement } from "./hooks/useUnitManagement";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ProductFormValues } from "@/dtos/product.dto";
import UnitCombobox from "@/components/lookup/UnitCombobox";
import ConversionPreview from "@/components/ConversionPreview";
import NumberInput from "@/components/form-custom/NumberInput";

interface IngredientUnitProps {
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
            ? `ingredient_units.add.${unit.fieldIndex}.from_unit_id` as `ingredient_units.add.${number}.from_unit_id`
            : `ingredient_units.data.${unit.dataIndex}.from_unit_id` as `ingredient_units.data.${number}.from_unit_id`,
        defaultValue: unit.from_unit_id
    });

    const toUnitId = useWatch({
        control,
        name: unit.isNew
            ? `ingredient_units.add.${unit.fieldIndex}.to_unit_id` as `ingredient_units.add.${number}.to_unit_id`
            : `ingredient_units.data.${unit.dataIndex}.to_unit_id` as `ingredient_units.data.${number}.to_unit_id`,
        defaultValue: unit.to_unit_id
    });

    const fromUnitQty = useWatch({
        control,
        name: unit.isNew
            ? `ingredient_units.add.${unit.fieldIndex}.from_unit_qty` as `ingredient_units.add.${number}.from_unit_qty`
            : `ingredient_units.data.${unit.dataIndex}.from_unit_qty` as `ingredient_units.data.${number}.from_unit_qty`,
        defaultValue: unit.from_unit_qty
    });

    const toUnitQty = useWatch({
        control,
        name: unit.isNew
            ? `ingredient_units.add.${unit.fieldIndex}.to_unit_qty` as `ingredient_units.add.${number}.to_unit_qty`
            : `ingredient_units.data.${unit.dataIndex}.to_unit_qty` as `ingredient_units.data.${number}.to_unit_qty`,
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

const IngredientUnit = ({ control, currentMode }: IngredientUnitProps) => {
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



    const { append: appendIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    // Memoize derived state
    const hasIngredientUnits = useMemo(
        () => displayUnits.length > 0 || newUnits.length > 0,
        [displayUnits.length, newUnits.length]
    );

    const inventoryUnitId = watch("inventory_unit_id");

    const getUnitName = useCallback((unitId: string) => {
        return units?.data?.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    }, [units]);

    const inventoryUnitName = getUnitName(inventoryUnitId);

    // Filter function for available units - prevents duplicate to_unit_id selections
    const getAvailableUnits = useCallback((currentUnitId?: string) => {
        if (!units?.data) return [];

        // Create Set of used to_unit_ids
        const usedUnitIds = new Set<string>();

        // Add to_unit_ids from existing units
        displayUnits.forEach((unit: UnitData) => {
            if (unit.to_unit_id) usedUnitIds.add(unit.to_unit_id);
        });

        // Add to_unit_ids from new units
        ingredientUnitFields.forEach((field) => {
            if (field.to_unit_id) usedUnitIds.add(field.to_unit_id);
        });

        // Filter units: exclude used ones unless it's the current unit being edited
        return units.data.filter((unit: UnitDto) =>
            !usedUnitIds.has(unit.id) || unit.id === currentUnitId
        );
    }, [units, displayUnits, ingredientUnitFields]);

    const handleAddUnit = useCallback((e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        appendIngredientUnit({
            from_unit_id: inventoryUnitId,
            from_unit_qty: 1,
            to_unit_id: inventoryUnitId,
            to_unit_qty: 1,
            description: "",
            is_active: true,
            is_default: false
        });
    }, [appendIngredientUnit, inventoryUnitId]);

    const handleRemoveUnit = useCallback((unitId: string) => {
        appendIngredientUnitRemove({ product_ingredient_unit_id: unitId });
    }, [appendIngredientUnitRemove]);

    // Handler to sync data field changes to update array
    const handleFieldChange = useCallback((
        dataIndex: number,
        field: 'from_unit_id' | 'from_unit_qty' | 'to_unit_id' | 'to_unit_qty',
        value: string | number
    ) => {
        const unitsData = watch('ingredient_units');
        if (!unitsData?.data || !unitsData.data[dataIndex]) return;

        const currentUnit = unitsData.data[dataIndex];
        const currentUpdate = unitsData?.update || [];

        // Find if this unit is already in update array
        const existingUpdateIndex = currentUpdate.findIndex(
            (u) => u.product_ingredient_unit_id === currentUnit.id
        );

        const updatedUnit = {
            product_ingredient_unit_id: currentUnit.id,
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

        setValue('ingredient_units.update', currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);

    const handleDefaultChange = useCallback((index: number, isDataField: boolean, checked: boolean) => {
        if (!checked) return; // Only handle when setting to true

        const unitsData = watch('ingredient_units');
        const currentUpdate = unitsData?.update || [];

        // Update all existing units to false if not the current one
        if (unitsData?.data) {
            unitsData.data.forEach((unit, i: number) => {
                if (isDataField && i === index) return; // Skip the current one

                // Set to false in data
                setValue(`ingredient_units.data.${i}.is_default` as `ingredient_units.data.${number}.is_default`, false, { shouldDirty: true });

                // Add to update array if not already there
                const existingUpdateIndex = currentUpdate.findIndex(
                    (u) => u.product_ingredient_unit_id === unit.id
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
            unitsData.add.forEach((_, i: number) => {
                if (!isDataField && i === index) return;
                setValue(`ingredient_units.add.${i}.is_default` as `ingredient_units.add.${number}.is_default`, false, { shouldDirty: true });
            });
        }

        // Set the current one to true
        if (isDataField && unitsData?.data) {
            setValue(`ingredient_units.data.${index}.is_default` as `ingredient_units.data.${number}.is_default`, true, { shouldDirty: true });

            // Add current unit to update array
            const currentUnit = unitsData.data[index];
            const existingUpdateIndex = currentUpdate.findIndex(
                (u) => u.product_ingredient_unit_id === currentUnit.id
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
            setValue(`ingredient_units.add.${index}.is_default` as `ingredient_units.add.${number}.is_default`, true, { shouldDirty: true });
        }

        // Update the update array
        setValue('ingredient_units.update', currentUpdate, { shouldDirty: true });
    }, [watch, setValue]);


    const allUnits: UnitRow[] = useMemo(() => [
        ...displayUnits.map((unit: UnitData, index: number) => ({ ...unit, isNew: false, dataIndex: index })),
        ...ingredientUnitFields.map((field, index) => ({
            ...field,
            to_unit_id: field.to_unit_id || "",
            to_unit_qty: field.to_unit_qty || 1,
            is_default: field.is_default || false,
            description: "",
            is_active: true,
            isNew: true,
            fieldIndex: index
        }))
    ], [displayUnits, ingredientUnitFields]);

    const columns = useMemo<ColumnDef<UnitRow>[]>(
        () => [
            {
                accessorKey: "from_unit",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("inventory_unit")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    if (unit.isNew) {
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${unit.fieldIndex!}.from_unit_qty` as `ingredient_units.add.${number}.from_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={field.onChange}
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
                                    name={`ingredient_units.add.${unit.fieldIndex!}.from_unit_id` as `ingredient_units.add.${number}.from_unit_id`}
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
                                    name={`ingredient_units.data.${unit.dataIndex}.from_unit_qty` as `ingredient_units.data.${number}.from_unit_qty`}
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
                                <Input
                                    className="w-16 h-7 bg-muted cursor-not-allowed text-xs"
                                    value={inventoryUnitName}
                                    disabled
                                    readOnly
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
            },
            {
                accessorKey: "to_unit",
                header: ({ column }) => (
                    <DataGridColumnHeader
                        column={column}
                        title={tProducts("ingredient_unit")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;

                    if (unit.isNew) {
                        const availableUnits = getAvailableUnits(unit.to_unit_id);
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${unit.fieldIndex!}.to_unit_qty` as `ingredient_units.add.${number}.to_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    min={0}
                                                    step={0}
                                                    classNames="w-16 h-7"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${unit.fieldIndex!}.to_unit_id` as `ingredient_units.add.${number}.to_unit_id`}
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
                        const availableUnits = getAvailableUnits(unit.to_unit_id);
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`ingredient_units.data.${unit.dataIndex}.to_unit_qty` as `ingredient_units.data.${number}.to_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <NumberInput
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(unit.dataIndex!, 'to_unit_qty', value);
                                                    }}
                                                    min={0}
                                                    step={0}
                                                    classNames="w-16 h-7"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name={`ingredient_units.data.${unit.dataIndex}.to_unit_id` as `ingredient_units.data.${number}.to_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitCombobox
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        handleFieldChange(unit.dataIndex!, 'to_unit_id', value);
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
                            <span className="font-medium">{unit.to_unit_qty}</span>
                            <span>{unit.to_unit_name || getUnitName(unit.to_unit_id)}</span>
                        </div>
                    );
                },
                enableSorting: false,
                size: 180,
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
                                    name={`ingredient_units.add.${unit.fieldIndex!}.is_default` as `ingredient_units.add.${number}.is_default`}
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
                                    name={`ingredient_units.data.${unit.dataIndex}.is_default` as `ingredient_units.data.${number}.is_default`}
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
                    cellClassName: "text-center",
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
                                    onClick={() => removeIngredientUnit(unit.fieldIndex!)}
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
                                        <AlertDialogTitle className="text-xl">{tCommon("delete")} {tProducts("ingredient_unit")}</AlertDialogTitle>
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
                    cellClassName: "text-right",
                    headerClassName: "text-right",
                },
            }] : [])
        ],
        [tProducts, control, getUnitName, currentMode, handleRemoveUnit, removeIngredientUnit, inventoryUnitId, inventoryUnitName, handleDefaultChange, getAvailableUnits, handleFieldChange]
    );

    const table = useReactTable({
        data: allUnits,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-base text-muted-foreground font-semibold">{tProducts("ingredient_unit")}</h2>
                {currentMode !== formType.VIEW && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    className="w-6 h-6"
                                    onClick={handleAddUnit}
                                    disabled={!inventoryUnitId}
                                >
                                    <Plus />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tProducts("add_ingredient_unit")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {hasIngredientUnits ? (
                <DataGrid
                    table={table}
                    recordCount={allUnits.length}
                    isLoading={false}
                    loadingMode="skeleton"
                    emptyMessage={tCommon("no_data")}
                    tableLayout={{
                        headerSticky: false,
                        dense: true,
                        rowBorder: true,
                        headerBackground: false,
                        headerBorder: true,
                        width: "fixed",
                    }}
                >
                    <div className="w-full">
                        <DataGridContainer>
                            <ScrollArea className="max-h-96">
                                <DataGridTable />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </DataGridContainer>
                    </div>
                </DataGrid>
            ) : (
                <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-muted-foreground">
                        {inventoryUnitId
                            ? tProducts("no_ingredient_units_defined")
                            : tProducts("pls_select_ingredient_unit")
                        }
                    </p>
                </div>
            )}
        </Card>
    );
};

export default memo(IngredientUnit);
