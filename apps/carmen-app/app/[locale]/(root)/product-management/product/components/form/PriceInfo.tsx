import { Control } from "react-hook-form";
import { formType } from "@/dtos/form.dto";
import { ProductFormValues } from "../../pd-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PriceInfoProps {
    readonly control: Control<ProductFormValues>;
    readonly currentMode: formType;
}

export default function PriceInfo({ control, currentMode }: PriceInfoProps) {
    return (
        <div className="rounded-lg border p-6 space-y-4">
            <h2 className="text-lg font-semibold">Product Information</h2>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={control}
                    name="product_info.price"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter price"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    disabled={currentMode === formType.VIEW}
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
                            <Select onValueChange={field.onChange} value={field.value} disabled={currentMode === formType.VIEW}>
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
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter tax rate"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    disabled={currentMode === formType.VIEW}
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
                                    placeholder="Enter price deviation limit"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    disabled={currentMode === formType.VIEW}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.qty_deviation_limit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Quantity Deviation Limit</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="Enter quantity deviation limit"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    disabled={currentMode === formType.VIEW}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name="product_info.is_ingredients"
                    render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={currentMode === formType.VIEW}
                                />
                            </FormControl>
                            <FormLabel>Is Ingredients</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    );
}
