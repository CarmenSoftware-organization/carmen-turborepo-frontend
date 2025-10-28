"use client"

import { useEffect, useState, useMemo } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formType } from "@/dtos/form.dto"
import { useAuth } from "@/context/AuthContext"
import { useVendorMutation, useUpdateVendor } from "@/hooks/use-vendor"
import { useQueryClient } from "@tanstack/react-query"
import { toastSuccess, toastError } from "@/components/ui-custom/Toast"
import { VendorFormValues } from "@/dtos/vendor.dto"
import { createVendorFormSchema } from "../../_schemas/vendor-form.schema"
import { useRouter, Link } from "@/lib/navigation"
import { Card } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import InfoVendor from "./InfoVendor"
import AddressVendor from "./AddressVendor"
import ContactVendor from "./ContactVendor"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/form-custom/form"

const defaultValues: VendorFormValues = {
    id: "",
    name: "",
    description: "",
    info: [],
    vendor_address: [],
    vendor_contact: [],
};

interface VendorFormProps {
    readonly mode: formType;
    readonly initData?: VendorFormValues;
}

export default function VendorForm({ mode, initData }: VendorFormProps) {
    const tVendor = useTranslations('Vendor');
    const tCommon = useTranslations('Common');
    const [currentMode, setCurrentMode] = useState<formType>(mode);
    const router = useRouter();
    const { token, buCode } = useAuth();
    const queryClient = useQueryClient();

    const { mutate: createVendor, isPending: isCreating } = useVendorMutation(token, buCode);
    const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor(token, buCode, initData?.id ?? "");

    const isSubmitting = isCreating || isUpdating;

    const vendorFormSchema = useMemo(
        () => createVendorFormSchema({
            nameRequired: tVendor("vendor_name_required"),
        }),
        [tVendor]
    );

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: currentMode === formType.ADD ? defaultValues : initData
    })

    useEffect(() => {
        if (initData && currentMode === formType.EDIT) {
            form.reset(initData);
        }
    }, [form, initData, currentMode]);

    const onSubmit = (data: VendorFormValues) => {
        if (currentMode === formType.ADD) {
            createVendor(data, {
                onSuccess: (response: any) => {
                    toastSuccess({ message: tVendor("add_success") });
                    queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
                    const vendorId = response?.data?.id || response?.id;
                    if (vendorId) {
                        router.replace(`/vendor-management/vendor/${vendorId}`);
                        setCurrentMode(formType.VIEW);
                    }
                },
                onError: (error: Error) => {
                    console.error('Error creating vendor:', error);
                    toastError({ message: tVendor("add_error") });
                }
            });
        } else if (currentMode === formType.EDIT && initData?.id) {
            const submitData = { ...data, id: initData.id };
            updateVendor(submitData, {
                onSuccess: () => {
                    toastSuccess({ message: tVendor("update_success") });
                    queryClient.invalidateQueries({ queryKey: ["vendor", buCode, initData.id] });
                    setCurrentMode(formType.VIEW);
                },
                onError: (error: Error) => {
                    console.error('Error updating vendor:', error);
                    toastError({ message: tVendor("update_error") });
                }
            });
        }
    };


    return (
        <Card className="p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0" asChild>
                                <Link href={`/vendor-management/vendor`}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            </Button>
                            <h1 className="text-lg font-medium text-foreground">{mode === formType.ADD ? tVendor("add_vendor") : tVendor("edit_vendor")}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/vendor-management/vendor">
                                    <X />
                                </Link>
                            </Button>
                            <Button type="submit" size={'sm'} disabled={isSubmitting}>
                                <Save />
                            </Button>
                        </div>
                    </div>
                    <FormField
                        control={form.control}
                        name="name"
                        required
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium">
                                    {tVendor("title")}
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xs font-medium">
                                    {tCommon("description")}
                                </FormLabel>
                                <FormControl>
                                    <Textarea {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

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


                </form>
            </Form>
        </Card>

    )
}
