import { formType } from "@/dtos/form.dto";
import { Control, useFieldArray } from "react-hook-form";
import { ProductFormValues } from "./ProductDetail";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ImageUpload } from "@/components/ui/image-upload";

interface BasicInfoProps {
    control: Control<ProductFormValues>;
    currentMode: formType;
}

export const BasicInfo = ({ control, currentMode }: BasicInfoProps) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "product_info.info",
    });

    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);

    const handleAddInfo = () => {
        append({ label: "", value: "", data_type: "string" });
    };

    return (
        <div className="flex gap-4">
            <div className="w-1/2 flex flex-col gap-4">
                <Card className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-lg font-bold">Product Attributes</p>
                        {currentMode !== formType.VIEW && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleAddInfo}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Attribute
                            </Button>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-end">
                                <FormField
                                    control={control}
                                    name={`product_info.info.${index}.value`}
                                    render={({ field: valueField }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>
                                                <FormField
                                                    control={control}
                                                    name={`product_info.info.${index}.label`}
                                                    render={({ field: labelField }) => (
                                                        currentMode === formType.VIEW ? (
                                                            <p>{String(labelField.value || '')}</p>
                                                        ) : (
                                                            <Input
                                                                placeholder="Enter label"
                                                                {...labelField}
                                                                value={String(labelField.value || '')}
                                                            />
                                                        )
                                                    )}
                                                />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter value"
                                                    {...valueField}
                                                    value={String(valueField.value || '')}
                                                    disabled={currentMode === formType.VIEW}
                                                />
                                            </FormControl>
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
                                        className="mb-2"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Remove attribute</span>
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </Card>
                <Card className="p-4">
                    <p className="text-lg font-bold">Pricing Information</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="product_info.price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Enter Price"
                                            disabled={currentMode === formType.VIEW}
                                            {...field}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? "" : Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="product_info.price_deviation_limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price Deviation Limit</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="Enter Price Deviation Limit"
                                            {...field}
                                            disabled={currentMode === formType.VIEW}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? "" : Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="product_info.tax_rate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Rate</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter Tax Rate"
                                            {...field}
                                            disabled={currentMode === formType.VIEW}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                field.onChange(value === "" ? "" : Number(value));
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="product_info.tax_type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tax Type</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={currentMode === formType.VIEW}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Tax Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none">None</SelectItem>
                                                <SelectItem value="included">Included</SelectItem>
                                                <SelectItem value="excluded">Excluded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </Card>
            </div>

            <Card className="p-4 w-1/2">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-lg font-bold">Product Image</p>
                    <FormField
                        control={control}
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value || previewImage}
                                        onChange={(value) => {
                                            setPreviewImage(value);
                                            field.onChange(value);
                                        }}
                                        disabled={currentMode === formType.VIEW}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </Card>
        </div>
    );
};
