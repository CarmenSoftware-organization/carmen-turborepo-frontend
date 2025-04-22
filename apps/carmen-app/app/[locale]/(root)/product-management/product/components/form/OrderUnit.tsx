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

interface OrderUnitProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
}

export default function OrderUnit({ control, currentMode }: OrderUnitProps) {
    const { units } = useUnit();

    const { fields: orderUnitFields, append: appendOrderUnit, remove: removeOrderUnit } = useFieldArray({
        control,
        name: "order_units.add"
    });

    const { fields: orderUnitUpdateFields, append: appendOrderUnitUpdate, remove: removeOrderUnitUpdate } = useFieldArray({
        control,
        name: "order_units.update"
    });

    const { fields: orderUnitRemoveFields, append: appendOrderUnitRemove, remove: removeOrderUnitRemove } = useFieldArray({
        control,
        name: "order_units.remove"
    });

    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Units</h2>
                <div className="space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => appendOrderUnit({
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
                        Add Order Unit
                    </Button>
                    {currentMode === formType.EDIT && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendOrderUnitRemove({ id: "" })}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Order Unit
                        </Button>
                    )}
                </div>
            </div>

            {/* Add Order Units */}
            <div className="space-y-4">
                {orderUnitFields.map((field, index) => (
                    <Card key={field.id} className="p-4 space-y-4">
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeOrderUnit(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`order_units.add.${index}.from_unit_id`}
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
                                name={`order_units.add.${index}.from_unit_qty`}
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
                                name={`order_units.add.${index}.to_unit_id`}
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
                                name={`order_units.add.${index}.to_unit_qty`}
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
                            name={`order_units.add.${index}.description`}
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
                                name={`order_units.add.${index}.is_active`}
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
                                name={`order_units.add.${index}.is_default`}
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

            {/* Update Order Units */}
            {currentMode === formType.EDIT && orderUnitUpdateFields.length > 0 && (
                <div className="space-y-4 mt-4">
                    <h3 className="text-md font-semibold">Update Order Units</h3>
                    {orderUnitUpdateFields.map((field, index) => (
                        <Card key={field.id} className="p-4 space-y-4">
                            {/* Similar fields as Add Order Units but with update path */}
                            {/* ... */}
                        </Card>
                    ))}
                </div>
            )}

            {/* Remove Order Units */}
            {currentMode === formType.EDIT && orderUnitRemoveFields.length > 0 && (
                <div className="space-y-4 mt-4">
                    <h3 className="text-md font-semibold">Remove Order Units</h3>
                    {orderUnitRemoveFields.map((field, index) => (
                        <Card key={field.id} className="p-4">
                            <div className="flex items-end gap-4">
                                <FormField
                                    control={control}
                                    name={`order_units.remove.${index}.id`}
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Order Unit to Remove</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select order unit to remove" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {orderUnitUpdateFields.map((unit) => (
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
                                    onClick={() => removeOrderUnitRemove(index)}
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
