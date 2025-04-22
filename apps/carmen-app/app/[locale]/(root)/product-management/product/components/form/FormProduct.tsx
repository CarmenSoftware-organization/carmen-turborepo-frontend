"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { createProductService, updateProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import BasicInfo from "./BasicInfo";
import PriceInfo from "./PriceInfo";
import LocationInfo from "./LocationInfo";
import OrderUnit from "./OrderUnit";
import IngredientUnit from "./IngredientUnit";
import ProductInfo from "./ProductInfo";
import { ProductFormValues, productFormSchema } from "../../pd-schema";
import { useState } from "react";
import { useRouter } from "@/lib/navigation";
import { ArrowLeft, Pencil, Save, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { mockStockInventoryData } from "@/mock-data/stock-invent";
import InventoryInfo from "./InventoryInfo";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface Props {
    readonly mode: formType;
    readonly initialValues?: any;
}

export default function FormProduct({ mode, initialValues }: Props) {
    const { token, tenantId } = useAuth();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const router = useRouter();
    const transformInitialValues = () => {
        if (!initialValues) return undefined;

        return {
            id: initialValues.id,
            name: initialValues.name,
            code: initialValues.code,
            local_name: initialValues.local_name,
            description: initialValues.description,
            inventory_unit_id: initialValues.inventory_unit?.id,
            product_status_type: initialValues.product_status_type,
            product_info: {
                id: initialValues.product_info?.id,
                product_item_group_id: initialValues.product_item_group?.id,
                is_ingredients: initialValues.product_info?.is_ingredients ?? false,
                price: initialValues.product_info?.price ?? 0,
                tax_type: initialValues.product_info?.tax_type ?? "none",
                tax_rate: initialValues.product_info?.tax_rate ?? 0,
                price_deviation_limit: initialValues.product_info?.price_deviation_limit ?? 0,
                qty_deviation_limit: initialValues.product_info?.qty_deviation_limit ?? 0,
                info: initialValues.product_info?.info ?? []
            },
            locations: {
                data: initialValues.locations?.map((location: any) => ({
                    id: location.id,
                    location_id: location.location_id
                })) ?? [],
                add: [],
                remove: [],
            },
            order_units: {
                data: initialValues.order_units?.map((unit: any) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                })) ?? [],
                add: [],
                update: [],
                remove: []
            },
            ingredient_units: {
                data: initialValues.ingredient_units?.map((unit: any) => ({
                    id: unit.id,
                    from_unit_id: unit.from_unit_id,
                    from_unit_qty: unit.from_unit_qty,
                    to_unit_id: unit.to_unit_id,
                    to_unit_qty: unit.to_unit_qty,
                })) ?? [],
                add: [],
                update: [],
                remove: []
            },
            product_category: {
                id: initialValues.product_category?.id,
                name: initialValues.product_category?.name,
            },
            product_sub_category: {
                id: initialValues.product_sub_category?.id,
                name: initialValues.product_sub_category?.name,
            }
        };
    };

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: transformInitialValues()
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            // Create a copy of the data and remove .data properties
            const { locations, order_units, ingredient_units, ...restData } = data;
            const submitData = {
                ...restData,
                locations: {
                    add: locations.add,
                    remove: locations.remove?.map(item => ({
                        product_location_id: item.id
                    }))
                },
                order_units: {
                    add: order_units.add,
                    update: order_units.update,
                    remove: order_units.remove
                },
                ingredient_units: {
                    add: ingredient_units.add,
                    update: ingredient_units.update,
                    remove: ingredient_units.remove
                }
            };

            if (mode === formType.ADD) {
                const result = await createProductService(token, tenantId, submitData);
                toastSuccess({ message: "Product created successfully" });
                setCurrentMode(formType.VIEW);
                if (result?.id) {
                    router.replace(`/product-management/product/${result.id}`);
                }
            } else {
                if (!submitData.id) {
                    throw new Error('Product ID is required for update');
                }
                await updateProductService(token, tenantId, submitData.id, submitData);
                toastSuccess({ message: "Product updated successfully" });
                setCurrentMode(formType.VIEW);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            toastError({ message: "Error submitting form" });
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Edit button clicked, current mode:', currentMode);
        setCurrentMode(formType.EDIT);
    };

    const handleCancelClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentMode === formType.ADD || currentMode === formType.VIEW) {
            router.push("/product-management/product");
        } else {
            setCurrentMode(formType.VIEW);
        }
    };


    return (
        <div className="container mx-auto">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <div className="flex flex-row gap-2 justify-end">
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
                    <ScrollArea className="h-[calc(100vh-160px)]">
                        <BasicInfo control={form.control} currentMode={currentMode} />

                        <Tabs defaultValue="priceInfo" className="mt-2">
                            <TabsList>
                                <TabsTrigger value="priceInfo">Price Info</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="orderUnit">Order Unit</TabsTrigger>
                                <TabsTrigger value="ingredientUnit">Ingredient Unit</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            </TabsList>
                            <TabsContent value="priceInfo">
                                <div className="grid grid-cols-2 gap-4">
                                    <PriceInfo control={form.control} currentMode={currentMode} />
                                    <ProductInfo control={form.control} currentMode={currentMode} />
                                </div>
                            </TabsContent>
                            <TabsContent value="location">
                                <LocationInfo control={form.control} currentMode={currentMode} />
                            </TabsContent>
                            <TabsContent value="orderUnit">
                                <OrderUnit control={form.control} currentMode={currentMode} />
                            </TabsContent>
                            <TabsContent value="ingredientUnit">
                                <IngredientUnit control={form.control} currentMode={currentMode} />
                            </TabsContent>
                            <TabsContent value="inventory">
                                {(currentMode === formType.EDIT || currentMode === formType.VIEW) && (
                                    <InventoryInfo inventoryData={mockStockInventoryData} />
                                )}
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </form>
            </Form>
        </div>
    );
} 