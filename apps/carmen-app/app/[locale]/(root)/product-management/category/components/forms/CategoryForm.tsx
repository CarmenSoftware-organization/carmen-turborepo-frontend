import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryDto, CategoryNode, CategorySchema } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly onSubmit: (data: CategoryDto) => void;
    readonly onCancel: () => void;
}

export function CategoryForm({ mode, selectedNode, onSubmit, onCancel }: CategoryFormProps) {
    const form = useForm<CategoryDto>({
        resolver: zodResolver(CategorySchema),
        defaultValues: {
            id: selectedNode?.id ?? "",
            name: selectedNode?.name ?? "",
            code: selectedNode?.code ?? "",
            description: selectedNode?.description ?? "",
            is_active: true,
            price_deviation_limit: selectedNode?.price_deviation_limit ?? 0,
            qty_deviation_limit: selectedNode?.qty_deviation_limit ?? 0,
            is_used_in_recipe: selectedNode?.is_used_in_recipe ?? false,
            is_sold_directly: selectedNode?.is_sold_directly ?? false,
        }
    });

    console.log('selectedNode', selectedNode);


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="price_deviation_limit"
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
                        control={form.control}
                        name="qty_deviation_limit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity Deviation Limit</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="1"
                                        min="0"
                                        placeholder="Enter Quantity Deviation Limit"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <FormField
                        control={form.control}
                        name="is_used_in_recipe"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                <div>
                                    <FormLabel className="text-xs">Used in Recipe</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="is_sold_directly"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2">
                                <div>
                                    <FormLabel className="text-xs">Sold Directly</FormLabel>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active</FormLabel>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        {mode === formType.EDIT ? "Save changes" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
} 