import { memo, useEffect, useMemo, useCallback, useState } from "react";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";
import { useTranslations } from "next-intl";
import { useUnitManagement } from "./hooks/useUnitManagement";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
import { UnitData } from "./unit.type";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}
interface UnitRow extends UnitData {
    isNew: boolean;
    fieldIndex?: number;
    dataIndex?: number;
}

const ConversionPreview = memo(({ fromUnitId, toUnitId, fromUnitQty, toUnitQty, getUnitName }: {
    fromUnitId: string;
    toUnitId: string;
    fromUnitQty: number;
    toUnitQty: number;
    getUnitName: (id: string) => string;
}) => {
    const [conversionPreview, setConversionPreview] = useState<{ unitRatio: string; qtyMultiplier: string }>({
        unitRatio: '',
        qtyMultiplier: ''
    });

    useEffect(() => {
        if (fromUnitId && toUnitId) {
            setConversionPreview({
                unitRatio: `1 ${getUnitName(fromUnitId)} = ${toUnitQty} ${getUnitName(toUnitId)}`,
                qtyMultiplier: `Qty x ${toUnitQty * fromUnitQty}`
            });
        }
    }, [fromUnitId, toUnitId, toUnitQty, fromUnitQty, getUnitName]);

    return (
        <div>
            <p className="text-xs font-medium">{conversionPreview.unitRatio}</p>
            <p className="text-muted-foreground text-[11px]">{conversionPreview.qtyMultiplier}</p>
        </div>
    );
});

ConversionPreview.displayName = 'ConversionPreview';

// Unit Combobox Component
const UnitCombobox = memo(({
    value,
    onChange,
    availableUnits,
    disabled
}: {
    value: string;
    onChange: (value: string) => void;
    availableUnits: UnitDto[];
    disabled?: boolean;
}) => {
    const [open, setOpen] = useState(false);
    const selectedUnit = availableUnits.find((u: UnitDto) => u.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="min-w-32 h-7 justify-between text-xs"
                    disabled={disabled}
                >
                    {selectedUnit?.name || "Select unit"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search unit..." className="h-8" />
                    <CommandList>
                        <CommandEmpty>No unit found.</CommandEmpty>
                        <CommandGroup>
                            {availableUnits.map((unit: UnitDto) => (
                                <CommandItem
                                    key={unit.id}
                                    value={unit.name}
                                    onSelect={() => {
                                        onChange(unit.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={`mr-2 h-4 w-4 ${value === unit.id ? "opacity-100" : "opacity-0"}`}
                                    />
                                    {unit.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
});

UnitCombobox.displayName = 'UnitCombobox';

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

    const handleDefaultChange = useCallback((index: number, isDataField: boolean, checked: boolean) => {
        if (!checked) return; // Only handle when setting to true

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const unitsData = watch('order_units') as any;

        const currentUpdate = unitsData?.update || [];

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

    // Filter available units - exclude units that are already used
    const getAvailableUnits = useCallback((currentUnitId?: string) => {
        if (!units?.data) return [];

        // Get all used unit IDs from both existing data and new fields
        const usedUnitIds = new Set<string>();

        // Add units from existing data (displayUnits)
        displayUnits.forEach((unit) => {
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
        ...displayUnits.map((unit, index) => ({ ...unit, isNew: false, dataIndex: index })),
        ...orderUnitFields.map((field, index) => ({
            ...field,
            to_unit_id: field.to_unit_id || "",
            to_unit_qty: field.to_unit_qty || 1,
            is_default: field.is_default || false,
            description: "",
            is_active: true,
            isNew: true,
            fieldIndex: index
        }))
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
                                <span className="font-medium">{unit.from_unit_qty}</span>
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
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`order_units.data.${unit.dataIndex}.from_unit_qty` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="w-16 h-7"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    min={1}
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`order_units.data.${unit.dataIndex}.from_unit_id` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitCombobox
                                                    value={field.value}
                                                    onChange={field.onChange}
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
                                                <Input
                                                    type="number"
                                                    className="w-16 h-7"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    onBlur={field.onBlur}
                                                    name={field.name}
                                                    ref={field.ref}
                                                    min={1}
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
                                                <Select onValueChange={field.onChange} value={field.value} disabled>
                                                    <SelectTrigger className="h-7">
                                                        <SelectValue placeholder={"Unit.."} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {inventoryUnitId && inventoryUnitName && (
                                                            <SelectItem key={inventoryUnitId} value={inventoryUnitId}>
                                                                {inventoryUnitName}
                                                            </SelectItem>
                                                        )}
                                                    </SelectContent>
                                                </Select>
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
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`order_units.data.${unit.dataIndex}.to_unit_qty` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="w-16 h-7"
                                                    value={field.value}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                    min={1}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <span className="text-xs">{unit.to_unit_name || getUnitName(unit.to_unit_id)}</span>
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
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`order_units.data.${unit.dataIndex}.is_default` as any}
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
                    if (unit.from_unit_id && unit.to_unit_id) {
                        return (
                            <ConversionPreview
                                fromUnitId={unit.from_unit_id}
                                toUnitId={unit.to_unit_id}
                                fromUnitQty={unit.from_unit_qty}
                                toUnitQty={unit.to_unit_qty || 1}
                                getUnitName={getUnitName}
                            />
                        );
                    }
                    return null;
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
                                    onClick={() => removeOrderUnit(unit.fieldIndex!)}
                                    className="h-7 w-7 hover:text-destructive/80 hover:bg-transparent"
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
                                        className="h-7 w-7 hover:text-destructive/80 hover:bg-transparent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="text-xl">Remove {tProducts("order_unit")}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <p className="text-muted-foreground">Are you sure you want to remove this {tProducts("order_unit")} unit?</p>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="gap-2 mt-4">
                                        <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleRemoveUnit(unit.id!)} className="bg-red-600">
                                            Remove
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
        [tProducts, control, getUnitName, currentMode, handleRemoveUnit, removeOrderUnit, inventoryUnitId, inventoryUnitName, handleDefaultChange, getAvailableUnits]
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
                        headerBackground: true,
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
