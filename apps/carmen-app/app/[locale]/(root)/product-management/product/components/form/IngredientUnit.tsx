import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useUnit } from "@/hooks/useUnit";
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
    id: string;
    from_unit_id: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_qty: number;
    description?: string;
    is_active?: boolean;
    is_default?: boolean;
}

interface IngredientUnitsFormData {
    data: IngredientUnitData[];
    add: IngredientUnitData[];
    update: IngredientUnitData[];
    remove: { id: string }[];
}

export default function IngredientUnit({ control, currentMode }: IngredientUnitProps) {
    const { units } = useUnit();
    const { watch } = useFormContext<ProductFormValues>();
    const ingredientUnits = watch("ingredient_units") as IngredientUnitsFormData;
    const existingIngredientUnits = ingredientUnits?.data || [];
    const newIngredientUnits = watch("ingredient_units.add") || [];
    const removedIngredientUnits = watch("ingredient_units.remove") || [];

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    const { append: appendIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    // Filter out removed ingredient units
    const displayIngredientUnits = existingIngredientUnits.filter(
        ingredientUnit => !removedIngredientUnits.some(removed => removed.id === ingredientUnit.id)
    );

    const hasIngredientUnits = displayIngredientUnits.length > 0 || newIngredientUnits.length > 0;

    const getUnitName = (unitId: string) => {
        return units.find(unit => unit.id === unitId)?.name || '-';
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
                >
                    <Plus />
                    Add Ingredient Unit
                </Button>
            </div>

            {/* Ingredient Units Table */}
            {hasIngredientUnits && (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>From Unit</TableHead>
                            <TableHead>From Qty</TableHead>
                            <TableHead>To Unit</TableHead>
                            <TableHead>To Qty</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Default</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Existing Ingredient Units */}
                        {displayIngredientUnits.map((ingredientUnit) => (
                            <TableRow key={ingredientUnit.id}>
                                <TableCell>{getUnitName(ingredientUnit.from_unit_id)}</TableCell>
                                <TableCell>{ingredientUnit.from_unit_qty}</TableCell>
                                <TableCell>{getUnitName(ingredientUnit.to_unit_id)}</TableCell>
                                <TableCell>{ingredientUnit.to_unit_qty}</TableCell>
                                <TableCell>{ingredientUnit.description || '-'}</TableCell>
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
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
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
                                                        <p><span className="font-semibold">Description:</span> {ingredientUnit.description || '-'}</p>
                                                    </div>
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => appendIngredientUnitRemove({ id: ingredientUnit.id })}
                                                >
                                                    Remove
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
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
                                                                <SelectItem key={unit.id} value={unit.id || ""}>
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
                                                                <SelectItem key={unit.id} value={unit.id || ""}>
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
                                    <FormField
                                        control={control}
                                        name={`ingredient_units.add.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem className="space-y-0">
                                                <FormControl>
                                                    <Input {...field} />
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
                                        size="icon"
                                        onClick={() => removeIngredientUnit(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
