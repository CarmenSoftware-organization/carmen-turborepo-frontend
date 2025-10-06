"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formType } from "@/dtos/form.dto"
import { useAuth } from "@/context/AuthContext"
import { useVendorMutation, useUpdateVendor } from "@/hooks/useVendor"
import { useQueryClient } from "@tanstack/react-query"
import { toastSuccess, toastError } from "@/components/ui-custom/Toast"
import { vendorFormSchema, VendorFormValues } from "@/dtos/vendor.dto"
import { Link } from "@/lib/navigation"
import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import InfoVendor from "./InfoVendor"
import AddressVendor from "./AddressVendor"
import ContactVendor from "./ContactVendor"

const defaultValues: VendorFormValues = {
    id: "",
    name: "",
    description: "",
    info: [{ label: "", value: "", data_type: "string" }],
    vendor_address: [
        {
            address_type: "mailing_address",
            data: {
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
            },
        },
    ],
    vendor_contact: [
        {
            contact_type: "phone",
            description: "",
            info: [{ label: "Phone Number", value: "", data_type: "string" }],
        },
    ],
};

interface VendorFormProps {
    readonly mode: formType;
    readonly initData?: VendorFormValues;
}

export default function VendorForm({ mode, initData }: VendorFormProps) {
    const tVendor = useTranslations('Vendor');
    const tCommon = useTranslations('Common');

    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    const { mutate: createVendor, isPending: isCreating } = useVendorMutation(token, buCode);
    const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor(token, buCode, initData?.id ?? "");

    const isSubmitting = isCreating || isUpdating;

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: mode === formType.ADD ? defaultValues : initData
    })

    useEffect(() => {
        if (initData && mode === formType.EDIT) {
            form.reset(initData);
        }
    }, [form, initData, mode]);

    const onSubmit = (data: VendorFormValues) => {
        console.log("Form submitted with data:", data);
        console.log("Mode:", mode);
        console.log("InitData:", initData);
        
        if (mode === formType.ADD) {
            createVendor(data, {
                onSuccess: () => {
                    toastSuccess({ message: tVendor("add_success") });
                    queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
                    // Optional: redirect back to vendor list
                    // router.push("/vendor-management/vendor");
                },
                onError: (error) => {
                    console.error("Error creating vendor:", error);
                    toastError({ message: tVendor("add_error") });
                }
            });
        } else if (initData?.id) {
            const updateData = { ...data, id: initData.id };
            updateVendor(updateData, {
                onSuccess: () => {
                    toastSuccess({ message: tVendor("update_success") });
                    queryClient.invalidateQueries({ queryKey: ["vendor", buCode, initData.id] });
                    // Optional: redirect back to vendor list
                    // router.push("/vendor-management/vendor");
                },
                onError: (error) => {
                    console.error("Error updating vendor:", error);
                    toastError({ message: tVendor("update_error") });
                }
            });
        }
    }

    return (
        <Card className="p-4">
            <h1 className="text-lg font-medium text-foreground">{mode === formType.ADD ? tVendor("add_vendor") : tVendor("edit_vendor")}</h1>
            <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.log("Form validation errors:", errors);
            })} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-medium text-foreground">
                            {tVendor("title")}
                        </Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs font-medium text-foreground">
                            {tCommon("description")}
                        </Label>
                        <Textarea id="description" {...form.register("description")} />
                    </div>
                </div>

                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="w-full grid grid-cols-3 h-9 rounded-none">
                        <TabsTrigger value="info" className="text-xs">
                            {tVendor("info")}
                        </TabsTrigger>
                        <TabsTrigger value="address" className="text-xs">
                            {tVendor("address")}
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="text-xs">
                            {tVendor("contact")}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="p-3 space-y-3">
                        <InfoVendor form={form} />
                    </TabsContent>

                    <TabsContent value="address" className="p-3 space-y-3">
                        <AddressVendor form={form} />
                    </TabsContent>

                    <TabsContent value="contact" className="p-3 space-y-3">
                        <ContactVendor form={form} />
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end mt-4 gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs px-4" asChild>
                        <Link href="/vendor-management/vendor">
                            Cancel
                        </Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="h-8 text-xs px-4 bg-primary text-primary-foreground hover:bg-primary/90">
                        <Save className="h-3 w-3" />
                        {isSubmitting ? tCommon("submitting") : tCommon("save")}
                    </Button>
                </div>
            </form>
        </Card>

    )
}
