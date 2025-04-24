import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight, Check, PenIcon, Plus, Trash2, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUnit } from "@/hooks/useUnit";
import { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

interface IngredientUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly initialValues?: IngredientUnitInitialValues;
}

interface IngredientUnitInitialValues {
    ingredient_units?: IngredientUnitValueItem[];
}

interface IngredientUnitValueItem {
    id: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description?: string;
    is_active?: boolean;
    is_default?: boolean;
}

interface IngredientUnitData {
    id?: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description: string;
    is_active: boolean;
    is_default: boolean;
}

interface IngredientUnitFormData {
    description: string;
    is_active: boolean;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    is_default: boolean;
}

interface IngredientUnitsFormData {
    data: IngredientUnitData[];
    add: IngredientUnitFormData[];
    update: {
        product_ingredient_unit_id: string;
        from_unit_id: string;
        from_unit_qty: number;
        to_unit_id: string;
        to_unit_qty: number;
        description: string;
        is_active: boolean;
        is_default: boolean;
    }[];
    remove: { id: string }[];
}

const EditableRow = ({
    editForm,
    onSave,
    onCancel,
    setEditForm,
    getUnitName
}: {
    editForm: IngredientUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<IngredientUnitData | null>>;
    getUnitName: (id: string) => string;
}) => {
    const handleFieldChange = (field: keyof IngredientUnitData, value: string | number | boolean) => {
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
                <Select
                    value={editForm?.to_unit_id}
                    onValueChange={(value) => handleFieldChange('to_unit_id', value)}
                >
                    <SelectTrigger className="w-20 h-9">
                        <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.isArray(editForm?.to_unit_id) ? [] : null}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell className="text-left w-16">
                <Input
                    type="number"
                    className="w-16 h-9"
                    value={editForm?.to_unit_qty}
                    onChange={(e) => handleFieldChange('to_unit_qty', Number(e.target.value))}
                />
            </TableCell>
            <TableCell className="text-left w-16">
                <Switch checked={editForm?.is_default} onCheckedChange={() => handleFieldChange('is_default', !editForm?.is_default)} />
            </TableCell>
            <TableCell className="text-left">
                <ArrowLeftRight className="h-4 w-4 text-gray-500" />
            </TableCell>
            <TableCell className="text-left w-28">
                {editForm?.from_unit_id && editForm?.to_unit_id ? (
                    <div>
                        <p className="text-xs font-medium">{`1 ${getUnitName(editForm.from_unit_id)} = ${editForm.to_unit_qty} ${getUnitName(editForm.to_unit_id)}`}</p>
                        <p className="text-muted-foreground text-[11px]">{`Qty x ${editForm.to_unit_qty * editForm.from_unit_qty}`}</p>
                    </div>
                ) : ''}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSave}
                        className="text-green-500 rounded-full p-2"
                        aria-label="Save changes"
                    >
                        <Check className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        className="text-red-500 rounded-full p-2"
                        aria-label="Cancel edit"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </>
    );
};

