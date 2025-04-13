"use client";

import { useState, useEffect } from "react";
import { formType } from "@/dtos/form.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "@/lib/navigation";
import { Pencil, X, ArrowLeft, Save } from "lucide-react";
import { ProductFormHeader } from "./ProductFormHeader";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { BasicInfo } from "./BasicInfo";
import { LocationInfo } from "./LocationInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStoreLocation } from "@/hooks/useStoreLocation";
import OrderUnitInfo from "./OrderUnitInfo";
import { useUnit } from "@/hooks/useUnit";
import IngredientUnitInfo from "./IngredientUnitInfo";
import { createProductService, updateProductService } from "@/services/product.service";
import { useAuth } from "@/context/AuthContext";
import InventoryInfo from "./InventoryInfo";
import { mockStockInventoryData } from "@/mock-data/stock-invent";
// สร้าง schema validation ด้วย Zod
const productFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    code: z.string().min(1, "Code is required"),
    local_name: z.string().optional(),
    description: z.string().optional(),
    inventory_unit_id: z.string().uuid(),
    inventory_unit_name: z.string().min(1, "Inventory unit name is required"),
    product_status_type: z.literal("active"),
    product_info: z.object({
        product_item_group_id: z.string().uuid(),
        is_ingredients: z.boolean().default(false),
        price: z.number().min(0, "Price must be 0 or higher"),
        tax_type: z.enum(["none", "included", "excluded"]),
        tax_rate: z.number().min(0, "Tax rate must be 0 or higher"),
        price_deviation_limit: z.number().min(0, "Price deviation limit must be 0 or higher"),
        info: z.array(
            z.object({
                label: z.string().optional(),
                value: z.string().optional(),
            })
        ),
    }),
    locations: z.object({
        add: z.array(
            z.object({
                location_id: z.string().uuid(),
                location_name: z.string().optional(),
                location_type: z.string().optional(),
                delivery_point: z.any().optional(),
                is_active: z.boolean().optional(),
            })
        ),
        remove: z.array(
            z.object({
                location_id: z.string().uuid(),
            })
        ),
    }),
    order_units: z.object({
        add: z.array(
            z.object({
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string(),
                is_default: z.boolean(),
            })
        ),
        update: z.array(
            z.object({
                product_order_unit_id: z.string().uuid(),
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string(),
                is_default: z.boolean(),
            })
        ),
        remove: z.array(
            z.object({
                product_order_unit_id: z.string().uuid(),
            })
        ),
    }).optional(),
    ingredient_units: z.object({
        add: z.array(
            z.object({
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string().optional(),
                is_active: z.boolean(),
                is_default: z.boolean(),
            })
        ),
        update: z.array(
            z.object({
                product_order_unit_id: z.string().uuid(),
                from_unit_id: z.string().uuid(),
                from_unit_qty: z.number().min(0),
                to_unit_id: z.string().uuid(),
                to_unit_qty: z.number().min(0),
                description: z.string().optional(),
                is_active: z.boolean(),
                is_default: z.boolean(),
            })
        ),
        remove: z.array(
            z.object({
                product_order_unit_id: z.string().uuid(),
            })
        ),
    }).optional(),
    image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductDetailProps {
    readonly mode: formType;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly initValues?: any;
}

