import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CategoryNode, SubCategoryFormSchema, type SubCategoryFormData } from "@/dtos/category";
import { formType } from "@/dtos/form.dto";

interface SubCategoryFormProps {
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly onSubmit: (data: SubCategoryFormData) => void;
    readonly onCancel: () => void;
}

export function SubCategoryForm({ mode, selectedNode, parentNode, onSubmit, onCancel }: SubCategoryFormProps) {
    const form = useForm<SubCategoryFormData>({
        resolver: zodResolver(SubCategoryFormSchema),
        defaultValues: {
            name: selectedNode?.name ?? "",
            description: selectedNode?.description ?? "",
            category_id: parentNode?.id ?? ""
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Input
                                    value={parentNode?.name ?? ""}
                                    disabled
                                    className="bg-muted"
                                />
                            </FormControl>
                            <input type="hidden" {...field} />
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
                                <Input {...field} />
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