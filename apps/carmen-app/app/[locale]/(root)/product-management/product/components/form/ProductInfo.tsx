import { Control, useFieldArray } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

export default function ProductInfo({ control, currentMode }: ProductInfoProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "product_info.info"
    });

    const handleAddAttribute = () => {
        append({ label: "", value: "", data_type: "string" });
    };

    return (
        <div className="rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Product Attributes</h2>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddAttribute}
                    className="flex items-center gap-2"
                    disabled={currentMode === formType.VIEW}
                >
                    <Plus className="h-4 w-4" />
                    Add Attribute
                </Button>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-4 items-end">
                        <FormField
                            control={control}
                            name={`product_info.info.${index}.label`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter label"
                                            {...field}
                                            disabled={currentMode === formType.VIEW}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`product_info.info.${index}.value`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Value</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter value"
                                            {...field}
                                            disabled={currentMode === formType.VIEW}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2">
                            <FormField
                                control={control}
                                name={`product_info.info.${index}.data_type`}
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Data Type</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            disabled={currentMode === formType.VIEW}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="string">String</SelectItem>
                                                <SelectItem value="number">Number</SelectItem>
                                                <SelectItem value="boolean">Boolean</SelectItem>
                                                <SelectItem value="date">Date</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {currentMode !== formType.VIEW && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    className="self-end"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 