const DisplayRow = ({ ingredientUnit, onEdit, onRemove, currentMode, getUnitName }: {
    ingredientUnit: IngredientUnitData;
    onEdit: () => void;
    onRemove: () => void;
    currentMode: formType;
    getUnitName: (id: string) => string;
}) => (
    <>
        <TableCell className="text-left w-24">
            <div className="flex items-center gap-2">
                <span className="font-medium">{ingredientUnit.from_unit_qty}</span>
                <span>{getUnitName(ingredientUnit.from_unit_id)}</span>
            </div>
        </TableCell>
        <TableCell className="text-left w-24">{getUnitName(ingredientUnit.to_unit_id)}</TableCell>
        <TableCell className="text-left w-16">{ingredientUnit.to_unit_qty}</TableCell>
        <TableCell className="text-left w-16">
            <Switch checked={ingredientUnit.is_default} disabled />
        </TableCell>
        <TableCell className="text-left">
            <ArrowLeftRight className="h-4 w-4 text-gray-500" />
        </TableCell>
        <TableCell className="text-left w-28">
            <div>
                <p className="text-xs font-medium">{`1 ${getUnitName(ingredientUnit.from_unit_id)} = ${ingredientUnit.to_unit_qty} ${getUnitName(ingredientUnit.to_unit_id)}`}</p>
                <p className="text-muted-foreground text-[11px]">{`Qty x ${ingredientUnit.to_unit_qty * ingredientUnit.from_unit_qty}`}</p>
            </div>
        </TableCell>
        {currentMode !== formType.VIEW && (
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    {currentMode !== formType.ADD && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={onEdit}
                            className="text-blue-500 rounded-full p-2"
                            aria-label="Edit ingredient unit"
                        >
                            <PenIcon className="h-4 w-4" />
                        </Button>
                    )}

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="text-red-500 rounded-full p-2"
                                aria-label="Remove ingredient unit"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl">Remove Ingredient Unit</AlertDialogTitle>
                                <AlertDialogDescription className="space-y-2 text-gray-600">
                                    <p>Are you sure you want to remove this ingredient unit?</p>
                                    <div className="mt-2 p-4 space-y-1.5 text-sm">
                                        <p><span className="font-semibold">From Unit:</span> {getUnitName(ingredientUnit.from_unit_id)}</p>
                                        <p><span className="font-semibold">To Unit:</span> {getUnitName(ingredientUnit.to_unit_id)}</p>
                                        <p><span className="font-semibold">Description:</span> {ingredientUnit.description ?? '-'}</p>
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

export default function IngredientUnit({ control, currentMode }: IngredientUnitProps) {
    const { units } = useUnit();
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<IngredientUnitData | null>(null);
    const ingredientUnits = watch("ingredient_units") as IngredientUnitsFormData;
    const existingIngredientUnits = ingredientUnits?.data || [];
    const removedIngredientUnits = watch("ingredient_units.remove") || [];

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    const { append: appendIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    const { append: appendIngredientUnitUpdate } = useFieldArray({
        control,
        name: "ingredient_units.update"
    });

    // Filter out removed ingredient units
    const displayIngredientUnits = existingIngredientUnits.filter(
        ingredientUnit => !removedIngredientUnits.some(removed => removed.id === ingredientUnit.id)
    );

    const hasIngredientUnits = displayIngredientUnits.length > 0 || ingredientUnitFields.length > 0;

    const getUnitName = (unitId: string) => {
        return units.find(unit => unit.id === unitId)?.name ?? '-';
    };

    const handleStartEdit = (ingredientUnit: IngredientUnitData) => {
        if (currentMode === formType.ADD) return;
        setEditingId(ingredientUnit.id ?? null);
        setEditForm(ingredientUnit);
    };

    const handleSaveEdit = (ingredientUnit: IngredientUnitData) => {
        if (!editForm || !ingredientUnit.id || currentMode === formType.ADD) return;

        const updatedIngredientUnit = {
            product_ingredient_unit_id: ingredientUnit.id,
            from_unit_id: editForm.from_unit_id,
            from_unit_qty: editForm.from_unit_qty,
            to_unit_id: editForm.to_unit_id,
            to_unit_qty: editForm.to_unit_qty,
            description: editForm.description ?? '',
            is_active: editForm.is_active ?? true,
            is_default: editForm.is_default ?? false
        };

        // Update the form state
        const currentIngredientUnits = watch("ingredient_units") as IngredientUnitsFormData;
        if (currentIngredientUnits?.data) {
            // Update the data array for UI
            const updatedData = currentIngredientUnits.data.map((item: IngredientUnitData) =>
                item.id === ingredientUnit.id
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

            // Update the form state
            setValue("ingredient_units", {
                add: [],
                remove: currentIngredientUnits.remove || [],
                update: [...(currentIngredientUnits.update || []), updatedIngredientUnit]
            });

            // Force update the display data
            const newIngredientUnits = { ...currentIngredientUnits };
            newIngredientUnits.data = updatedData;
            setValue("ingredient_units", newIngredientUnits);
        }

        appendIngredientUnitUpdate(updatedIngredientUnit);
        setEditingId(null);
        setEditForm(null);
    };

    return (
        <Card className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ingredient Units</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                            const inventoryUnitId = watch("inventory_unit_id");
                            appendIngredientUnit({
                                from_unit_id: inventoryUnitId || "",
                                from_unit_qty: 1,
                                to_unit_id: "",
                                to_unit_qty: 0,
                                description: "",
                                is_active: true,
                                is_default: false
                            });
                        }}
                        className="flex items-center gap-1.5 px-3"
                    >
                        <Plus className="h-4 w-4" />
                        Add Ingredient Unit
                    </Button>
                )}
            </div>

            {hasIngredientUnits ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="text-left w-24 font-medium">Ingredient</TableHead>
                                <TableHead className="text-left w-24 font-medium">To Unit</TableHead>
                                <TableHead className="text-left w-16 font-medium">Qty</TableHead>
                                <TableHead className="text-left w-16 font-medium">Default</TableHead>
                                <TableHead className="text-left w-20 font-medium">Direction</TableHead>
                                <TableHead className="text-left w-28 font-medium">Conversion</TableHead>
                                {currentMode !== formType.VIEW && <TableHead className="text-right w-20 font-medium">Actions</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayIngredientUnits.map((ingredientUnit) => (
                                <TableRow key={ingredientUnit.id}>
                                    {editingId === ingredientUnit.id ? (
                                        <EditableRow
                                            editForm={editForm}
                                            onSave={() => handleSaveEdit(ingredientUnit)}
                                            onCancel={() => {
                                                setEditingId(null);
                                                setEditForm(null);
                                            }}
                                            setEditForm={setEditForm}
                                            getUnitName={getUnitName}
                                        />
                                    ) : (
                                        <DisplayRow
                                            ingredientUnit={ingredientUnit}
                                            onEdit={() => handleStartEdit(ingredientUnit)}
                                            onRemove={() => appendIngredientUnitRemove({ id: ingredientUnit.id! })}
                                            currentMode={currentMode}
                                            getUnitName={getUnitName}
                                        />
                                    )}
                                </TableRow>
                            ))}

                            {/* New Ingredient Units */}
                            {ingredientUnitFields.map((field, index) => (
                                <TableRow key={field.id}>
                                    <TableCell className="text-left w-24">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{field.from_unit_qty}</span>
                                            <span>{getUnitName(field.from_unit_id)}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-left w-24">
                                        <FormField
                                            control={control}
                                            name={`ingredient_units.add.${index}.to_unit_id`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="w-20 h-9">
                                                                <SelectValue placeholder="Unit" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {units.map((unit) => (
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
                                    </TableCell>
                                    <TableCell className="text-left w-16">
                                        <FormField
                                            control={control}
                                            name={`ingredient_units.add.${index}.to_unit_qty`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            className="w-16 h-9"
                                                            {...field}
                                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-left w-16">
                                        <FormField
                                            control={control}
                                            name={`ingredient_units.add.${index}.is_default`}
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TableCell>
                                    <TableCell className="text-left">
                                        <ArrowLeftRight className="h-4 w-4 text-gray-500" />
                                    </TableCell>
                                    <TableCell className="text-left w-28">
                                        {field.from_unit_id && field.to_unit_id ? (
                                            <div>
                                                <p className="text-xs font-medium">{`1 ${getUnitName(field.from_unit_id)} = ${field.to_unit_qty || 0} ${getUnitName(field.to_unit_id)}`}</p>
                                                <p className="text-muted-foreground text-[11px]">{`Qty x ${(field.to_unit_qty || 0) * field.from_unit_qty}`}</p>
                                            </div>
                                        ) : ''}
                                    </TableCell>
                                    {currentMode !== formType.VIEW && (
                                        <TableCell className="text-right">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeIngredientUnit(index)}
                                                className="text-red-500 rounded-full p-2"
                                                aria-label="Remove ingredient unit"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <p className="text-gray-500 mb-4">No ingredient units defined yet</p>
                    {currentMode !== formType.VIEW && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                const inventoryUnitId = watch("inventory_unit_id");
                                appendIngredientUnit({
                                    from_unit_id: inventoryUnitId || "",
                                    from_unit_qty: 1,
                                    to_unit_id: "",
                                    to_unit_qty: 0,
                                    description: "",
                                    is_active: true,
                                    is_default: false
                                });
                            }}
                            className="flex items-center gap-1.5"
                        >
                            <Plus className="h-4 w-4" />
                            Add First Ingredient Unit
                        </Button>
                    )}
                </div>
            )}
        </Card>
    );
}
