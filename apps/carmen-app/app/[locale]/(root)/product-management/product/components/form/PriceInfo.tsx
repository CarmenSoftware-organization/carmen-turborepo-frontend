import { Control } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface PriceInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

export default function PriceInfo({ control, currentMode }: PriceInfoProps) {

    const isViewMode = currentMode === formType.VIEW;

    return (
        <Card className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">Price Information</h2>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="product_info.price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                {isViewMode ? (
                                    <p className="text-xs text-muted-foreground">
                                        {field.value}
                                    </p>
                                ) : (
                                    <Input
                                        type="number"
                                        placeholder="Enter price"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                )}
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
                            {isViewMode ? (
                                <p className="text-xs text-muted-foreground">
                                    {field.value}
                                </p>
                            ) : (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select tax type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        <SelectItem value="included">Included</SelectItem>
                                        <SelectItem value="excluded">Excluded</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.tax_rate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tax Rate (%)</FormLabel>
                            {isViewMode ? (
                                <p className="text-xs text-muted-foreground">
                                    {field.value}
                                </p>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter tax rate"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.price_deviation_limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price Deviation</FormLabel>
                            {isViewMode ? (
                                <p className="text-xs text-muted-foreground">
                                    {field.value}
                                </p>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter price deviation limit"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.qty_deviation_limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity Deviation</FormLabel>
                            {isViewMode ? (
                                <p className="text-xs text-muted-foreground">
                                    {field.value}
                                </p>
                            ) : (
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="Enter quantity deviation limit"
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </Card>
    );
}
