"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { VendorFormDto, VendorFormUpdateSchema, VendorGetDto } from "@/dtos/vendor-management";
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
    FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Plus, Trash } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface VendorFormDialogProps {
    readonly open: boolean;
    readonly onOpenChange: (open: boolean) => void;
    readonly mode: formType;
    readonly initialData?: VendorGetDto;
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
        resolver: zodResolver(VendorFormUpdateSchema),
        defaultValues: {
            name: "",
            description: "",
            info: [],
            vendor_address: [],
            vendor_contact: [],
            is_active: true
        }
    });

    // Reset form or populate with initial data when modal opens/changes mode
    useEffect(() => {
        if (open) {
            if (mode === formType.EDIT && initialData) {
                // Transform VendorGetDto to VendorFormDto
                const formData: VendorFormDto = {
                    id: initialData.id,
                    name: initialData.name,
                    description: initialData.description,
                    is_active: initialData.is_active,
                    info: initialData.info,
                    vendor_address: initialData.vendor_address || [],
                    vendor_contact: initialData.vendor_contact || []
                };

                form.reset(formData);
            } else {
                // When adding, reset to defaults
                form.reset({
                    name: "",
                    description: "",
                    info: [],
                    vendor_address: [],
                    vendor_contact: [],
                    is_active: true
                });
            }
        }
    }, [open, mode, initialData, form]);

    const handleAddInfo = () => {
        const currentInfo = form.getValues("info") || [];
        form.setValue("info", [
            ...currentInfo,
            { label: "", value: "", data_type: "string" }
        ]);
    };

    const handleRemoveInfo = (index: number) => {
        const currentInfo = form.getValues("info") || [];
        form.setValue("info", currentInfo.filter((_, i) => i !== index));
    };

    const handleAddVendorAddress = () => {
        const currentAddresses = form.getValues("vendor_address") || [];
        form.setValue("vendor_address", [
            ...currentAddresses,
            {
                address_type: "contact_address",
                address: {
                    line_1: "",
                    line_2: "",
                    sub_district: "",
                    district: "",
                    province: "",
                    postal_code: "",
                    country: ""
                }
            }
        ]);
    };

    const handleRemoveVendorAddress = (index: number) => {
        const currentAddresses = form.getValues("vendor_address") || [];
        form.setValue("vendor_address", currentAddresses.filter((_, i) => i !== index));
    };

    const handleAddVendorContact = () => {
        const currentContacts = form.getValues("vendor_contact") || [];
        form.setValue("vendor_contact", [
            ...currentContacts,
            {
                contact_type: "phone",
                description: "",
                info: []
            }
        ]);
    };

    const handleRemoveVendorContact = (index: number) => {
        const currentContacts = form.getValues("vendor_contact") || [];
        form.setValue("vendor_contact", currentContacts.filter((_, i) => i !== index));
    };

    const handleSubmit = async (data: VendorFormDto) => {
        try {
            setLoading(true);

            let response;

            if (mode === formType.EDIT && initialData) {
                // Update existing vendor
                response = await updateVendorService(token, tenantId, data);
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
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
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
                                            value={field.value || ""}
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
                                        <FormDescription>
                                            This vendor will be available for use in the system
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Info Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <FormLabel>Information</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddInfo}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add Info
                                </Button>
                            </div>

                            {form.watch("info")?.map((_, index) => (
                                <Card key={index} className="mt-2">
                                    <CardContent className="pt-4">
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveInfo(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`info.${index}.label`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Label</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`info.${index}.value`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Value</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`info.${index}.data_type`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Data Type</FormLabel>
                                                        <FormControl>
                                                            <select
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                {...field}
                                                            >
                                                                <option value="string">String</option>
                                                                <option value="date">Date</option>
                                                                <option value="datetime">DateTime</option>
                                                                <option value="number">Number</option>
                                                                <option value="boolean">Boolean</option>
                                                                <option value="dataset">Dataset</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Vendor Address Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <FormLabel>Vendor Addresses</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddVendorAddress}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add Address
                                </Button>
                            </div>

                            {form.watch("vendor_address")?.map((_, index) => (
                                <Card key={index} className="mt-2">
                                    <CardContent className="pt-4">
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveVendorAddress(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.line_1`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Line 1</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.line_2`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Line 2</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.sub_district`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Sub District</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.district`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>District</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.province`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Province</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.postal_code`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Postal Code</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_address.${index}.address.country`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Country</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} value={field.value || ""} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Vendor Contact Section */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <FormLabel>Vendor Contacts</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddVendorContact}
                                >
                                    <Plus className="mr-1 h-4 w-4" /> Add Contact
                                </Button>
                            </div>

                            {form.watch("vendor_contact")?.map((_, index) => (
                                <Card key={index} className="mt-2">
                                    <CardContent className="pt-4">
                                        <div className="flex justify-end mb-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveVendorContact(index)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name={`vendor_contact.${index}.contact_type`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Contact Type</FormLabel>
                                                        <FormControl>
                                                            <select
                                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                {...field}
                                                            >
                                                                <option value="">Select type</option>
                                                                <option value="phone">Phone</option>
                                                                <option value="email">Email</option>
                                                            </select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`vendor_contact.${index}.description`}
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
                                        </div>

                                        {/* Contact Info Items */}
                                        <div className="mt-4">
                                            <div className="flex justify-between items-center">
                                                <FormLabel>Contact Information</FormLabel>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        const currentContactInfo = form.getValues(`vendor_contact.${index}.info`) || [];
                                                        form.setValue(`vendor_contact.${index}.info`, [
                                                            ...currentContactInfo,
                                                            { label: "", value: "", data_type: "string" }
                                                        ]);
                                                    }}
                                                >
                                                    <Plus className="mr-1 h-4 w-4" /> Add Info
                                                </Button>
                                            </div>

                                            {form.watch(`vendor_contact.${index}.info`)?.map((_, infoIndex) => (
                                                <div key={infoIndex} className="mt-2 p-3 border rounded-md">
                                                    <div className="flex justify-end mb-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const currentContactInfo = form.getValues(`vendor_contact.${index}.info`) || [];
                                                                form.setValue(
                                                                    `vendor_contact.${index}.info`,
                                                                    currentContactInfo.filter((_, i) => i !== infoIndex)
                                                                );
                                                            }}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name={`vendor_contact.${index}.info.${infoIndex}.label`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Label</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`vendor_contact.${index}.info.${infoIndex}.value`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Value</FormLabel>
                                                                    <FormControl>
                                                                        <Input {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name={`vendor_contact.${index}.info.${infoIndex}.data_type`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Data Type</FormLabel>
                                                                    <FormControl>
                                                                        <select
                                                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                                            {...field}
                                                                        >
                                                                            <option value="string">String</option>
                                                                            <option value="date">Date</option>
                                                                            <option value="datetime">DateTime</option>
                                                                            <option value="number">Number</option>
                                                                            <option value="boolean">Boolean</option>
                                                                            <option value="dataset">Dataset</option>
                                                                        </select>
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

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