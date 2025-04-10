"use client";

import { useState } from "react";
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
                is_active: z.boolean(),
                is_default: z.boolean(),
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
                description: z.string(),
                is_active: z.boolean(),
                is_default: z.boolean(),
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
    const router = useRouter();

    const [currentMode, setCurrentMode] = useState<formType>(mode);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initValues?.name ?? "",
            code: initValues?.code ?? "",
            description: initValues?.description ?? "",
            local_name: initValues?.local_name ?? "",
            inventory_unit_id: initValues?.inventory_unit_id ?? "",
            inventory_unit_name: initValues?.inventory_unit_name ?? "",
            product_status_type: "active",
            product_info: {
                product_item_group_id: initValues?.product_info?.product_item_group_id ?? "",
                is_ingredients: initValues?.product_info?.is_ingredients ?? false,
                price: initValues?.product_info?.price ?? 0,
                tax_type: initValues?.product_info?.tax_type ?? "none",
                tax_rate: initValues?.product_info?.tax_rate ?? 0,
                price_deviation_limit: initValues?.product_info?.price_deviation_limit ?? 0,
                info: initValues?.product_info?.info ?? [],
            },
            locations: {
                add: initValues?.locations?.add ?? [],
            },
            order_units: {
                add: initValues?.order_units?.add ?? [],
            },
            ingredient_units: {
                add: initValues?.ingredient_units?.add ?? [],
            },
        },
        mode: "onChange",
    });

    const onSubmit = (data: ProductFormValues) => {
        console.log("Form submitted:", data);
        if (currentMode === formType.ADD) {
            console.log("Creating new product:", data);
        } else if (currentMode === formType.EDIT) {
            console.log("Updating product:", data);
        }
        setCurrentMode(formType.VIEW);
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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

    // console.log('initValues', initValues);

    const getTitle = () => {
        if (currentMode === formType.ADD) return "Add Product";
        if (currentMode === formType.EDIT) return "Edit Product";
        return "View Product";
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-2xl font-bold">
                {getTitle()}
            </h1>
            <Form {...form}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit(onSubmit)(e);
                }} className="space-y-4">
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
                                <Button variant="default" size={'sm'} type="submit">
                                    <Save className="h-4 w-4" /> บันทึก
                                </Button>
                            </>
                        )}
                    </div>
                    <ProductFormHeader control={form.control} currentMode={currentMode} initValues={initValues} />

                    <Tabs defaultValue="basicInfo">
                        <TabsList>
                            <TabsTrigger value="basicInfo">Basic Info</TabsTrigger>
                            <TabsTrigger value="location">Location</TabsTrigger>
                            {currentMode === formType.EDIT || currentMode === formType.VIEW && (
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                            )}
                            <TabsTrigger value="orderUnit">Order Unit</TabsTrigger>
                            <TabsTrigger value="ingredientUnit">Ingredient Unit</TabsTrigger>
                        </TabsList>
                        <TabsContent value="basicInfo">
                            <BasicInfo control={form.control} currentMode={currentMode} />
                        </TabsContent>
                        <TabsContent value="location">
                            Location
                        </TabsContent>
                        <TabsContent value="inventory">
                            Inventory
                        </TabsContent>
                        <TabsContent value="orderUnit">
                            Order Unit
                        </TabsContent>
                        <TabsContent value="ingredientUnit">
                            Ingredient Unit
                        </TabsContent>
                    </Tabs>
                </form>
            </Form>
        </div>
    );
}