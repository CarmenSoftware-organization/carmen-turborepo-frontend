import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CategoryNode, ItemGroupFormSchema, type ItemGroupFormData } from "@/dtos/category";
import { formType } from "@/dtos/form.dto";

interface ItemGroupFormProps {
    readonly mode: formType;
    readonly selectedNode?: CategoryNode;
    readonly parentNode?: CategoryNode;
    readonly onSubmit: (data: ItemGroupFormData) => void;
    readonly onCancel: () => void;
}

export function ItemGroupForm({ mode, selectedNode, parentNode, onSubmit, onCancel }: ItemGroupFormProps) {
    const form = useForm<ItemGroupFormData>({
        resolver: zodResolver(ItemGroupFormSchema),
        defaultValues: {
            name: selectedNode?.name ?? "",
            description: selectedNode?.description ?? "",
            sub_category_id: parentNode?.id ?? ""
        }
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="sub_category_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Sub Category</FormLabel>
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