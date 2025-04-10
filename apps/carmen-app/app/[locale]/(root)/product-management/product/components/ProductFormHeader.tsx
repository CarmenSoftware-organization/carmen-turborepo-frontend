import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "./ProductDetail";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useItemGroup } from "@/hooks/useItemGroup";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormFieldsProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
}

export const ProductFormHeader = ({ control, currentMode }: ProductFormFieldsProps) => {
    const { itemGroups } = useItemGroup();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
                control={control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>ชื่อผลิตภัณฑ์</FormLabel>
                        <FormControl>
                            <Input placeholder="ระบุชื่อผลิตภัณฑ์" {...field} disabled={currentMode === formType.VIEW} />
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
                        <FormLabel>ชื่อภาษาไทย</FormLabel>
                        <FormControl>
                            <Input placeholder="ระบุชื่อภาษาไทย" {...field} disabled={currentMode === formType.VIEW} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="product_category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>หมวดผลิตภัณฑ์</FormLabel>
                        <FormControl>
                            <Select
                                disabled
                                value={field.value?.id || "1"}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกหมวดผลิตภัณฑ์">
                                            {field.value?.name || "หมวด 1"}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="product_sub_category"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>หมวดย่อยผลิตภัณฑ์</FormLabel>
                        <FormControl>
                            <Select
                                disabled
                                value={field.value?.id || "1"}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกหมวดย่อยผลิตภัณฑ์">
                                            {field.value?.name || "หมวดย่อย 1"}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="product_item_group"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>กลุ่มผลิตภัณฑ์</FormLabel>
                        <Select
                            onValueChange={(value) => {
                                const selectedOption = itemGroups.find(itemGroup => itemGroup.id === value);
                                field.onChange(selectedOption);
                            }}
                            value={field.value?.id || itemGroups[0]?.id}
                            disabled={currentMode === formType.VIEW}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="เลือกกลุ่มผลิตภัณฑ์">
                                        {field.value?.name}
                                    </SelectValue>
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
                name="inventory_unit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>หน่วยนับสินค้า</FormLabel>
                        <FormControl>
                            <Select
                                value={field.value?.id || "1"}
                                disabled={currentMode === formType.VIEW}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="เลือกหน่วยนับสินค้า">
                                            {field.value?.name}
                                        </SelectValue>
                                    </SelectTrigger>
                                </FormControl>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="description"
                render={({ field }) => (
                    <FormItem className="col-span-full">
                        <FormLabel>คำอธิบาย</FormLabel>
                        <FormControl>
                            <Textarea
                                className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="ระบุคำอธิบายผลิตภัณฑ์"
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