"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { VendorFormDto, VendorFormUpdateSchema } from "@/dtos/vendor-management";
import { useAuth } from "@/context/AuthContext";
import { createVendorService } from "@/services/vendor.service";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Plus, Save, Trash } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface VendorFormProps {
    onSuccess?: () => void;
}

export default function VendorForm({ onSuccess }: VendorFormProps) {
    const { token, tenantId } = useAuth();
    const [loading, setLoading] = useState(false);
    const tCommon = useTranslations('Common');
    const router = useRouter();

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

    const handleSubmit = async (data: VendorFormDto) => {
        try {
            setLoading(true);

            // Create new vendor
            const response = await createVendorService(token, tenantId, data);

            if (response.statusCode === 401) {
                toastError({ message: "Authentication failed. Please login again." });
                return;
            }

            if (response.statusCode >= 400) {
                throw new Error(response.message || "An error occurred");
            }

            toastSuccess({ message: "Vendor created successfully" });

            if (onSuccess) {
                onSuccess();
            } else {
                // Navigate back to vendor list
                router.push("/vendor-management");
            }
        } catch (error) {
            console.error("Error creating vendor:", error);
            toastError({ message: `Failed to create vendor: ${error instanceof Error ? error.message : 'Unknown error'}` });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push("/vendor-management/vendor");
    };

    const submitButtonText = loading
        ? "Creating..."
        : tCommon('save');

    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    size="sm"
                                >
                                    {tCommon('cancel')}
                                </Button>
                                <Button type="submit" disabled={loading} size="sm">
                                    <Save className="mr-1 h-4 w-4" />
                                    {submitButtonText}
                                </Button>

                            </div>
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
                                                className="min-h-32"
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
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                Status
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="data-[state=checked]:bg-blue-600"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* Info Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-base">Information</FormLabel>
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            const currentInfo = form.getValues("info") || [];
                                            form.setValue("info", [
                                                ...currentInfo,
                                                { label: "", value: "", data_type: "string" }
                                            ]);
                                        }}
                                    >
                                        <Plus className="h-4 w-4" /> Add Info
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
                                                    onClick={() => {
                                                        const currentInfo = form.getValues("info") || [];
                                                        form.setValue("info", currentInfo.filter((_, i) => i !== index));
                                                    }}
                                                    className="w-7 h-7 text-destructive hover:text-destructive/80"
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
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-base">Vendor Addresses</FormLabel>
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
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
                                        }}
                                    >
                                        <Plus className="h-4 w-4" /> Add Address
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
                                                    onClick={() => {
                                                        const currentAddresses = form.getValues("vendor_address") || [];
                                                        form.setValue("vendor_address", currentAddresses.filter((_, i) => i !== index));
                                                    }}
                                                    className="w-7 h-7 text-destructive hover:text-destructive/80"

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
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-base">Vendor Contacts</FormLabel>
                                    <Button
                                        type="button"
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            const currentContacts = form.getValues("vendor_contact") || [];
                                            form.setValue("vendor_contact", [
                                                ...currentContacts,
                                                {
                                                    contact_type: "phone",
                                                    description: "",
                                                    info: []
                                                }
                                            ]);
                                        }}
                                    >
                                        <Plus className="h-4 w-4" /> Add Contact
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
                                                    onClick={() => {
                                                        const currentContacts = form.getValues("vendor_contact") || [];
                                                        form.setValue("vendor_contact", currentContacts.filter((_, i) => i !== index));
                                                    }}
                                                    className="w-7 h-7 text-destructive hover:text-destructive/80"

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
                                                        variant="default"
                                                        size="sm"
                                                        onClick={() => {
                                                            const currentContactInfo = form.getValues(`vendor_contact.${index}.info`) || [];
                                                            form.setValue(`vendor_contact.${index}.info`, [
                                                                ...currentContactInfo,
                                                                { label: "", value: "", data_type: "string" }
                                                            ]);
                                                        }}
                                                    >
                                                        <Plus className="h-4 w-4" /> Add Info
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
                                                                className="w-7 h-7 text-destructive hover:text-destructive/80"
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
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
