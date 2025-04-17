import { UnitDto } from "@/dtos/unit.dto";
import { Control, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "./ProductDetail";
import { formType } from "@/dtos/form.dto";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface IngredientUnit {
    id: string;
    from_unit_id: string;
    from_unit_name: string;
    from_unit_qty: number;
    to_unit_id: string;
    to_unit_name: string;
    to_unit_qty: number;
    unit_type: string;
    description: string;
    is_active: boolean;
    is_default: boolean;
}

interface IngredientUnitFormFieldsProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
    initValues?: IngredientUnit[];
    units: UnitDto[];
}


export default function IngredientUnitInfo({ control, currentMode, initValues, units }: IngredientUnitFormFieldsProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [ingredientUnitToDelete, setIngredientUnitToDelete] = useState<{ index: number; isEdit: boolean } | null>(null);

    const { fields: editFields, replace: replaceEdit } = useFieldArray({
        control,
        name: "ingredient_units.update",
    });

    const { fields: removeFields, replace: replaceRemove } = useFieldArray({
        control,
        name: "ingredient_units.remove",
    });

    const { fields: addFields, append, remove } = useFieldArray({
        control,
        name: "ingredient_units.add",
    });

    // Log ข้อมูลเพื่อตรวจสอบ currentMode 
    // useEffect(() => {
    //     console.log("IngredientUnitInfo renderใหม่ - currentMode:", currentMode);
    //     console.log("IngredientUnitInfo - initValues:", initValues);
    //     console.log("IngredientUnitInfo - editFields:", editFields);
    //     console.log("IngredientUnitInfo - addFields:", addFields);
    // }, [currentMode, initValues, editFields, addFields]);

    // ล้าง update array เมื่อเป็น ADD mode
    useEffect(() => {
        if (currentMode === formType.ADD) {
            replaceEdit([]);
        }
    }, [currentMode, replaceEdit]);

    // เพิ่มข้อมูลเฉพาะเมื่อเป็น EDIT mode และมีข้อมูลเดิม
    useEffect(() => {
        if (currentMode === formType.EDIT && initValues && initValues.length > 0) {
            // Only set update fields if we're in EDIT mode and there are existing ingredient units
            replaceEdit(initValues.map(unit => ({
                product_order_unit_id: unit.id,
                from_unit_id: unit.from_unit_id,
                from_unit_qty: unit.from_unit_qty,
                to_unit_id: unit.to_unit_id,
                to_unit_qty: unit.to_unit_qty,
                description: unit.description,
                is_active: unit.is_active,
                is_default: unit.is_default
            })));
        } else if (currentMode === formType.EDIT) {
            // Clear update fields if there are no existing ingredient units
            replaceEdit([]);
        }
    }, [currentMode, initValues, replaceEdit]);

    const handleAddIngredientUnit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        append({
            from_unit_id: "",
            from_unit_qty: 0,
            to_unit_id: "",
            to_unit_qty: 0,
            description: "",
            is_active: true,
            is_default: false
        });

        // เมื่ออยู่ใน ADD mode ล้างข้อมูล update
        if (currentMode === formType.ADD) {
            replaceEdit([]);
        }
    };

    const handleRemoveIngredientUnit = (e: React.MouseEvent<HTMLButtonElement>, index: number, isEdit: boolean = false) => {
        e.preventDefault();
        e.stopPropagation();
        setIngredientUnitToDelete({ index, isEdit });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!ingredientUnitToDelete) return;

        const { index, isEdit } = ingredientUnitToDelete;
        if (isEdit) {
            const ingredientUnitToRemove = editFields[index];
            // Add to remove array
            const currentRemove = removeFields.map(field => field.product_order_unit_id);
            if (!currentRemove.includes(ingredientUnitToRemove.product_order_unit_id)) {
                replaceRemove([...removeFields, { product_order_unit_id: ingredientUnitToRemove.product_order_unit_id }]);
            }
            // Remove from edit array
            const newEditFields = editFields.filter((_, i) => i !== index);
            replaceEdit(newEditFields);
        } else {
            remove(index);
        }
        setDeleteDialogOpen(false);
        setIngredientUnitToDelete(null);
    };

    const handleDialogOpenChange = (open: boolean) => {
        setDeleteDialogOpen(open);
        if (!open) {
            setIngredientUnitToDelete(null);
        }
    };

    // คำนวณข้อมูลที่จะแสดงบน UI
    const ingredientUnitsToDisplay = currentMode === formType.VIEW
        ? (Array.isArray(initValues) ? initValues : [])
        : editFields;

    // Function to get unit name
    const getUnitName = (unitId: string) => {
        return units?.find(unit => unit.id === unitId)?.name || '';
    };

    // Function to get unit by id
    const getUnitById = (unitId: string) => {
        return units?.find(unit => unit.id === unitId);
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Ingredient Units</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredientUnit}
                    className="flex items-center gap-2"
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus className="h-4 w-4" />
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
                        <TableHead>Description</TableHead>
                        <TableHead>Active</TableHead>
                        <TableHead>Default</TableHead>
                        {(currentMode === formType.EDIT || currentMode === formType.ADD) && <TableHead>Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {/* แสดงข้อความเมื่อไม่มีข้อมูลทั้ง ingredientUnitsToDisplay และ addFields */}
                    {(ingredientUnitsToDisplay.length === 0 && addFields.length === 0) ? (
                        <TableRow>
                            <TableCell colSpan={8} className="text-center text-muted-foreground">No ingredient units added</TableCell>
                        </TableRow>
                    ) : (
                        <>
                            {/* แสดงข้อมูลจาก initValues หรือ editFields */}
                            {ingredientUnitsToDisplay.map((ingredientUnit, index: number) => {
                                const fromUnit = currentMode === formType.VIEW ?
                                    null : getUnitById(ingredientUnit.from_unit_id);
                                const toUnit = currentMode === formType.VIEW ?
                                    null : getUnitById(ingredientUnit.to_unit_id);
                                return (
                                    <TableRow key={ingredientUnit.id || `edit-${index}`}>
                                        {currentMode === formType.EDIT ? (
                                            <>
                                                <TableCell>
                                                    <FormField
                                                        control={control}
                                                        name={`ingredient_units.update.${index}.from_unit_id`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            field.onChange(value);
                                                                            // Force rerender by updating the field directly
                                                                            const newFields = [...editFields];
                                                                            newFields[index] = { ...newFields[index], from_unit_id: value };
                                                                            replaceEdit(newFields);
                                                                        }}
                                                                        value={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue placeholder="Select unit">
                                                                                {getUnitName(field.value)}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {units?.map((unit) => (
                                                                                <SelectItem
                                                                                    key={unit.id}
                                                                                    value={unit.id ?? ""}
                                                                                >
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
                                                        name={`ingredient_units.update.${index}.from_unit_qty`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        className="w-[100px]"
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
                                                        name={`ingredient_units.update.${index}.to_unit_id`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            field.onChange(value);
                                                                            // Force rerender by updating the field directly
                                                                            const newFields = [...editFields];
                                                                            newFields[index] = { ...newFields[index], to_unit_id: value };
                                                                            replaceEdit(newFields);
                                                                        }}
                                                                        value={field.value}
                                                                    >
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue placeholder="Select unit">
                                                                                {getUnitName(field.value)}
                                                                            </SelectValue>
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {units?.map((unit) => (
                                                                                <SelectItem
                                                                                    key={unit.id}
                                                                                    value={unit.id ?? ""}
                                                                                >
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
                                                        name={`ingredient_units.update.${index}.to_unit_qty`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        {...field}
                                                                        className="w-[100px]"
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
                                                        name={`ingredient_units.update.${index}.description`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input {...field} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <FormField
                                                        control={control}
                                                        name={`ingredient_units.update.${index}.is_active`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
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
                                                        name={`ingredient_units.update.${index}.is_default`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value}
                                                                        onCheckedChange={field.onChange}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </TableCell>
                                            </>
                                        ) : (
                                            <>
                                                <TableCell>{currentMode === formType.VIEW ? (ingredientUnit as IngredientUnit).from_unit_name : (fromUnit?.name || '-')}</TableCell>
                                                <TableCell>{ingredientUnit.from_unit_qty}</TableCell>
                                                <TableCell>{currentMode === formType.VIEW ? (ingredientUnit as IngredientUnit).to_unit_name : (toUnit?.name || '-')}</TableCell>
                                                <TableCell>{ingredientUnit.to_unit_qty}</TableCell>
                                                <TableCell>{ingredientUnit.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant={ingredientUnit.is_active ? "default" : "secondary"}>
                                                        {ingredientUnit.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={ingredientUnit.is_default ? "default" : "secondary"}>
                                                        {ingredientUnit.is_default ? 'Default' : 'Not Default'}
                                                    </Badge>
                                                </TableCell>
                                            </>
                                        )}
                                        {(currentMode === formType.EDIT || currentMode === formType.ADD) && (
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive"
                                                    onClick={(e) => handleRemoveIngredientUnit(e, index, true)}
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}

                            {/* แสดงข้อมูลที่กำลังเพิ่มใหม่เฉพาะในโหมด EDIT หรือ ADD */}
                            {(currentMode === formType.EDIT || currentMode === formType.ADD) && addFields.map((field, index) => {

                                return (
                                    <TableRow key={field.id || `add-${index}`}>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`ingredient_units.add.${index}.from_unit_id`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value);
                                                                    // Force rerender
                                                                    const newFields = [...addFields];
                                                                    newFields[index] = { ...newFields[index], from_unit_id: value };
                                                                    remove();
                                                                    newFields.forEach(f => append(f));
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select unit">
                                                                        {getUnitName(field.value)}
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {units?.map((unit) => (
                                                                        <SelectItem
                                                                            key={unit.id}
                                                                            value={unit.id ?? ""}
                                                                        >
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
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                className="w-[100px]"
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
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(value) => {
                                                                    field.onChange(value);
                                                                    // Force rerender
                                                                    const newFields = [...addFields];
                                                                    newFields[index] = { ...newFields[index], to_unit_id: value };
                                                                    remove();
                                                                    newFields.forEach(f => append(f));
                                                                }}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger className="w-[180px]">
                                                                    <SelectValue placeholder="Select unit">
                                                                        {getUnitName(field.value)}
                                                                    </SelectValue>
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {units?.map((unit) => (
                                                                        <SelectItem
                                                                            key={unit.id}
                                                                            value={unit.id ?? ""}
                                                                        >
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
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                {...field}
                                                                className="w-[100px]"
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
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <FormField
                                                control={control}
                                                name={`ingredient_units.add.${index}.is_active`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
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
                                                name={`ingredient_units.add.${index}.is_default`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                            />
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
                                                onClick={(e) => handleRemoveIngredientUnit(e, index)}
                                            >
                                                <Trash className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </>
                    )}
                </TableBody>
            </Table>

            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={handleDialogOpenChange}
                onConfirm={handleConfirmDelete}
                title="Delete Ingredient Unit"
                description="Are you sure you want to delete this ingredient unit?"
            />
        </Card>
    );
}
