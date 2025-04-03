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
            is_active: selectedNode?.is_active ?? true
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
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
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