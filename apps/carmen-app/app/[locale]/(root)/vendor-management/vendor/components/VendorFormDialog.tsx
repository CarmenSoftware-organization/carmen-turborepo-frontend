"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { VendorFormDto, VendorFormSchema, VendorDto } from "@/dtos/vendor-management";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { createVendorService, updateVendorService } from "@/services/vendor.service";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface VendorFormDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly initialData?: VendorDto;
    readonly onSuccess?: () => void;
}

export default function VendorFormDialog({
    open,
    onOpenChange,
    mode,
    initialData,
    onSuccess
}: VendorFormDialogProps) {
    const { token, tenantId } = useAuth();
    const [loading, setLoading] = useState(false);
    const tCommon = useTranslations('Common');

    const form = useForm<VendorFormDto>({
        resolver: zodResolver(VendorFormSchema),
        defaultValues: {
            name: "",
            description: "",
            is_active: true,
            info: null
        }
    });

    // Reset form or populate with initial data when modal opens/changes mode
    useEffect(() => {
        if (open) {
            if (mode === formType.EDIT && initialData) {
                // When editing, populate form with existing data
                form.reset({
                    name: initialData.name,
                    description: initialData.description,
                    is_active: initialData.is_active,
                    info: initialData.info
                });
            } else {
                // When adding, reset to defaults
                form.reset({
                    name: "",
                    description: "",
                    is_active: true,
                    info: null
                });
            }
        }
    }, [open, mode, initialData, form]);

    const handleSubmit = async (data: VendorFormDto) => {
        try {
            setLoading(true);

            let response;

            if (mode === formType.EDIT && initialData) {
                // Update existing vendor
                const vendorToUpdate: VendorDto = {
                    ...data,
                    id: initialData.id
                };
                response = await updateVendorService(token, tenantId, vendorToUpdate);
            } else {
                // Create new vendor
                response = await createVendorService(token, tenantId, data);
            }

            if (response.statusCode === 401) {
                toastError({ message: "Authentication failed. Please login again." });
                return;
            }

            if (response.statusCode >= 400) {
                throw new Error(response.message || "An error occurred");
            }

            const successMessage = mode === formType.EDIT
                ? "Vendor updated successfully"
                : "Vendor created successfully";

            toastSuccess({ message: successMessage });
            form.reset();
            onOpenChange(false);
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error(`Error ${mode === formType.EDIT ? 'updating' : 'creating'} vendor:`, error);
            toastError({ message: `Failed to ${mode === formType.EDIT ? 'update' : 'create'} vendor: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setLoading(false);
        }
    };

    const dialogTitle = mode === formType.EDIT
        ? `${tCommon('edit')} Vendor`
        : `${tCommon('add')} Vendor`;

    const submitButtonText = loading
        ? mode === formType.EDIT ? "Updating..." : "Creating..."
        : tCommon('save');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter vendor name" {...field} />
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
                                        <Textarea
                                            placeholder="Enter vendor description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="is_active"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Active</FormLabel>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {tCommon('cancel')}
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {submitButtonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
} 