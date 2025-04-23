import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, PenIcon, Plus, Trash2, X } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

interface IngredientUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
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

interface UnitData {
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
    units
}: {
    editForm: IngredientUnitData | null;
    onSave: () => void;
    onCancel: () => void;
    setEditForm: React.Dispatch<React.SetStateAction<IngredientUnitData | null>>;
    units: UnitData[];
}) => {
    const handleFieldChange = (field: keyof IngredientUnitData, value: string | number | boolean) => {
        if (!editForm) return;
        setEditForm({ ...editForm, [field]: value });
    };

    return (
        <>
            <TableCell>
                <Select
                    value={editForm?.from_unit_id}
                    onValueChange={(value) => handleFieldChange('from_unit_id', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    className="w-[100px]"
                    value={editForm?.from_unit_qty}
                    onChange={(e) => handleFieldChange('from_unit_qty', Number(e.target.value))}
                />
            </TableCell>
            <TableCell>
                <Select
                    value={editForm?.to_unit_id}
                    onValueChange={(value) => handleFieldChange('to_unit_id', value)}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.id ?? ""}>
                                {unit.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    className="w-[100px]"
                    value={editForm?.to_unit_qty}
                    onChange={(e) => handleFieldChange('to_unit_qty', Number(e.target.value))}
                />
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={editForm?.is_active ? 'bg-green-100 text-green-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                    onClick={() => handleFieldChange('is_active', !editForm?.is_active)}
                >
                    {editForm?.is_active ? 'Active' : 'Inactive'}
                </Badge>
            </TableCell>
            <TableCell>
                <Badge
                    variant="secondary"
                    className={editForm?.is_default ? 'bg-blue-100 text-blue-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                    onClick={() => handleFieldChange('is_default', !editForm?.is_default)}
                >
                    {editForm?.is_default ? 'Default' : 'Not Default'}
                </Badge>
            </TableCell>
            <TableCell>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onSave}
                    >
                        <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                    >
                        <X className="h-4 w-4 text-red-600" />
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
        <TableCell>{getUnitName(ingredientUnit.from_unit_id)}</TableCell>
        <TableCell>{ingredientUnit.from_unit_qty}</TableCell>
        <TableCell>{getUnitName(ingredientUnit.to_unit_id)}</TableCell>
        <TableCell>{ingredientUnit.to_unit_qty}</TableCell>
        <TableCell>
            <Badge variant="secondary" className={ingredientUnit.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {ingredientUnit.is_active ? 'Active' : 'Inactive'}
            </Badge>
        </TableCell>
        <TableCell>
            <Badge variant="secondary" className={ingredientUnit.is_default ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                {ingredientUnit.is_default ? 'Default' : 'Not Default'}
            </Badge>
        </TableCell>
        <TableCell>
            <div className="flex gap-1">
                {currentMode !== formType.ADD && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onEdit}
                        disabled={currentMode === formType.VIEW}
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
                            className="text-destructive"
                            disabled={currentMode === formType.VIEW}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Remove Ingredient Unit</AlertDialogTitle>
                            <AlertDialogDescription className="space-y-2">
                                <p>Are you sure you want to remove this ingredient unit?</p>
                                <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
                                    <p><span className="font-semibold">From Unit:</span> {getUnitName(ingredientUnit.from_unit_id)}</p>
                                    <p><span className="font-semibold">To Unit:</span> {getUnitName(ingredientUnit.to_unit_id)}</p>
                                    <p><span className="font-semibold">Description:</span> {ingredientUnit.description ?? '-'}</p>
                                </div>
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={onRemove}>
                                Remove
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </TableCell>
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
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ingredient Units</h2>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => appendIngredientUnit({
                        from_unit_id: "",
                        from_unit_qty: 0,
                        to_unit_id: "",
                        to_unit_qty: 0,
                        description: "",
                        is_active: true,
                        is_default: false
                    })}
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus />
                    Add Ingredient Unit
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>From Unit</TableHead>
                        <TableHead>From Qty</TableHead>
                        <TableHead>To Unit</TableHead>
                        <TableHead>To Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Default</TableHead>
                        <TableHead>Action</TableHead>
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
                                    units={units}
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
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${index}.from_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select unit" />
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
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${index}.from_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="w-[100px]"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${index}.to_unit_id`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select unit" />
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
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${index}.to_unit_qty`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="w-[100px]"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Active
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <FormField
                                    control={control}
                                    name={`ingredient_units.add.${index}.is_default`}
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <Badge
                                                    variant="secondary"
                                                    className={field.value ? 'bg-blue-100 text-blue-800 cursor-pointer' : 'bg-gray-100 text-gray-800 cursor-pointer'}
                                                    onClick={() => field.onChange(!field.value)}
                                                >
                                                    {field.value ? 'Default' : 'Not Default'}
                                                </Badge>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeIngredientUnit(index)}
                                    className="text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
