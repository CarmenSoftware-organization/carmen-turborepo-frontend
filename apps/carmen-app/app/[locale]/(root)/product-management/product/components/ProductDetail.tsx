"use client";

import { useState } from "react";
import { formType } from "@/dtos/form.dto";
import { ProductGetDto } from "@/dtos/product.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useRouter } from "@/lib/navigation";
import { Pencil, X, ArrowLeft, Save } from "lucide-react";
import { ProductFormHeader } from "./ProductFormHeader";

// สร้าง schema validation ด้วย Zod
const productFormSchema = z.object({
    name: z.string().min(2, { message: "ชื่อผลิตภัณฑ์ต้องมีอย่างน้อย 2 ตัวอักษร" }),
    description: z.string().optional(),
    local_name: z.string().optional(),
    product_category: z.object({
        id: z.string(),
        name: z.string(),
    }),
    product_sub_category: z.object({
        id: z.string(),
        name: z.string(),
    }),
    product_item_group: z.object({
        id: z.string(),
        name: z.string(),
    }),
    inventory_unit: z.object({
        id: z.string(),
        name: z.string(),
    }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export type { ProductFormValues };

interface ProductDetailProps {
    readonly mode: formType;
    readonly initValues?: ProductGetDto;
}

export default function ProductDetail({ mode, initValues }: ProductDetailProps) {
    const router = useRouter();

    const [currentMode, setCurrentMode] = useState<formType>(mode);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initValues?.name ?? "",
            description: initValues?.description ?? "",
            local_name: initValues?.local_name ?? "",
            product_category: initValues?.product_category ?? { id: "", name: "" },
            product_sub_category: initValues?.product_sub_category ?? { id: "", name: "" },
            product_item_group: initValues?.product_item_group ?? { id: "", name: "" },
            inventory_unit: initValues?.inventory_unit ?? { id: "", name: "" },
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

    console.log('initValues', initValues);

    const getTitle = () => {
        if (currentMode === formType.ADD) return "Add Product";
        if (currentMode === formType.EDIT) return "Edit Product";
        return "View Product";
    };

    return (
        <div className="container mx-auto">
            <div className="">
                <h1 className="text-2xl font-bold">
                    {getTitle()}
                </h1>
            </div>
            <Form {...form}>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit(onSubmit)(e);
                }} className="space-y-6">
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
                    <ProductFormHeader control={form.control} currentMode={currentMode} />
                </form>
            </Form>
        </div>
    );
}