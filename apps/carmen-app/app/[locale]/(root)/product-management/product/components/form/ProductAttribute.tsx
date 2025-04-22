import { Control, useFieldArray, useWatch } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ProductAttributeProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

interface AttributeItem {
    label: string;
    value: string;
    data_type: string;
}

export default function ProductAttribute({ control, currentMode }: ProductAttributeProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "product_info.info"
    });

    const [attributeValues, setAttributeValues] = useState<AttributeItem[]>([]);

    const formValues = useWatch({
        control,
        name: "product_info.info"
    });

    useEffect(() => {
        if (formValues) {
            setAttributeValues(formValues);
        }
    }, [formValues]);

    const handleAddAttribute = () => {
        append({ label: "", value: "", data_type: "string" });
    };

    // Check if we're in view mode
    const isViewMode = currentMode === formType.VIEW;

    return (
        <Card className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Product Attributes</h2>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleAddAttribute}
                    className="flex items-center gap-2"
                    disabled={isViewMode}
                >
                    <Plus className="h-4 w-4" />
                    Add Attribute
                </Button>
            </div>

            <div className="space-y-4">
                {isViewMode ? (
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        {attributeValues && attributeValues.length > 0 ? (
                            attributeValues.map((attribute, index) => (
                                <div key={`attribute-${attribute.label}-${index}`} className="space-y-1">
                                    <p className="font-semibold text-sm">{attribute.label}</p>
                                    <p className="text-xs text-muted-foreground">{attribute.value}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No attributes added</p>
                        )}
                    </div>

                ) : (
                    <>
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

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => remove(index)}
                                        className="self-end"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </Card>
    );
}