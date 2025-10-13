import { Control } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, SquarePen, Trash2, X, Package, ArrowRight, CheckCircle, Calculator } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect, memo, useMemo, useCallback } from "react";
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
import { UnitDto } from "@/dtos/unit.dto";
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
    readonly unitTitle: string;
    readonly displayUnits: UnitData[];
    readonly editingId: string | null;
    readonly editForm: UnitData | null;
    readonly setEditingId: (id: string | null) => void;
    readonly setEditForm: React.Dispatch<React.SetStateAction<UnitData | null>>;
    readonly getUnitName: (id: string) => string;
    readonly filteredUnits: UnitDto[];
    readonly handleStartEdit: (unit: UnitData) => void;
    readonly handleSaveEdit: (unit: UnitData) => void;
    readonly handleRemove: (unitId: string) => void;
    readonly addFieldName: string;
    readonly unitFields: UnitField[];
    readonly removeUnit: (index: number) => void;
}

interface UnitRow extends UnitData {
    isNew: boolean;
    fieldIndex?: number;
}

export default function TableUnit({
    control,
    currentMode,
    unitTitle,
    displayUnits,
    editingId,
    editForm,
    setEditingId,
    setEditForm,
    getUnitName,
    filteredUnits,
    handleStartEdit,
    handleSaveEdit,
    handleRemove,
    addFieldName,
    unitFields,
    removeUnit,
}: TableUnitProps) {

    const tProducts = useTranslations("Products");
    const tCommon = useTranslations("Common");

    // Merge existing and new units
    const allUnits: UnitRow[] = useMemo(() => [
        ...displayUnits.map(unit => ({ ...unit, isNew: false })),
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

    // Define columns
    const columns = useMemo<ColumnDef<UnitRow>[]>(
        () => [
            {
                accessorKey: "from_unit",
                header: () => (
                    <div className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        <span>{unitTitle}</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    const isEditing = editingId === unit.id;

                    // Editable row
                    if (isEditing && editForm) {
                        return (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{editForm.from_unit_qty}</span>
                                <span>{getUnitName(editForm.from_unit_id)}</span>
                            </div>
                        );
                    }

                    // New row
                    if (unit.isNew) {
                        return (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{unit.from_unit_qty}</span>
                                <span>{unit.from_unit_name ? getUnitName(unit.from_unit_name) : ''}</span>
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.from_unit_id` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-20 h-7">
                                                        <SelectValue placeholder={tProducts("unit")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredUnits.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
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

                    // Display row
                    return (
                        <div className="flex items-center gap-2">
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
                header: () => (
                    <div className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        <span>{tProducts("to_unit")}</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    const isEditing = editingId === unit.id;

                    // Editable row
                    if (isEditing && editForm) {
                        return (
                            <EditableToUnit
                                editForm={editForm}
                                setEditForm={setEditForm}
                                filteredUnits={filteredUnits}
                            />
                        );
                    }

                    // New row
                    if (unit.isNew) {
                        return (
                            <div className="flex items-center gap-2">
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.to_unit_qty` as any}
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
                                    name={`${addFieldName}.${unit.fieldIndex!}.to_unit_id` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-20 h-7">
                                                        <SelectValue placeholder={tProducts("select_unit")} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {filteredUnits.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                                                {unit.name}
                                                            </SelectItem>
                                                        ))}
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

                    // Display row
                    return (
                        <div className="flex items-center gap-2">
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
                header: () => (
                    <div className="flex items-center gap-2 justify-center">
                        <CheckCircle className="h-4 w-4" />
                        <span>{tProducts("default")}</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    const isEditing = editingId === unit.id;

                    if (isEditing && editForm) {
                        return (
                            <div className="flex justify-center">
                                <Checkbox
                                    checked={editForm.is_default}
                                    onCheckedChange={() => setEditForm({ ...editForm, is_default: !editForm.is_default })}
                                />
                            </div>
                        );
                    }

                    if (unit.isNew) {
                        return (
                            <div className="flex justify-center">
                                <FormField
                                    control={control}
                                    name={`${addFieldName}.${unit.fieldIndex!}.is_default` as any}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
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
                header: () => (
                    <div className="flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        <span>{tProducts("conversion")}</span>
                    </div>
                ),
                cell: ({ row }) => {
                    const unit = row.original;
                    const isEditing = editingId === unit.id;

                    if (isEditing && editForm && editForm.from_unit_id && editForm.to_unit_id) {
                        return (
                            <ConversionPreview
                                fromUnitId={editForm.from_unit_id}
                                toUnitId={editForm.to_unit_id}
                                fromUnitQty={editForm.from_unit_qty}
                                toUnitQty={editForm.to_unit_qty}
                                getUnitName={getUnitName}
                            />
                        );
                    }

                    if (unit.isNew && unit.from_unit_id && unit.to_unit_id) {
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

                    if (!unit.isNew && unit.from_unit_id && unit.to_unit_id) {
                        return (
                            <ConversionPreview
                                fromUnitId={unit.from_unit_id}
                                toUnitId={unit.to_unit_id}
                                fromUnitQty={unit.from_unit_qty}
                                toUnitQty={unit.to_unit_qty}
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
                header: () => <div className="text-right">{tProducts("action")}</div>,
                cell: ({ row }: { row: { original: UnitRow } }) => {
                    const unit = row.original;
                    const isEditing = editingId === unit.id;

                    if (isEditing && editForm) {
                        return (
                            <div className="flex items-center justify-end gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleSaveEdit(unit)}
                                    className="h-7 w-7 text-green-500 hover:text-green-500/80"
                                >
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setEditingId(null);
                                        setEditForm(null);
                                    }}
                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        );
                    }

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
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleStartEdit(unit)}
                                className="h-7 w-7 hover:bg-transparent"
                            >
                                <SquarePen className="h-4 w-4" />
                            </Button>
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
                                        <AlertDialogTitle className="text-xl">Remove {unitTitle}</AlertDialogTitle>
                                        <AlertDialogDescription className="space-y-2 text-gray-600">
                                            <p>Are you sure you want to remove this {unitTitle.toLowerCase()} unit?</p>
                                            <div className="mt-2 p-4 space-y-1.5 text-sm">
                                                <p><span className="font-semibold">From Unit:</span> {getUnitName(unit.from_unit_id)}</p>
                                                <p><span className="font-semibold">To Unit:</span> {getUnitName(unit.to_unit_id)}</p>
                                                <p><span className="font-semibold">Description:</span> {unit.description ?? '-'}</p>
                                            </div>
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
        [tProducts, unitTitle, editingId, editForm, control, addFieldName, filteredUnits, getUnitName, currentMode, setEditForm, setEditingId, handleSaveEdit, handleStartEdit, handleRemove, removeUnit]
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
                dense: false,
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

// Helper component for editable to_unit
const EditableToUnit = memo(({ editForm, setEditForm, filteredUnits }: {
    editForm: UnitData;
    setEditForm: React.Dispatch<React.SetStateAction<UnitData | null>>;
    filteredUnits: UnitDto[];
}) => {
    return (
        <div className="flex items-center gap-2">
            <Input
                type="number"
                className="w-16 h-7"
                value={editForm.to_unit_qty}
                onChange={(e) => setEditForm({ ...editForm, to_unit_qty: Number(e.target.value) })}
                min={1}
            />
            <Select
                value={editForm.to_unit_id}
                onValueChange={(value) => setEditForm({ ...editForm, to_unit_id: value })}
            >
                <SelectTrigger className="w-20 h-7">
                    <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                    {filteredUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.id ?? ""}>
                            {unit.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
});

EditableToUnit.displayName = 'EditableToUnit';

// Helper component for conversion preview
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
