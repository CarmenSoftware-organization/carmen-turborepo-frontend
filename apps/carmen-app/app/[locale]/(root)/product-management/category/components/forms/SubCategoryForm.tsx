import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryNode, SubCategoryFormSchema, type SubCategoryFormData } from "@/dtos/category.dto";
import { formType } from "@/dtos/form.dto";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface SubCategoryFormProps {
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly onSubmit: (data: SubCategoryFormData) => void;
    readonly onCancel: () => void;
}

export function SubCategoryForm({ mode, selectedNode, parentNode, onSubmit, onCancel }: SubCategoryFormProps) {
    const [parentName, setParentName] = useState("");
    const [parentId, setParentId] = useState("");

    // Set parent information when editing or creating
    useEffect(() => {
        if (mode === formType.EDIT && selectedNode) {
            // When editing, get the parent ID from the selected node
            setParentId(selectedNode.product_category_id || "");

            // For edit mode, we need to find the parent name from the parent_category_id
            if (parentNode && selectedNode.product_category_id === parentNode.id) {
                setParentName(parentNode.name);
            }
        } else if (parentNode) {
            // When creating, use the parent node provided
            setParentId(parentNode.id);
            setParentName(parentNode.name);
        }
    }, [mode, selectedNode, parentNode]);

    const form = useForm<SubCategoryFormData>({
        resolver: zodResolver(SubCategoryFormSchema),
        defaultValues: {
            code: selectedNode?.code ?? "",
            name: selectedNode?.name ?? "",
            description: selectedNode?.description ?? "",
            product_category_id: selectedNode?.product_category_id || parentNode?.id || "",
            is_active: selectedNode?.is_active ?? true,
            price_deviation_limit: selectedNode?.price_deviation_limit ?? 0,
            qty_deviation_limit: selectedNode?.qty_deviation_limit ?? 0
        }
    });

    // Update form values when parent information changes
    useEffect(() => {
        if (parentId) {
            form.setValue('product_category_id', parentId);
        }
    }, [parentId, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="product_category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input
                                    value={parentName}
                                    disabled
                                    className="bg-muted"
                                />
                            </FormControl>
                            <input
                                type="hidden"
                                {...field}
                                value={parentId || field.value}
                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
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