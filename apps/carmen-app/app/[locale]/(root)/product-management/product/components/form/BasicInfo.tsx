import { formType } from "@/dtos/form.dto";
import { Control, useFormContext } from "react-hook-form";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUnit } from "@/hooks/useUnit";
import { useItemGroup } from "@/hooks/useItemGroup";
import { useAuth } from "@/context/AuthContext";
import { getCategoryListByItemGroup } from "@/services/product.service";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";

interface BasicInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
    readonly handleEditClick?: (e: React.MouseEvent) => void;
    readonly handleCancelClick?: (e: React.MouseEvent) => void;
}

interface CategoryData {
    category: { id: string; name: string };
    subCategory: { id: string; name: string };
}

export default function BasicInfo({ control, currentMode, handleEditClick, handleCancelClick }: BasicInfoProps) {
    const { token, tenantId } = useAuth();
    const { units } = useUnit();
    const { itemGroups } = useItemGroup();
    const { watch, setValue } = useFormContext<ProductFormValues>();

    const [categoryData, setCategoryData] = useState<CategoryData>({
        category: { id: '', name: '' },
        subCategory: { id: '', name: '' }
    });

    const status = watch('product_status_type');

    // Store selectedValue for change detection
    const [selectedItemGroup, setSelectedItemGroup] = useState<string>('');
    const productItemGroupId = watch('product_info.product_item_group_id');

    // Always ensure product_status_type is set to 'active' as required by the schema
    useEffect(() => {
        setValue('product_status_type', 'active');
    }, [setValue]);

    // Fetch data when selectedItemGroup changes (user interaction)
    useEffect(() => {
        if (!selectedItemGroup) return;

        const fetchCategoryData = async () => {
            try {
                // Clear previous values first
                setCategoryData({
                    category: { id: '', name: '' },
                    subCategory: { id: '', name: '' }
                });

                const response = await getCategoryListByItemGroup(token, tenantId, selectedItemGroup);

                // Update local state
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
                setValue('product_category', newCategoryData.category);
                setValue('product_sub_category', newCategoryData.subCategory);
            } catch (error) {
                console.error('Error fetching category data:', error);
                setCategoryData({
                    category: { id: '', name: '' },
                    subCategory: { id: '', name: '' }
                });
            }
        };

        fetchCategoryData();
    }, [selectedItemGroup, token, tenantId, setValue]);

    // Initial data fetch on view mode
    const initialLoadRef = useRef(false);
    useEffect(() => {
        if (initialLoadRef.current) return;

        if (productItemGroupId && currentMode === formType.VIEW && !initialLoadRef.current) {
            initialLoadRef.current = true;

            const fetchInitialData = async () => {
                try {
                    const response = await getCategoryListByItemGroup(token, tenantId, productItemGroupId);

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
                } catch (error) {
                    console.error('Error fetching initial category data:', error);
                }
            };

            fetchInitialData();
        }
    }, [productItemGroupId, currentMode, token, tenantId]);

    const handleItemGroupChange = (value: string) => {
        setSelectedItemGroup(value);
    };

    return (
        <Card className="p-4">
            <div className="flex flex-row gap-2 justify-between border-b pb-2">
                <div className="flex gap-6 items-start ">
                    <FormField
                        control={control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <p className="text-xs text-muted-foreground font-semibold">Product Code</p>
                                {currentMode === formType.VIEW ? (
                                    <p className="text-base font-medium">{field.value}</p>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="Enter product code" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-start gap-2">
                        <FormField
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-xs text-muted-foreground font-semibold">Product Name</p>
                                    {currentMode === formType.VIEW ? (
                                        <p className="text-base font-medium">{field.value}</p>
                                    ) : (
                                        <FormControl>
                                            <Input placeholder="Enter product name" {...field} />
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {status && (
                            <Badge>
                                {status}
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex flex-row gap-2 justify-end">
                    {currentMode === formType.VIEW ? (
                        <>
                            <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            <Button variant="default" size={'sm'} onClick={handleEditClick}>
                                <Pencil className="h-4 w-4" /> Edit
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                <X className="h-4 w-4" /> Cancel
                            </Button>
                            <Button
                                variant="default"
                                size={'sm'}
                                type="submit"
                            >
                                <Save className="h-4 w-4" /> Save
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2 pt-2 space-y-2">
                <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem >
                            <p className="text-xs text-muted-foreground font-semibold">Description</p>
                            {currentMode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Textarea placeholder="Enter product description" {...field} />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="local_name"
                    render={({ field }) => (
                        <FormItem>
                            <p className="text-xs text-muted-foreground font-semibold">Local Description</p>
                            {currentMode === formType.VIEW ? (
                                <p className="text-xs">{field.value}</p>
                            ) : (
                                <FormControl>
                                    <Input placeholder="Enter local name" {...field} />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">Category</p>
                    {currentMode === formType.VIEW ? (
                        <p className="text-xs">
                            {categoryData.category.name}
                        </p>
                    ) : (
                        <Input
                            placeholder="Select Category"
                            value={categoryData.category.name}
                            disabled
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-semibold">Sub Category</p>
                    {currentMode === formType.VIEW ? (
                        <p className="text-xs">
                            {categoryData.subCategory.name}
                        </p>
                    ) : (
                        <Input
                            placeholder="Select Sub Category"
                            value={categoryData.subCategory.name}
                            disabled
                        />
                    )}
                </div>

                <FormField
                    control={control}
                    name="product_info.product_item_group_id"
                    render={({ field }) => (
                        <FormItem>
                            <p className="text-xs text-muted-foreground font-semibold">Product Item Group</p>
                            {currentMode === formType.VIEW ? (
                                <p className="text-xs">
                                    {itemGroups.find(group => group.id === field.value)?.name ?? field.value}
                                </p>
                            ) : (
                                <FormControl>
                                    <Select
                                        onValueChange={(value) => {
                                            handleItemGroupChange(value);
                                            field.onChange(value);
                                        }}
                                        value={field.value || ''}
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
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="inventory_unit_id"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-col">
                                <p className="text-xs text-muted-foreground font-semibold">Primary Inventory Unit</p>
                                {currentMode === formType.VIEW ? (
                                    <Badge className="bg-blue-200 text-blue-800 mt-2 w-10 hover:bg-blue-300">
                                        {units.find(unit => unit.id === field.value)?.name ?? field.value}
                                    </Badge>
                                ) : (
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value || ''}>
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
                                )}
                            </div>

                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.is_ingredients"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <p className="text-xs text-muted-foreground font-semibold">Use for Ingredients</p>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={currentMode === formType.VIEW}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


            </div>
        </Card>
    );
}
