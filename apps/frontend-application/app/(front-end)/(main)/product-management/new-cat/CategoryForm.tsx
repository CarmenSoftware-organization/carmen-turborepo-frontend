import React, { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import { EnhancedCategory } from './ProductOrganizer';
import { formType } from '@/constants/enums';
import { submitCategory } from '@/services/category';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { add_cat_success } from '@/paraglide/messages';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui-custom/FormCustom';

const formSchema = z.object({
    code: z.string().min(1, "Code is required"),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: formType;
    categoryId: string;
    categoryName: string;
    onCancel: () => void;
    category: EnhancedCategory;
    token: string;
    setCategorys: (categories: EnhancedCategory[]) => void;
    tenantId: string;
}

const CategoryForm = ({
    open,
    onOpenChange,
    mode,
    categoryName,
    onCancel,
    category,
    token,
    setCategorys,
    tenantId
}: CategoryFormProps) => {
    // Initialize form with default values
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
            name: categoryName || "",
            description: "",
            is_active: true,
        },
    });

    useEffect(() => {
        form.setValue("name", categoryName);
        if (open) {
            if (mode === formType.ADD) {
                form.reset({
                    code: "",
                    name: "",
                    description: "",
                    is_active: true,
                });
            } else {
                form.reset({
                    code: category.code || "",
                    name: category.name || "",
                    description: category.description || "",
                    is_active: category.is_active || true,
                });
            }
        }
    }, [categoryName, category, form, mode, open]);

    const onSubmit = async (data: FormValues) => {
        const response = await submitCategory(data, token, tenantId, formType.ADD, '');
        console.log('response', response);
        if (response) {
            toastSuccess({ message: add_cat_success() });
        } else {
            toastError({ message: response.statusText });
        }
        onOpenChange(false);


        // Close the dialog after submission
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === formType.ADD ? 'Add Subcategory' : 'Edit Category'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === formType.ADD
                            ? `Add a new subcategory to ${category.name}`
                            : 'Edit the category details below.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <InputCustom placeholder="Code" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <InputCustom
                                            placeholder={mode === formType.ADD ? "New subcategory name" : "Category name"}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Description"
                                            {...field}
                                            className="placeholder:text-xs text-xs"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            required
                        />
                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Active
                                        </FormLabel>
                                        <FormDescription className="text-xs">
                                            {mode === formType.ADD
                                                ? "Activate this subcategory upon creation"
                                                : "Toggle active status for this category"}
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                            required
                        />
                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                size="sm"
                            >
                                Cancel
                            </Button>
                            <LoaderButton
                                type="submit"
                                size="sm"
                            >
                                {mode === formType.EDIT ? "Save changes" : "Add"}
                            </LoaderButton>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CategoryForm;
