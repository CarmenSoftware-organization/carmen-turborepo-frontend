import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, Plus, SquarePen, Trash, X } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useUnitQuery } from "@/hooks/use-unit";
import { UnitDto } from "@/dtos/unit.dto";

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

// Interface to match schema but with optional data field for internal use
interface IngredientUnitsFormData {
    data?: IngredientUnitData[];
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
    remove: { product_ingredient_unit_id: string }[];
};

interface UnitDataDto {
    id?: string;
    name: string;
    description?: string;
    is_active?: boolean;
}

const EditableRow = ({
    editForm,
    onSave,
    onCancel,
    setEditForm,
    getUnitName,
    filteredUnits
}: {
    editForm: IngredientUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<IngredientUnitData | null>>;
    getUnitName: (id: string) => string;
    filteredUnits: UnitDataDto[];
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
                <Switch checked={editForm?.is_default} onCheckedChange={() => handleFieldChange('is_default', !editForm?.is_default)} />
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
        <TableCell className="text-left w-16">
            <div className="flex items-center gap-2">
                <span className="font-medium">{ingredientUnit.to_unit_qty}</span>
                <span>{getUnitName(ingredientUnit.to_unit_id)}</span>
            </div>
        </TableCell>
        {/* <TableCell className="text-left w-16">{ingredientUnit.to_unit_qty}</TableCell>
        <TableCell className="text-left w-24">{getUnitName(ingredientUnit.to_unit_id)}</TableCell> */}
        <TableCell className="text-left w-16">
            <Switch checked={ingredientUnit.is_default} disabled />
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
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        aria-label="Edit ingredient unit"
                        className="h-7 w-7"
                    >
                        <SquarePen className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 text-destructive hover:text-destructive/80"
                                aria-label="Remove ingredient unit"
                            >
                                <Trash className="h-4 w-4" />
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
    const { token, tenantId } = useAuth();
    const { units } = useUnitQuery({
        token,
        tenantId,
    });
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<IngredientUnitData | null>(null);
    const ingredientUnits = watch("ingredient_units") as unknown as IngredientUnitsFormData;
    const existingIngredientUnits = ingredientUnits?.data || [];
    const removedIngredientUnits = watch("ingredient_units.remove") || [];
    const inventoryUnitId = watch("inventory_unit_id");

    // Filter units based on inventory unit ID and current ingredient units
    const filteredUnits: UnitDataDto[] = units
        .filter((unit: UnitDto) => !!unit.id) // Only include units with an id
        .filter((unit: UnitDto) => {
            // Don't include inventory unit in the list of selectable units
            if (unit.id === inventoryUnitId) return false;

            // Get ingredient units excluding the one currently being edited
            const otherIngredientUnits = existingIngredientUnits.filter(iu =>
                iu.id !== editingId
            );

            // Get all to_unit_ids from other existing ingredient units
            const existingToUnitIds = otherIngredientUnits.map(iu => iu.to_unit_id || "");

            // Check if the unit is not used as to_unit_id in any other existing ingredient units
            return !existingToUnitIds.includes(unit.id ?? "");
        }) as UnitDataDto[];

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
        ingredientUnit => !removedIngredientUnits.some(removed => removed.product_ingredient_unit_id === ingredientUnit.id)
    );

    const hasIngredientUnits = displayIngredientUnits.length > 0 || ingredientUnitFields.length > 0;

    const getUnitName = (unitId: string) => {
        return units.find((unit: UnitDto) => unit.id === unitId)?.name ?? '-';
    };

    const handleStartEdit = (ingredientUnit: IngredientUnitData) => {
        setEditingId(ingredientUnit.id ?? null);
        setEditForm(ingredientUnit);
    };

    const handleSaveEdit = (ingredientUnit: IngredientUnitData) => {
        if (!editForm || !ingredientUnit.id) return;

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
        const currentIngredientUnits = watch("ingredient_units") as unknown as IngredientUnitsFormData;
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

            // Keep the complete data structure for local use
            const updatedIngredientUnits = {
                ...currentIngredientUnits,
                data: updatedData,
                update: [...(currentIngredientUnits.update || []), updatedIngredientUnit]
            };

            // Update the form state while preserving the data property
            setValue("ingredient_units", updatedIngredientUnits);
        } else {
            // Add to update array if data array doesn't exist
            appendIngredientUnitUpdate(updatedIngredientUnit);
        }

        setEditingId(null);
        setEditForm(null);
    };


    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ingredient Units</h2>
                {currentMode !== formType.VIEW && (
                    <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={() => {
                            appendIngredientUnit({
                                from_unit_id: inventoryUnitId,
                                from_unit_qty: 1,
                                to_unit_id: "",
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
                        Add Ingredient Unit
                    </Button>
                )}
            </div>

            {hasIngredientUnits ? (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted">
                            <TableRow>
                                <TableHead className="text-left w-24 font-medium">Ingredient Unit</TableHead>
                                <TableHead className="text-left w-24 font-medium">To Unit</TableHead>
                                <TableHead className="text-left w-16 font-medium">Default</TableHead>
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
                                            filteredUnits={filteredUnits}
                                        />
                                    ) : (
                                        <DisplayRow
                                            ingredientUnit={ingredientUnit}
                                            onEdit={() => handleStartEdit(ingredientUnit)}
                                            onRemove={() => appendIngredientUnitRemove({ product_ingredient_unit_id: ingredientUnit.id! })}
                                            currentMode={currentMode}
                                            getUnitName={getUnitName}
                                        />
                                    )}
                                </TableRow>
                            ))}

                            {/* New Ingredient Units */}
                            {ingredientUnitFields.map((field, index) => {
                                const currentToUnitQty = watch(`ingredient_units.add.${index}.to_unit_qty`) || 0;
                                const currentToUnitId = watch(`ingredient_units.add.${index}.to_unit_id`) || "";

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
                                                    name={`ingredient_units.add.${index}.to_unit_qty`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    className="w-16 h-7"
                                                                    {...field}
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
                                                    name={`ingredient_units.add.${index}.to_unit_id`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Select onValueChange={field.onChange} value={field.value}>
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
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
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
                                        <TableCell className="text-left w-28">
                                            {field.from_unit_id && currentToUnitId ? (
                                                <div>
                                                    <p className="text-xs font-medium">{`1 ${getUnitName(field.from_unit_id)} = ${currentToUnitQty} ${getUnitName(currentToUnitId)}`}</p>
                                                    <p className="text-muted-foreground text-[11px]">{`Qty x ${currentToUnitQty * field.from_unit_qty}`}</p>
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
                                                    aria-label="Remove ingredient unit"
                                                    className="h-7 w-7 text-destructive hover:text-destructive/80"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    {!inventoryUnitId ? (
                        <p className="text-gray-500 mb-4">Please select inventory unit first</p>
                    ) : (
                        <p className="text-gray-500 mb-4">No ingredient units defined yet</p>
                    )}
                </div>
            )}
        </Card>
    );
}
