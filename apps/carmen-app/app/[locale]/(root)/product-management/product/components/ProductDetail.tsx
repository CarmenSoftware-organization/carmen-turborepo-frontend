"use client";

import { useState } from "react";
import { formType } from "@/dtos/form.dto";
import { ProductGetDto } from "@/dtos/product.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/lib/navigation";
import { Pencil, X, ArrowLeft, Save } from "lucide-react";

// สร้าง schema validation ด้วย Zod
const productFormSchema = z.object({
    name: z.string().min(2, { message: "ชื่อผลิตภัณฑ์ต้องมีอย่างน้อย 2 ตัวอักษร" }),
    description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductDetailProps {
    readonly mode: formType;
    readonly initValues?: ProductGetDto;
}

export default function ProductDetail({ mode, initValues }: ProductDetailProps) {
    const router = useRouter();
    // สร้าง state สำหรับเก็บค่า mode ปัจจุบัน
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    // สร้าง form ด้วย react-hook-form และ zod resolver
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        defaultValues: {
            name: initValues?.name || "",
            description: initValues?.description || "",
        },
        mode: "onChange",
    });

    // ฟังก์ชันสำหรับ submit form
    const onSubmit = (data: ProductFormValues) => {
        console.log("Form submitted:", data);
        // เพิ่มโค้ดจัดการกับข้อมูลที่ submit ตาม mode
        if (currentMode === formType.ADD) {
            // สร้างผลิตภัณฑ์ใหม่
            console.log("Creating new product:", data);
        } else if (currentMode === formType.EDIT) {
            // อัปเดตผลิตภัณฑ์ที่มีอยู่
            console.log("Updating product:", data);
        }
        setCurrentMode(formType.VIEW);
    };

    const handleEditClick = () => {
        setCurrentMode(formType.EDIT);
    };

    return (
        <div>
            <h1>Product mode {currentMode}</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-row gap-2 justify-end">
                        {currentMode === formType.VIEW ? (
                            <>
                                <Button variant="outline" onClick={() =>
                                    router.push("/product-management/product")
                                }>
                                    <ArrowLeft className="h-4 w-4" /> Back
                                </Button>
                                <Button variant="outline" onClick={handleEditClick}>
                                    <Pencil className="h-4 w-4" /> Edit
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() =>
                                    setCurrentMode(formType.VIEW)

                                }>
                                    <X className="h-4 w-4" /> Cancel
                                </Button>
                                <Button variant="default" type="submit">
                                    <Save className="h-4 w-4" /> Save
                                </Button>
                            </>
                        )}
                    </div>

                    {/* ฟิลด์ชื่อผลิตภัณฑ์ */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ชื่อผลิตภัณฑ์</FormLabel>

                                {currentMode === formType.VIEW ? (
                                    <div>
                                        {field.value || "ไม่ระบุ"}
                                    </div>
                                ) : (
                                    <FormControl>
                                        <Input placeholder="ระบุชื่อผลิตภัณฑ์" {...field} />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ฟิลด์คำอธิบาย */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>คำอธิบาย</FormLabel>
                                {currentMode === formType.VIEW ? (
                                    <div>
                                        {field.value || "ไม่มีคำอธิบาย"}
                                    </div>
                                ) : (
                                    <FormControl>
                                        <textarea
                                            className="w-full min-h-20 p-2 border rounded-md"
                                            placeholder="ระบุคำอธิบายผลิตภัณฑ์"
                                            {...field}
                                        />
                                    </FormControl>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
}