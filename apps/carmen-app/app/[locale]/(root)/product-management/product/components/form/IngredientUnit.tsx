import { Control, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { formType } from "@/dtos/form.dto";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useUnit } from "@/hooks/useUnit";

interface IngredientUnitProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

export default function IngredientUnit({ control, currentMode }: IngredientUnitProps) {
    const { units } = useUnit();

    const { fields: ingredientUnitFields, append: appendIngredientUnit, remove: removeIngredientUnit } = useFieldArray({
        control,
        name: "ingredient_units.add"
    });

    const { fields: ingredientUnitUpdateFields, append: appendIngredientUnitUpdate, remove: removeIngredientUnitUpdate } = useFieldArray({
        control,
        name: "ingredient_units.update"
    });

    const { fields: ingredientUnitRemoveFields, append: appendIngredientUnitRemove, remove: removeIngredientUnitRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove"
    });

    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Ingredient Units</h2>
                <div className="space-x-2">
                    <Button
                        type="button"
                        variant="outline"
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
                        <Plus className="h-4 w-4 mr-2" />
                        Add Ingredient Unit
                    </Button>
                    {currentMode === formType.EDIT && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendIngredientUnitRemove({ id: "" })}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Ingredient Unit
                        </Button>
                    )}
                </div>
            </div>

            {/* Add Ingredient Units */}
            <div className="space-y-4">
                {ingredientUnitFields.map((field, index) => (
                    <Card key={field.id} className="p-4 space-y-4">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeIngredientUnit(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`ingredient_units.add.${index}.from_unit_id`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Unit</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select from unit" />
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
                            <FormField
                                control={control}
                                name={`ingredient_units.add.${index}.from_unit_qty`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>From Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter quantity"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
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
                                    <FormItem>
                                        <FormLabel>To Unit</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select to unit" />
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
                            <FormField
                                control={control}
                                name={`ingredient_units.add.${index}.to_unit_qty`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>To Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Enter quantity"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={control}
                            name={`ingredient_units.add.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex space-x-4">
                            <FormField
                                control={control}
                                name={`ingredient_units.add.${index}.is_active`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Active</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name={`ingredient_units.add.${index}.is_default`}
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Is Default</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </Card>
                ))}
            </div>

            {/* Update Ingredient Units */}
            {currentMode === formType.EDIT && ingredientUnitUpdateFields.length > 0 && (
                <div className="space-y-4 mt-4">
                    <h3 className="text-md font-semibold">Update Ingredient Units</h3>
                    {ingredientUnitUpdateFields.map((field, index) => (
                        <Card key={field.id} className="p-4 space-y-4">
                            {/* Similar fields as Add Ingredient Units but with update path */}
                            {/* ... */}
                        </Card>
                    ))}
                </div>
            )}

            {/* Remove Ingredient Units */}
            {currentMode === formType.EDIT && ingredientUnitRemoveFields.length > 0 && (
                <div className="space-y-4 mt-4">
                    <h3 className="text-md font-semibold">Remove Ingredient Units</h3>
                    {ingredientUnitRemoveFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                            <div className="flex items-end gap-4">
                                <FormField
                                    control={control}
                                    name={`ingredient_units.remove.${index}.id`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Ingredient Unit to Remove</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select ingredient unit to remove" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ingredientUnitUpdateFields.map((unit) => (
                                                            <SelectItem key={unit.id} value={unit.id}>
                                                                {`${units.find(u => u.id === unit.from_unit_id)?.name || "Unknown"} -> ${units.find(u => u.id === unit.to_unit_id)?.name || "Unknown"}`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeIngredientUnitRemove(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
