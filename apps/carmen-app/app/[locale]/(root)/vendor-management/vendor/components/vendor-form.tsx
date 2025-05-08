"use client"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus, Save, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { formType } from "@/dtos/form.dto"
import { createVendorService, updateVendorService } from "@/services/vendor.service"
import { useAuth } from "@/context/AuthContext"
import { toastSuccess, toastError } from "@/components/ui-custom/Toast"
import { vendorFormSchema, VendorFormValues, infoItemSchema, contactSchema } from "@/dtos/vendor.dto"
import { Link } from "@/lib/navigation"
import { Card } from "@/components/ui/card"

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
    const { token, tenantId } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues: mode === formType.ADD ? defaultValues : initData
    })

    // Add useEffect to reset form with initData when it changes
    useEffect(() => {
        if (initData && mode === formType.EDIT) {
            form.reset(initData);
        }
    }, [form, initData, mode]);

    const {
        fields: infoFields,
        append: appendInfo,
        remove: removeInfo,
    } = useFieldArray({
        control: form.control,
        name: "info",
    })

    const {
        fields: addressFields,
        append: appendAddress,
        remove: removeAddress,
    } = useFieldArray({
        control: form.control,
        name: "vendor_address",
    })

    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control: form.control,
        name: "vendor_contact",
    })

    const onSubmit = async (data: VendorFormValues) => {
        console.log('data', data)
        setIsSubmitting(true)

        try {
            let response;
            if (mode === formType.ADD) {
                response = await createVendorService(token, tenantId, data)
            } else {
                response = await updateVendorService(token, tenantId, { ...data, id: initData?.id })
            }

            if (response) {
                toastSuccess({ message: "Vendor created successfully" })
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            toastError({ message: "An error occurred while submitting the form." })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Helper function to add contact info field
    const addContactInfoField = (contactIndex: number) => {
        const currentInfo = form.getValues(`vendor_contact.${contactIndex}.info`) || []
        form.setValue(`vendor_contact.${contactIndex}.info`, [...currentInfo, { label: "", value: "", data_type: "string" }])
    }

    // Helper function to remove contact info field
    const removeContactInfoField = (contactIndex: number, infoIndex: number) => {
        const currentInfo = form.getValues(`vendor_contact.${contactIndex}.info`) || []
        if (currentInfo.length <= 1) return // Don't remove if it's the last one

        const newInfo = [...currentInfo]
        newInfo.splice(infoIndex, 1)
        form.setValue(`vendor_contact.${contactIndex}.info`, newInfo)
    };

    return (
        <Card className="p-4">
            <h1 className="text-lg font-medium text-foreground">{mode === formType.ADD ? "Add Vendor" : "Edit Vendor"}</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                        <Label htmlFor="name" className="text-xs font-medium text-foreground">
                            Vendor Name
                        </Label>
                        <Input id="name" {...form.register("name")} />
                        {form.formState.errors.name && (
                            <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="description" className="text-xs font-medium text-foreground">
                            Description
                        </Label>
                        <Textarea id="description" {...form.register("description")} />
                    </div>
                </div>

                <Tabs defaultValue="info" className="w-full border rounded-sm">
                    <TabsList className="w-full grid grid-cols-3 h-9  rounded-none border-b">
                        <TabsTrigger value="info" className="text-xs">
                            Info
                        </TabsTrigger>
                        <TabsTrigger value="address" className="text-xs">
                            Address
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="text-xs">
                            Contact
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="p-3 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-medium text-foreground">Additional Information</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => appendInfo({ label: "", value: "", data_type: "string" })}
                                className="h-7 text-xs"
                            >
                                <Plus className="h-3 w-3" />
                                Add Info
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {infoFields.map((field, index) => (
                                <div
                                    key={field.id}
                                    className="grid grid-cols-12 gap-2 items-center border border-border rounded p-2"
                                >
                                    <div className="col-span-4 space-y-1">
                                        <Label htmlFor={`info.${index}.label`} className="text-xs font-medium text-foreground">
                                            Label
                                        </Label>
                                        <Input id={`info.${index}.label`} {...form.register(`info.${index}.label`)} className="h-7 text-xs" />
                                    </div>
                                    <div className="col-span-5 space-y-1">
                                        <Label htmlFor={`info.${index}.value`} className="text-xs font-medium text-foreground">
                                            Value
                                        </Label>
                                        {form.watch(`info.${index}.data_type`) === "date" ? (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        className={cn(
                                                            "w-full justify-start text-left font-normal h-7 text-xs",
                                                            !form.watch(`info.${index}.value`) && "text-muted-foreground",
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                                        {form.watch(`info.${index}.value`) ? (
                                                            format(new Date(form.watch(`info.${index}.value`)), "PP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={
                                                            form.watch(`info.${index}.value`) ? new Date(form.watch(`info.${index}.value`)) : undefined
                                                        }
                                                        onSelect={(date) => form.setValue(`info.${index}.value`, date ? date.toISOString() : "")}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        ) : (
                                            <Input
                                                id={`info.${index}.value`}
                                                type={form.watch(`info.${index}.data_type`) === "number" ? "number" : "text"}
                                                {...form.register(`info.${index}.value`)}
                                                className="h-7 text-xs"
                                            />
                                        )}
                                    </div>
                                    <div className="col-span-2 space-y-1">
                                        <Label htmlFor={`info.${index}.data_type`} className="text-xs font-medium text-foreground">
                                            Type
                                        </Label>
                                        <Select
                                            onValueChange={(value) => form.setValue(`info.${index}.data_type`, value as z.infer<typeof infoItemSchema>["data_type"])}
                                            defaultValue={field.data_type}
                                        >
                                            <SelectTrigger id={`info.${index}.data_type`} className="h-7 text-xs">
                                                <SelectValue placeholder="Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="string" className="text-xs">
                                                    Text
                                                </SelectItem>
                                                <SelectItem value="number" className="text-xs">
                                                    Number
                                                </SelectItem>
                                                <SelectItem value="date" className="text-xs">
                                                    Date
                                                </SelectItem>
                                                <SelectItem value="datetime" className="text-xs">
                                                    DateTime
                                                </SelectItem>
                                                <SelectItem value="boolean" className="text-xs">
                                                    Boolean
                                                </SelectItem>
                                                <SelectItem value="dataset" className="text-xs">
                                                    Dataset
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-1 flex justify-end items-end h-full">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeInfo(index)}
                                            disabled={infoFields.length === 1}
                                            className="h-7 w-7 p-0"
                                        >
                                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                                            <span className="sr-only">Remove</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="address" className="p-3 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-medium text-foreground">Addresses</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    appendAddress({
                                        address_type: "mailing_address",
                                        data: {
                                            street: "",
                                            city: "",
                                            state: "",
                                            zip: "",
                                            country: "",
                                        },
                                    })
                                }
                                className="h-7 text-xs"
                            >
                                <Plus className="mr-1 h-3 w-3" />
                                Add Address
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {addressFields.map((field, index) => (
                                <div key={field.id} className="border border-border rounded p-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="w-1/3">
                                            <Label
                                                htmlFor={`vendor_address.${index}.address_type`}
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Address Type
                                            </Label>
                                            <Select
                                                onValueChange={(value) => form.setValue(`vendor_address.${index}.address_type`, value)}
                                                defaultValue={field.address_type}
                                            >
                                                <SelectTrigger id={`vendor_address.${index}.address_type`} className="h-7 text-xs mt-1">
                                                    <SelectValue placeholder="Select address type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mailing_address" className="text-xs">
                                                        Mailing Address
                                                    </SelectItem>
                                                    <SelectItem value="billing_address" className="text-xs">
                                                        Billing Address
                                                    </SelectItem>
                                                    <SelectItem value="shipping_address" className="text-xs">
                                                        Shipping Address
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeAddress(index)}
                                            disabled={addressFields.length === 1}
                                            className="h-7 w-7 p-0"
                                        >
                                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                                            <span className="sr-only">Remove</span>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-12 space-y-1">
                                            <Label
                                                htmlFor={`vendor_address.${index}.data.street`}
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Street
                                            </Label>
                                            <Input
                                                id={`vendor_address.${index}.data.street`}
                                                {...form.register(`vendor_address.${index}.data.street`)}
                                                className="h-7 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-6 space-y-1">
                                            <Label htmlFor={`vendor_address.${index}.data.city`} className="text-xs font-medium text-foreground">
                                                City
                                            </Label>
                                            <Input
                                                id={`vendor_address.${index}.data.city`}
                                                {...form.register(`vendor_address.${index}.data.city`)}
                                                className="h-7 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-6 space-y-1">
                                            <Label htmlFor={`vendor_address.${index}.data.state`} className="text-xs font-medium text-foreground">
                                                State/Province
                                            </Label>
                                            <Input
                                                id={`vendor_address.${index}.data.state`}
                                                {...form.register(`vendor_address.${index}.data.state`)}
                                                className="h-7 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-6 space-y-1">
                                            <Label htmlFor={`vendor_address.${index}.data.zip`} className="text-xs font-medium text-foreground">
                                                ZIP/Postal Code
                                            </Label>
                                            <Input
                                                id={`vendor_address.${index}.data.zip`}
                                                {...form.register(`vendor_address.${index}.data.zip`)}
                                                className="h-7 text-xs"
                                            />
                                        </div>
                                        <div className="col-span-6 space-y-1">
                                            <Label
                                                htmlFor={`vendor_address.${index}.data.country`}
                                                className="text-xs font-medium text-foreground"
                                            >
                                                Country
                                            </Label>
                                            <Input
                                                id={`vendor_address.${index}.data.country`}
                                                {...form.register(`vendor_address.${index}.data.country`)}
                                                className="h-7 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="contact" className="p-3 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-xs font-medium text-foreground">Contact Information</h3>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    appendContact({
                                        contact_type: "phone",
                                        description: "",
                                        info: [{ label: "Contact", value: "", data_type: "string" }],
                                    })
                                }
                                className="h-7 text-xs"
                            >
                                <Plus className="h-3 w-3" />
                                Add Contact
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {contactFields.map((field, contactIndex) => {
                                // Get the current contact info fields from form values
                                const contactInfoFields = form.watch(`vendor_contact.${contactIndex}.info`) || []

                                return (
                                    <div key={field.id} className="border border-border rounded p-2">
                                        <div className="grid grid-cols-12 gap-2 mb-2">
                                            <div className="col-span-5 space-y-1">
                                                <Label
                                                    htmlFor={`vendor_contact.${contactIndex}.contact_type`}
                                                    className="text-xs font-medium text-foreground"
                                                >
                                                    Contact Type
                                                </Label>
                                                <Select
                                                    onValueChange={(value) =>
                                                        form.setValue(`vendor_contact.${contactIndex}.contact_type`, value as z.infer<typeof contactSchema>["contact_type"])
                                                    }
                                                    defaultValue={field.contact_type}
                                                >
                                                    <SelectTrigger id={`vendor_contact.${contactIndex}.contact_type`} className="h-7 text-xs">
                                                        <SelectValue placeholder="Select contact type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="phone" className="text-xs">
                                                            Phone
                                                        </SelectItem>
                                                        <SelectItem value="email" className="text-xs">
                                                            Email
                                                        </SelectItem>
                                                        <SelectItem value="website" className="text-xs">
                                                            Website
                                                        </SelectItem>
                                                        <SelectItem value="other" className="text-xs">
                                                            Other
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="col-span-6 space-y-1">
                                                <Label
                                                    htmlFor={`vendor_contact.${contactIndex}.description`}
                                                    className="text-xs font-medium text-foreground"
                                                >
                                                    Description
                                                </Label>
                                                <Input
                                                    id={`vendor_contact.${contactIndex}.description`}
                                                    {...form.register(`vendor_contact.${contactIndex}.description`)}
                                                    placeholder="E.g., Primary Contact, Support, etc."
                                                    className="h-7 text-xs"
                                                />
                                            </div>
                                            <div className="col-span-1 flex justify-end items-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeContact(contactIndex)}
                                                    disabled={contactFields.length === 1}
                                                    className="h-7 w-7 p-0"
                                                >
                                                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-xs font-medium text-foreground">Contact Details</h4>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addContactInfoField(contactIndex)}
                                                    className="h-6 text-xs"
                                                >
                                                    <Plus className="mr-1 h-3 w-3" />
                                                    Add Detail
                                                </Button>
                                            </div>

                                            {contactInfoFields.map((infoField, infoIndex) => (
                                                <div
                                                    key={`contact-${contactIndex}-info-${infoIndex}`}
                                                    className="grid grid-cols-12 gap-2 items-center border border-border rounded p-1 bg-background"
                                                >
                                                    <div className="col-span-4 space-y-1">
                                                        <Label
                                                            htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.label`}
                                                            className="text-xs font-medium text-foreground"
                                                        >
                                                            Label
                                                        </Label>
                                                        <Input
                                                            id={`vendor_contact.${contactIndex}.info.${infoIndex}.label`}
                                                            {...form.register(`vendor_contact.${contactIndex}.info.${infoIndex}.label`)}
                                                            className="h-7 text-xs"
                                                        />
                                                    </div>
                                                    <div className="col-span-5 space-y-1">
                                                        <Label
                                                            htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.value`}
                                                            className="text-xs font-medium text-foreground"
                                                        >
                                                            Value
                                                        </Label>
                                                        {form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`) === "date" ? (
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <Button
                                                                        variant="outline"
                                                                        className={cn(
                                                                            "w-full justify-start text-left font-normal h-7 text-xs",
                                                                            !form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.value`) &&
                                                                            "text-muted-foreground",
                                                                        )}
                                                                    >
                                                                        <CalendarIcon className="mr-1 h-3 w-3" />
                                                                        {form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.value`) ? (
                                                                            format(
                                                                                new Date(form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.value`)),
                                                                                "PP",
                                                                            )
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={
                                                                            form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.value`)
                                                                                ? new Date(form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.value`))
                                                                                : undefined
                                                                        }
                                                                        onSelect={(date) =>
                                                                            form.setValue(
                                                                                `vendor_contact.${contactIndex}.info.${infoIndex}.value`,
                                                                                date ? date.toISOString() : "",
                                                                            )
                                                                        }
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        ) : (
                                                            <Input
                                                                id={`vendor_contact.${contactIndex}.info.${infoIndex}.value`}
                                                                type={
                                                                    form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`) === "number"
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                {...form.register(`vendor_contact.${contactIndex}.info.${infoIndex}.value`)}
                                                                className="h-7 text-xs"
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="col-span-2 space-y-1">
                                                        <Label
                                                            htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`}
                                                            className="text-xs font-medium text-foreground"
                                                        >
                                                            Type
                                                        </Label>
                                                        <Select
                                                            onValueChange={(value) =>
                                                                form.setValue(`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`, value as z.infer<typeof infoItemSchema>["data_type"])
                                                            }
                                                            defaultValue={infoField.data_type}
                                                        >
                                                            <SelectTrigger
                                                                id={`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`}
                                                                className="h-7 text-xs"
                                                            >
                                                                <SelectValue placeholder="Type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="string" className="text-xs">
                                                                    Text
                                                                </SelectItem>
                                                                <SelectItem value="number" className="text-xs">
                                                                    Number
                                                                </SelectItem>
                                                                <SelectItem value="date" className="text-xs">
                                                                    Date
                                                                </SelectItem>
                                                                <SelectItem value="datetime" className="text-xs">
                                                                    DateTime
                                                                </SelectItem>
                                                                <SelectItem value="boolean" className="text-xs">
                                                                    Boolean
                                                                </SelectItem>
                                                                <SelectItem value="dataset" className="text-xs">
                                                                    Dataset
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="col-span-1 flex justify-end items-end h-full">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeContactInfoField(contactIndex, infoIndex)}
                                                            disabled={contactInfoFields.length <= 1}
                                                            className="h-7 w-7 p-0"
                                                        >
                                                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                                                            <span className="sr-only">Remove</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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
                        {isSubmitting ? "Submitting..." : "Save Vendor"}
                    </Button>
                </div>
            </form>
        </Card>

    )
}