export default function ProductDetail({ mode, initValues }: ProductDetailProps) {
    const { token, tenantId } = useAuth();
    const router = useRouter();
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const [updatedInitValues, setUpdatedInitValues] = useState(initValues);
    const { storeLocations } = useStoreLocation();
    const { units } = useUnit();

    // ตรวจสอบโครงสร้างข้อมูล initValues เมื่อโหมดเปลี่ยน
    // useEffect(() => {
    //     console.log("ProductDetail - currentMode:", currentMode);
    //     console.log("ProductDetail - initValues:", initValues);
    //     console.log("ProductDetail - updatedInitValues:", updatedInitValues);
    // }, [currentMode, initValues, updatedInitValues]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initValues?.name ?? "",
            code: initValues?.code ?? "",
            description: initValues?.description ?? "",
            local_name: initValues?.local_name ?? "",
            inventory_unit_id: initValues?.inventory_unit?.id ?? "",
            inventory_unit_name: initValues?.inventory_unit?.name ?? "",
            product_status_type: "active",
            product_info: {
                product_item_group_id: initValues?.product_item_group?.id ?? "",
                is_ingredients: initValues?.product_info?.is_ingredients ?? false,
                price: initValues?.product_info?.price ?? 0,
                tax_type: initValues?.product_info?.tax_type ?? "none",
                tax_rate: initValues?.product_info?.tax_rate ?? 0,
                price_deviation_limit: initValues?.product_info?.price_deviation_limit ?? 0,
                info: initValues?.product_info?.info ?? [],
            },
            locations: {
                add: [],
                remove: [],
            },
            order_units: {
                add: [],
                update: mode === formType.EDIT && initValues?.order_units ?
                    (initValues.order_units.map((unit: { id: string; from_unit_id: string; from_unit_qty: number; to_unit_id: string; to_unit_qty: number; description: string; is_default: boolean; }) => ({
                        product_order_unit_id: unit.id,
                        from_unit_id: unit.from_unit_id,
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_qty: unit.to_unit_qty,
                        description: unit.description || '',
                        is_default: unit.is_default
                    })) ?? [])
                    : [],
                remove: [],
            },
            ingredient_units: {
                add: initValues?.ingredient_units?.add ?? [],
                update: mode === formType.EDIT && initValues?.ingredient_units ?
                    (initValues.ingredient_units.map((loc: { from_unit_id: string; id?: string }) => ({ from_unit_id: loc.from_unit_id })) ?? [])
                    : [],
                remove: [],
            },
        },
        mode: "onChange",
        reValidateMode: "onChange",
        shouldFocusError: true,
    });

    // Add effect to watch form changes
    useEffect(() => {
        const subscription = form.watch((value, { name, type }) => {
            console.log('Form field changed:', { name, type, value });
            console.log('Form is dirty:', form.formState.isDirty);
            console.log('Form is valid:', form.formState.isValid);
        });
        return () => subscription.unsubscribe();
    }, [form]);

    // อัพเดทค่าใน form ทุกครั้งที่ initValues เปลี่ยน
    useEffect(() => {
        if (initValues && currentMode === formType.EDIT) {
            if (initValues.order_units) {
                form.setValue('order_units.update',
                    initValues.order_units.map((unit: { id: string; from_unit_id: string; from_unit_qty: number; to_unit_id: string; to_unit_qty: number; description: string; is_default: boolean; }) => ({
                        product_order_unit_id: unit.id,
                        from_unit_id: unit.from_unit_id,
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_qty: unit.to_unit_qty,
                        description: unit.description || '',
                        is_default: unit.is_default
                    }))
                );
            }
            if (initValues.ingredient_units && initValues.ingredient_units.length > 0) {
                form.setValue('ingredient_units.update',
                    initValues.ingredient_units.map((unit: { id: string; from_unit_id: string; from_unit_qty: number; to_unit_id: string; to_unit_qty: number; description: string; is_default: boolean; }) => ({
                        product_order_unit_id: unit.id,
                        from_unit_id: unit.from_unit_id,
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_qty: unit.to_unit_qty,
                        description: unit.description || '',
                        is_default: unit.is_default
                    }))
                );
            }
        }
    }, [initValues, currentMode, form]);

    console.log('currentMode', currentMode);


    const onSubmit = async (data: ProductFormValues) => {
        console.log('Form submission started');
        console.log('Form state:', form.getValues());
        console.log('Form errors:', form.formState.errors);
        console.log('Form submitted with data:', data);
        console.log('Current mode:', currentMode);
        console.log('Initial values:', initValues);

        try {
            // ล้างข้อมูล update array ถ้าอยู่ใน ADD mode
            if (currentMode === formType.ADD) {
                console.log('Processing ADD mode');
                if (data.order_units) {
                    data.order_units.update = [];
                }
                if (data.ingredient_units) {
                    data.ingredient_units.update = [];
                }
            } else if (currentMode === formType.EDIT) {
                console.log('Processing EDIT mode');
            }

            // Handle locations for both ADD and EDIT modes
            let updatedLocations = [];
            let updatedOrderUnits = [];
            let updatedIngredientUnits = [];

            // For both modes, start with an empty array
            if (currentMode === formType.ADD) {
                // Only process add array for ADD mode
                if (data.locations.add && data.locations.add.length > 0) {
                    updatedLocations = data.locations.add.map(loc => ({
                        id: loc.location_id,
                        location_id: loc.location_id,
                        location_name: storeLocations.find(l => l.id === loc.location_id)?.name || ""
                    }));
                }
                // Process order units for ADD mode
                if (data.order_units?.add && data.order_units.add.length > 0) {
                    updatedOrderUnits = data.order_units.add.map(unit => ({
                        id: unit.from_unit_id + '-' + unit.to_unit_id, // Temporary ID for display
                        from_unit_id: unit.from_unit_id,
                        from_unit_name: units.find(u => u.id === unit.from_unit_id)?.name || "",
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_name: units.find(u => u.id === unit.to_unit_id)?.name || "",
                        to_unit_qty: unit.to_unit_qty,
                        unit_type: "order_unit",
                        description: unit.description,
                        is_active: true,
                        is_default: unit.is_default
                    }));
                }
                // Process ingredient units for ADD mode
                if (data.ingredient_units?.add && data.ingredient_units.add.length > 0) {
                    updatedIngredientUnits = data.ingredient_units.add.map(unit => ({
                        id: unit.from_unit_id + '-' + unit.to_unit_id, // Temporary ID for display
                        from_unit_id: unit.from_unit_id,
                        from_unit_name: units.find(u => u.id === unit.from_unit_id)?.name || "",
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_name: units.find(u => u.id === unit.to_unit_id)?.name || "",
                        to_unit_qty: unit.to_unit_qty,
                        unit_type: "ingredient_unit",
                        description: unit.description || "",
                        is_active: unit.is_active,
                        is_default: unit.is_default
                    }));
                }
            } else if (currentMode === formType.EDIT) {
                console.log('Processing EDIT mode data');
                // Process existing locations and removals
                if (initValues?.locations) {
                    const removedLocationIds = data.locations.remove.map(loc => loc.location_id);
                    updatedLocations = initValues.locations
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((loc: any) => !removedLocationIds.includes(loc.location_id));
                }

                // Add new locations for EDIT mode
                if (data.locations.add && data.locations.add.length > 0) {
                    const newLocations = data.locations.add.map(loc => ({
                        id: loc.location_id,
                        location_id: loc.location_id,
                        location_name: storeLocations.find(l => l.id === loc.location_id)?.name || ""
                    }));
                    updatedLocations = [...updatedLocations, ...newLocations];
                }

                // Process existing order units and removals
                if (initValues?.order_units) {
                    const removedOrderUnitIds = data.order_units?.remove?.map(unit => unit.product_order_unit_id) || [];
                    updatedOrderUnits = initValues.order_units
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((unit: any) => !removedOrderUnitIds.includes(unit.id));

                    // Update existing order units
                    if (data.order_units?.update && data.order_units.update.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        updatedOrderUnits = updatedOrderUnits.map((unit: any) => {
                            const updatedUnit = data.order_units?.update.find(u => u.product_order_unit_id === unit.id);
                            if (updatedUnit) {
                                return {
                                    ...unit,
                                    from_unit_id: updatedUnit.from_unit_id,
                                    from_unit_name: units.find(u => u.id === updatedUnit.from_unit_id)?.name || unit.from_unit_name,
                                    from_unit_qty: updatedUnit.from_unit_qty,
                                    to_unit_id: updatedUnit.to_unit_id,
                                    to_unit_name: units.find(u => u.id === updatedUnit.to_unit_id)?.name || unit.to_unit_name,
                                    to_unit_qty: updatedUnit.to_unit_qty,
                                    description: updatedUnit.description,
                                    is_default: updatedUnit.is_default
                                };
                            }
                            return unit;
                        });
                    }
                }

                // Add new order units for EDIT mode
                if (data.order_units?.add && data.order_units.add.length > 0) {
                    const newOrderUnits = data.order_units.add.map(unit => ({
                        id: unit.from_unit_id + '-' + unit.to_unit_id, // Temporary ID for display
                        from_unit_id: unit.from_unit_id,
                        from_unit_name: units.find(u => u.id === unit.from_unit_id)?.name || "",
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_name: units.find(u => u.id === unit.to_unit_id)?.name || "",
                        to_unit_qty: unit.to_unit_qty,
                        unit_type: "order_unit",
                        description: unit.description,
                        is_active: true,
                        is_default: unit.is_default
                    }));
                    updatedOrderUnits = [...updatedOrderUnits, ...newOrderUnits];
                }

                // Process existing ingredient units and removals
                if (initValues?.ingredient_units) {
                    const removedIngredientUnitIds = data.ingredient_units?.remove?.map(unit => unit.product_order_unit_id) || [];
                    updatedIngredientUnits = initValues.ingredient_units
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        .filter((unit: any) => !removedIngredientUnitIds.includes(unit.id));

                    // Update existing ingredient units
                    if (data.ingredient_units?.update && data.ingredient_units.update.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        updatedIngredientUnits = updatedIngredientUnits.map((unit: any) => {
                            const updatedUnit = data.ingredient_units?.update.find(u => u.product_order_unit_id === unit.id);
                            if (updatedUnit) {
                                return {
                                    ...unit,
                                    from_unit_id: updatedUnit.from_unit_id,
                                    from_unit_name: units.find(u => u.id === updatedUnit.from_unit_id)?.name || unit.from_unit_name,
                                    from_unit_qty: updatedUnit.from_unit_qty,
                                    to_unit_id: updatedUnit.to_unit_id,
                                    to_unit_name: units.find(u => u.id === updatedUnit.to_unit_id)?.name || unit.to_unit_name,
                                    to_unit_qty: updatedUnit.to_unit_qty,
                                    description: updatedUnit.description || "",
                                    is_active: updatedUnit.is_active,
                                    is_default: updatedUnit.is_default
                                };
                            }
                            return unit;
                        });
                    }
                }

                // Add new ingredient units for EDIT mode
                if (data.ingredient_units?.add && data.ingredient_units.add.length > 0) {
                    const newIngredientUnits = data.ingredient_units.add.map(unit => ({
                        id: unit.from_unit_id + '-' + unit.to_unit_id, // Temporary ID for display
                        from_unit_id: unit.from_unit_id,
                        from_unit_name: units.find(u => u.id === unit.from_unit_id)?.name || "",
                        from_unit_qty: unit.from_unit_qty,
                        to_unit_id: unit.to_unit_id,
                        to_unit_name: units.find(u => u.id === unit.to_unit_id)?.name || "",
                        to_unit_qty: unit.to_unit_qty,
                        unit_type: "ingredient_unit",
                        description: unit.description || "",
                        is_active: unit.is_active,
                        is_default: unit.is_default
                    }));
                    updatedIngredientUnits = [...updatedIngredientUnits, ...newIngredientUnits];
                }
            }

            // Make API call first
            let response;
            if (currentMode === formType.ADD) {
                console.log('Making create API call');
                response = await createProductService(token, tenantId, data);
                if (!response) {
                    throw new Error('Failed to create product');
                }
            } else {
                console.log('Making update API call with ID:', initValues?.id);
                response = await updateProductService(token, tenantId, initValues?.id, data);
                if (!response) {
                    throw new Error('Failed to update product');
                }
            }

            // Only update UI state after successful API call
            setUpdatedInitValues({
                ...data,
                locations: updatedLocations,
                order_units: updatedOrderUnits,
                ingredient_units: updatedIngredientUnits
            });

            // Update mode and navigate after successful API call
            setCurrentMode(formType.VIEW);
            router.push("/product-management/product");

        } catch (error) {
            console.error('Error in onSubmit:', error);
            // You might want to show an error toast or notification here
            // For example: toast.error('Failed to save product. Please try again.');
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
                    className="space-y-4"
                >
                    <div className={`flex flex-row gap-2 justify-end`}>
                        <div className="flex flex-row gap-2 justify-end">
                            {currentMode === formType.VIEW ? (
                                <>
                                    <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                        <ArrowLeft className="h-4 w-4" /> กลับ
                                    </Button>
                                    <Button variant="default" size={'sm'} onClick={handleEditClick}>
                                        <Pencil className="h-4 w-4" /> แก้ไข
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button variant="outline" size={'sm'} onClick={handleCancelClick}>
                                        <X className="h-4 w-4" /> ยกเลิก
                                    </Button>
                                    <Button
                                        variant="default"
                                        size={'sm'}
                                        type="submit"
                                        onClick={() => {
                                            console.log('Submit button clicked');
                                            console.log('Form is valid:', form.formState.isValid);
                                            console.log('Form is dirty:', form.formState.isDirty);
                                            console.log('Form errors:', form.formState.errors);
                                            console.log('Form values:', form.getValues());
                                            console.log('Form touched fields:', form.formState.touchedFields);
                                            console.log('Form default values:', form.formState.defaultValues);
                                        }}
                                    >
                                        <Save className="h-4 w-4" /> บันทึก
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[calc(100vh-160px)]">
                        <ProductFormHeader control={form.control} currentMode={currentMode} initValues={initValues} />

                        <Tabs defaultValue="basicInfo" className="mt-2">
                            <TabsList>
                                <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
                                <TabsTrigger value="location">Location</TabsTrigger>
                                <TabsTrigger value="orderUnit">Order Unit</TabsTrigger>
                                <TabsTrigger value="ingredientUnit">Ingredient Unit</TabsTrigger>
                                {currentMode === formType.EDIT || currentMode === formType.VIEW && (
                                    <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                )}
                            </TabsList>
                            <TabsContent value="basicInfo">
                                <BasicInfo control={form.control} currentMode={currentMode} />
                            </TabsContent>
                            <TabsContent value="location">
                                <LocationInfo
                                    control={form.control}
                                    currentMode={currentMode}
                                    initValues={currentMode === formType.VIEW ? updatedInitValues?.locations : initValues?.locations}
                                    storeLocations={storeLocations}
                                />
                            </TabsContent>
                            <TabsContent value="orderUnit">
                                <OrderUnitInfo
                                    control={form.control}
                                    currentMode={currentMode}
                                    initValues={currentMode === formType.VIEW ? updatedInitValues?.order_units : initValues?.order_units}
                                    units={units}
                                />
                            </TabsContent>
                            <TabsContent value="ingredientUnit">
                                <IngredientUnitInfo
                                    control={form.control}
                                    currentMode={currentMode}
                                    initValues={currentMode === formType.VIEW ? updatedInitValues?.ingredient_units : initValues?.ingredient_units}
                                    units={units}
                                />
                            </TabsContent>
                            <TabsContent value="inventory">
                                <InventoryInfo inventoryData={mockStockInventoryData} />
                            </TabsContent>
                        </Tabs>
                    </ScrollArea>
                </form>
            </Form>
        </div>
    );
}