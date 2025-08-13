import { Control, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, SquarePen, Trash2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    readonly addFieldName: string; // e.g., "order_units.add" or "ingredient_units.add"
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly unitFields: any[];
    readonly removeUnit: (index: number) => void;
}

const EditableRow = ({
    editForm,
    onSave,
    onCancel,
    setEditForm,
    getUnitName,
    filteredUnits,
}: {
    editForm: UnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<UnitData | null>>;
    getUnitName: (id: string) => string;
    filteredUnits: UnitDto[];
}) => {

    const [conversionPreview, setConversionPreview] = useState<{ unitRatio: string; qtyMultiplier: string }>({
        unitRatio: '',
        qtyMultiplier: ''
    });

    useEffect(() => {
        if (editForm?.from_unit_id && editForm?.to_unit_id) {
            setConversionPreview({
                unitRatio: `1 ${getUnitName(editForm.from_unit_id)} = ${editForm.to_unit_qty} ${getUnitName(editForm.to_unit_id)}`,
                qtyMultiplier: `Qty x ${editForm.to_unit_qty * editForm.from_unit_qty}`
            });
        }
    }, [editForm?.from_unit_id, editForm?.to_unit_id, editForm?.to_unit_qty, editForm?.from_unit_qty, getUnitName]);

    const handleFieldChange = (field: keyof UnitData, value: string | number | boolean) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
    };

    return (
        <>
            <TableCell className="text-left w-24">
                <div className="flex items-center gap-2">
                    <span className="font-medium">{editForm?.from_unit_qty}</span>
                    <span>{getUnitName(editForm?.from_unit_id ?? "")}</span>
                </div>
            </TableCell>
            <TableCell className="text-left w-24">
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        className="w-16 h-7"
                        value={editForm?.to_unit_qty}
                        onChange={(e) => handleFieldChange('to_unit_qty', Number(e.target.value))}
                        min={1}
                    />
                    <Select
                        value={editForm?.to_unit_id}
                        onValueChange={(value) => handleFieldChange('to_unit_id', value)}
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
            </TableCell>
            <TableCell className="text-left w-16">
                <Checkbox checked={editForm?.is_default} onCheckedChange={() => handleFieldChange('is_default', !editForm?.is_default)} />
            </TableCell>
            <TableCell className="text-left w-28">
                {editForm?.from_unit_id && editForm?.to_unit_id ? (
                    <div>
                        <p className="text-xs font-medium">{conversionPreview.unitRatio}</p>
                        <p className="text-muted-foreground text-[11px]">{conversionPreview.qtyMultiplier}</p>
                    </div>
                ) : ''}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSave}
                        className="h-7 w-7 text-green-500 hover:text-green-500/80"
                        aria-label="Save changes"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="h-7 w-7 text-destructive hover:text-destructive/80"
                        aria-label="Cancel edit"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </>
    );
};

