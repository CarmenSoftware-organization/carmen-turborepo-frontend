import { formType } from "@/dtos/form.dto";
import { Control, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnit } from "@/hooks/useUnit";
import { useItemGroup } from "@/hooks/useItemGroup";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { getCategoryListByItemGroup } from "@/services/product.service";
import { useEffect, useState } from "react";

interface BasicInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

interface CategoryData {
    category: { id: string; name: string };
    subCategory: { id: string; name: string };
}

export default function BasicInfo({ control, currentMode }: BasicInfoProps) {
    const { token, tenantId } = useAuth();
    const { units } = useUnit();
    const { itemGroups } = useItemGroup();
    const { watch, setValue } = useFormContext<ProductFormValues>();
    const [categoryData, setCategoryData] = useState<CategoryData>({
        category: { id: '', name: '' },
        subCategory: { id: '', name: '' }
    });

    const productItemGroupId = watch('product_info.product_item_group_id');

    const handleItemGroupChange = async (value: string) => {
        try {
            // Immediately clear previous values
            setCategoryData({
                category: { id: '', name: '' },
                subCategory: { id: '', name: '' }
            });

            const response = await getCategoryListByItemGroup(token, tenantId, value);

            // Update local state immediately
            const newCategoryData = {
                category: {
                    id: response.product_category.id,
                    name: response.product_category.name
                },
                subCategory: {
                    id: response.product_subcategory.id,
                    name: response.product_subcategory.name
                }
            };
            setCategoryData(newCategoryData);

            // Update form values
            setValue('product_category', newCategoryData.category);
            setValue('product_sub_category', newCategoryData.subCategory);
            setValue('product_info.product_item_group_id', value);
        } catch (error) {
            console.error('Error fetching category data:', error);
            // Reset on error
            setCategoryData({
                category: { id: '', name: '' },
                subCategory: { id: '', name: '' }
            });
        }
    };

    // Fetch category data on initial load if productItemGroupId exists
    useEffect(() => {
        if (productItemGroupId && currentMode === formType.VIEW) {
            handleItemGroupChange(productItemGroupId);
        }
    }, [productItemGroupId, currentMode]);

    return (
        <div className="rounded-lg border space-y-2 p-4">
            <h2 className="text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-3 gap-2">
                <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product name" {...field} disabled={currentMode === formType.VIEW} />
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
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter product code" {...field} disabled={currentMode === formType.VIEW} />
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
                                <Input placeholder="Enter local name" {...field} disabled={currentMode === formType.VIEW} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.product_item_group_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Item Group</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(value) => {
                                        handleItemGroupChange(value);
                                    }}
                                    value={field.value}
                                    disabled={currentMode === formType.VIEW}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select product item group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {itemGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id}>
                                                {group.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <Label>Sub Category</Label>
                    <Input
                        placeholder="Select Sub Category"
                        value={categoryData.subCategory.name}
                        disabled
                    />
                </div>

                <div className="space-y-2">
                    <Label>Category</Label>
                    <Input
                        placeholder="Select Category"
                        value={categoryData.category.name}
                        disabled
                    />
                </div>

                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="col-span-3">
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter product description" {...field} disabled={currentMode === formType.VIEW} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="inventory_unit_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Inventory Unit</FormLabel>
                            <FormControl>
                                <Select onValueChange={field.onChange} value={field.value} disabled={currentMode === formType.VIEW}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select inventory unit" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {units.map((unit) => (
                                            <SelectItem key={unit.id ?? ''} value={unit.id ?? ""}>
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
        </div>
    );
}
