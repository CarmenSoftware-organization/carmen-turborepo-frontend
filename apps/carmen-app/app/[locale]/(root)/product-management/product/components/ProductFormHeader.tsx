import { Control, useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "./ProductDetail";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useItemGroup } from "@/hooks/useItemGroup";
import { Textarea } from "@/components/ui/textarea";
import { useUnit } from "@/hooks/useUnit";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormFieldsProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initValues?: any;
}

export const ProductFormHeader = ({ control, currentMode, initValues }: ProductFormFieldsProps) => {
    const { itemGroups } = useItemGroup();
    const { units } = useUnit();
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Product Name" {...field} disabled={currentMode === formType.VIEW} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="local_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Local Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Local Name" {...field} disabled={currentMode === formType.VIEW} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="code"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Code</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Product Code" {...field} disabled={currentMode === formType.VIEW} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="Select Category" defaultValue={initValues?.product_category?.name ?? ''} disabled />
            </div>

            <div className="space-y-2">
                <Label>Sub Category</Label>
                <Input placeholder="Select Sub Category" defaultValue={initValues?.product_sub_category?.name ?? ''} disabled />
            </div>

            <FormField
                control={control}
                name="product_info.product_item_group_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Item Group</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={currentMode === formType.VIEW}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Product Item Group" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {itemGroups.map((itemGroup) => (
                                    <SelectItem key={itemGroup.id} value={itemGroup.id}>
                                        {itemGroup.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="inventory_unit_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <FormControl>
                            <Select
                                onValueChange={(value) => {
                                    const selectedUnit = units.find(unit => unit.id === value);
                                    field.onChange(value);
                                    form.setValue('inventory_unit_name', selectedUnit?.name ?? '');
                                }}
                                value={field.value}
                                disabled={currentMode === formType.VIEW}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Inventory Unit" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id ?? ''} value={unit.id ?? ''}>
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
                name="product_info.is_ingredients"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-center gap-2">
                            <FormLabel>Use for Ingredients</FormLabel>
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={currentMode === formType.VIEW}
                                />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-full">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea
                                className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="Enter Description"
                                {...field}
                                disabled={currentMode === formType.VIEW}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />


        </div>
    );
}; 