const DisplayRow = ({
    unit,
    onEdit,
    onRemove,
    currentMode,
    getUnitName,
    unitTitle
}: {
    unit: UnitData;
    onEdit: () => void;
    onRemove: () => void;
    currentMode: formType;
    getUnitName: (id: string) => string;
    unitTitle: string;
}) => (
    <>
        <TableCell className="text-left w-24">
            <div className="flex items-center gap-2">
                <span className="font-medium">{unit.from_unit_qty}</span>
                <span>{getUnitName(unit.from_unit_id)}</span>
            </div>
        </TableCell>
        <TableCell className="text-left w-16">
            <div className="flex items-center gap-2">
                <span className="font-medium">{unit.to_unit_qty}</span>
                <span>{getUnitName(unit.to_unit_id)}</span>
            </div>
        </TableCell>
        <TableCell className="text-center w-16">
            <Checkbox checked={unit.is_default} disabled />
        </TableCell>
        <TableCell className="text-left w-28">
            <div>
                <p className="text-xs font-medium">{`1 ${getUnitName(unit.from_unit_id)} = ${unit.to_unit_qty} ${getUnitName(unit.to_unit_id)}`}</p>
                <p className="text-muted-foreground text-[11px]">{`Qty x ${unit.to_unit_qty * unit.from_unit_qty}`}</p>
            </div>
        </TableCell>
        {currentMode !== formType.VIEW && (
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        aria-label={`Edit ${unitTitle.toLowerCase()} unit`}
                        className="h-7 w-7 hover:bg-transparent"
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 hover:text-destructive/80 hover:bg-transparent"
                                aria-label={`Remove ${unitTitle.toLowerCase()} unit`}
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
                                <AlertDialogAction onClick={onRemove} className="bg-red-600">
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </TableCell>
        )}
    </>
);

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
    const { watch } = useFormContext<ProductFormValues>();

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead className="text-left w-24 font-medium">{unitTitle}</TableHead>
                        <TableHead className="text-left w-24 font-medium">{tProducts("to_unit")}</TableHead>
                        <TableHead className="text-center w-16 font-medium">{tProducts("default")}</TableHead>
                        <TableHead className="text-left w-28 font-medium">{tProducts("conversion")}</TableHead>
                        {currentMode !== formType.VIEW && <TableHead className="text-right w-20 font-medium">{tProducts("action")}</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* Existing Units */}
                    {displayUnits.map((unit) => (
                        <TableRow key={unit.id}>
                            {editingId === unit.id ? (
                                <EditableRow
                                    editForm={editForm}
                                    onSave={() => handleSaveEdit(unit)}
                                    onCancel={() => {
                                        setEditingId(null);
                                        setEditForm(null);
                                    }}
                                    setEditForm={setEditForm}
                                    getUnitName={getUnitName}
                                    filteredUnits={filteredUnits}
                                />
                            ) : (
                                <DisplayRow
                                    unit={unit}
                                    onEdit={() => handleStartEdit(unit)}
                                    onRemove={() => handleRemove(unit.id!)}
                                    currentMode={currentMode}
                                    getUnitName={getUnitName}
                                    unitTitle={unitTitle}
                                />
                            )}
                        </TableRow>
                    ))}

                    {/* New Units */}
                    {unitFields.map((field, index) => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const currentToUnitQty = (watch as any)(`${addFieldName}.${index}.to_unit_qty`) || 0;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const currentToUnitId = (watch as any)(`${addFieldName}.${index}.to_unit_id`) || "";

                        return (
                            <TableRow key={field.id}>
                                <TableCell className="text-left w-24">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{field.from_unit_qty}</span>
                                        <span>{getUnitName(field.from_unit_id)}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-left w-16">
                                    <div className="flex items-center gap-2">
                                        <FormField
                                            control={control}
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            name={`${addFieldName}.${index}.to_unit_qty` as any}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="w-16 h-7"
                                                            value={field.value as number}
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
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            name={`${addFieldName}.${index}.to_unit_id` as any}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value as string}>
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
                                </TableCell>

                                <TableCell className="text-center w-16">
                                    <FormField
                                        control={control}
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        name={`${addFieldName}.${index}.is_default` as any}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Checkbox checked={field.value as boolean} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TableCell>
                                <TableCell className="text-left w-28">
                                    {field.from_unit_id && currentToUnitId ? (
                                        <div>
                                            <p className="text-xs font-medium">{`1 ${getUnitName(field.from_unit_id)} = ${currentToUnitQty} ${getUnitName(currentToUnitId as string)}`}</p>
                                            <p className="text-muted-foreground text-[11px]">{`Qty x ${(currentToUnitQty as number) * (field.from_unit_qty as number)}`}</p>
                                        </div>
                                    ) : ''}
                                </TableCell>
                                {currentMode !== formType.VIEW && (
                                    <TableCell className="text-right">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeUnit(index)}
                                            aria-label={`Remove ${unitTitle.toLowerCase()} unit`}
                                            className="h-7 w-7 hover:text-destructive/80 hover:bg-transparent"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    );
}