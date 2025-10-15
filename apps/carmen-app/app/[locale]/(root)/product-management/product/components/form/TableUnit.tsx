import { Control } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, memo, useMemo } from "react";
import UnitLookup from "@/components/lookup/UnitLookup";
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
import { UnitData } from "./unit.type";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ColumnDef,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { DataGrid, DataGridContainer } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface UnitField {
    id: string;
    from_unit_id: string;
    from_unit_name?: string;
    from_unit_qty: number;
    to_unit_id?: string;
    to_unit_qty?: number;
    is_default?: boolean;
}

interface TableUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly displayUnits: UnitData[];
    readonly getUnitName: (id: string) => string;
    readonly handleRemove: (unitId: string) => void;
    readonly addFieldName: string;
    readonly unitFields: UnitField[];
    readonly removeUnit: (index: number) => void;
    readonly inventoryUnitId?: string;
    readonly handleDefaultChange: (index: number, isDataField: boolean, checked: boolean) => void;
}

interface UnitRow extends UnitData {
    isNew: boolean;
    fieldIndex?: number;
    dataIndex?: number;
}

export default function TableUnit({
    control,
    currentMode,
    displayUnits,
    getUnitName,
    handleRemove,
    addFieldName,
    unitFields,
    removeUnit,
    inventoryUnitId,
    handleDefaultChange,
}: TableUnitProps) {
    const tProducts = useTranslations("Products");
    const tCommon = useTranslations("Common");
    const inventoryUnitName = inventoryUnitId ? getUnitName(inventoryUnitId) : '';

    const allUnits: UnitRow[] = useMemo(() => [
        ...displayUnits.map((unit, index) => ({ ...unit, isNew: false, dataIndex: index })),
        ...unitFields.map((field, index) => ({
            ...field,
            to_unit_id: field.to_unit_id || "",
            to_unit_qty: field.to_unit_qty || 1,
            is_default: field.is_default || false,
            description: "",
            is_active: true,
            isNew: true,
            fieldIndex: index
        }))
    ], [displayUnits, unitFields]);

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
                        return (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{unit.from_unit_qty}</span>
                                <span>{unit.from_unit_name ? getUnitName(unit.from_unit_name) : ''}</span>
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.from_unit_id` as `order_units.add.${number}.from_unit_id` | `ingredient_units.add.${number}.from_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder=""
                                                    classNames="min-w-20 h-7"
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
                        const fieldNameBase = addFieldName.replace('.add', '.data');
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`${fieldNameBase}.${unit.dataIndex}.from_unit_qty` as any}
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
                                <FormField
                                    control={control}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`${fieldNameBase}.${unit.dataIndex}.from_unit_id` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <UnitLookup
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                    placeholder=""
                                                    classNames="min-w-20 h-7"
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
                        title={tProducts("to_unit")}
                    />
                ),
                cell: ({ row }) => {
                    const unit = row.original;

                    // New row (always editable)
                    if (unit.isNew) {
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.to_unit_qty` as `order_units.add.${number}.to_unit_qty` | `ingredient_units.add.${number}.to_unit_qty`}
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
                                    name={`${addFieldName}.${unit.fieldIndex!}.to_unit_id` as `order_units.add.${number}.to_unit_id` | `ingredient_units.add.${number}.to_unit_id`}
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
                        const fieldNameBase = addFieldName.replace('.add', '.data');
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`${fieldNameBase}.${unit.dataIndex}.to_unit_qty` as any}
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

                    // New row (editable)
                    if (unit.isNew) {
                        return (
                            <div className="flex justify-center">
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.is_default` as `order_units.add.${number}.is_default` | `ingredient_units.add.${number}.is_default`}
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
                        const fieldNameBase = addFieldName.replace('.add', '.data');
                        return (
                            <div className="flex justify-center">
                                <FormField
                                    control={control}
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    name={`${fieldNameBase}.${unit.dataIndex}.is_default` as any}
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
                    // New row - show remove button
                    if (unit.isNew) {
                        return (
                            <div className="text-right">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeUnit(unit.fieldIndex!)}
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
                                        <AlertDialogAction onClick={() => handleRemove(unit.id!)} className="bg-red-600">
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
        [tProducts, control, addFieldName, getUnitName, currentMode, handleRemove, removeUnit, inventoryUnitId, inventoryUnitName, handleDefaultChange]
    );

    const table = useReactTable({
        data: allUnits,
        columns,
        getRowId: (row) => row.id ?? "",
        state: {},
        getCoreRowModel: getCoreRowModel(),
    });

    return (
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
    );
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
