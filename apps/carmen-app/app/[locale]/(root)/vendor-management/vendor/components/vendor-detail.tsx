"use client"

import { useState } from "react"
import Link from "next/link"
import { Edit, Download, Mail, Phone, Globe, MapPin, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { VendorFormValues } from "@/dtos/vendor.dto"
import VendorForm from "./vendor-form"
import { formType } from "@/dtos/form.dto"
import { Card } from "@/components/ui/card"

interface VendorDetailProps {
    vendor: VendorFormValues
}

const formatDate = (dateString: string | undefined, includeTime = false) => {
    if (!dateString) return "N/A"
    try {
        const date = new Date(dateString)
        return includeTime ? format(date, "MMM d, yyyy 'at' h:mm a") : format(date, "MMM d, yyyy")
    } catch (error) {
        console.error("Error formatting date:", error)
        return dateString
    }
};
const formatValue = (value: string, dataType: string) => {
    switch (dataType) {
        case "date":
        case "datetime":
            return formatDate(value, dataType === "datetime")
        case "number":
            return new Intl.NumberFormat().format(Number(value))
        default:
            return value
    }
};

const getContactIcon = (type: string) => {
    switch (type) {
        case "phone":
            return <Phone className="h-3 w-3" />
        case "email":
            return <Mail className="h-3 w-3" />
        case "website":
            return <Globe className="h-3 w-3" />
        default:
            return null
    }
};

export default function VendorDetail({ vendor }: VendorDetailProps) {
    const [isEditMode, setIsEditMode] = useState(false);
    const handleEdit = () => setIsEditMode(true);

    if (isEditMode) {
        return <VendorForm mode={formType.EDIT} initData={vendor} />;
    };

    return (
        <Card className="p-4">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                        <Link href={`/vendor-management/vendor`}>
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <p className="text-lg font-medium">{vendor.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs">
                        <Download className="h-3 w-3" />
                        Export
                    </Button>
                    <Button size="sm" className="h-7 text-xs" onClick={handleEdit}>
                        <Edit className="h-3 w-3" />
                        Edit
                    </Button>
                </div>
            </div>

            <div className="p-4 space-y-1">
                <p className="text-xs font-semibold">Description</p>
                <p className="text-xs">{vendor.description || "No description available"}</p>
            </div>

            <Tabs className="w-full" defaultValue="info">
                <TabsList className="w-full grid grid-cols-3 h-9">
                    <TabsTrigger value="info">
                        Info
                    </TabsTrigger>
                    <TabsTrigger value="address">
                        Address
                    </TabsTrigger>
                    <TabsTrigger value="contact">
                        Contacts
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="p-4 space-y-3">
                    <h3 className="text-xs font-medium">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vendor.info.map((item, index) => (
                            <div key={index} className="space-y-1 mt-1">
                                <p className="text-xs font-semibold">{item.label}</p>
                                <p className="text-xs">{formatValue(item.value, item.data_type)}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="address" className="p-4 space-y-3">
                    <h3 className="text-xs font-medium text-gray-700 mb-3">Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendor.vendor_address.map((address, index) => (
                            <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                                <div className="flex items-center gap-1 mb-2">
                                    <MapPin className="h-3 w-3 text-gray-500" />
                                    <p className="text-xs font-medium text-gray-700">
                                        {address.address_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </p>
                                </div>
                                <Separator className="my-2" />
                                <div className="space-y-1 text-xs">
                                    <p>{address.data.street}</p>
                                    <p>
                                        {address.data.city}, {address.data.state} {address.data.zip}
                                    </p>
                                    <p>{address.data.country}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="contact" className="p-2 space-y-3">
                    <h3 className="text-xs">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vendor.vendor_contact.map((contact, index) => (
                            <div key={index} className="p-2">
                                <div className="flex items-center gap-1 mb-1">
                                    {getContactIcon(contact.contact_type)}
                                    <p className="text-xs">
                                        {contact.contact_type.replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </p>
                                </div>
                                <p className="text-xs mb-2">{contact.description}</p>
                                <Separator className="my-2" />
                                <div className="space-y-2">
                                    {contact.info.map((item, infoIndex) => (
                                        <div key={infoIndex} className="p-2">
                                            <p className="text-xs font-medium text-gray-500">{item.label}</p>
                                            <p className="text-sm">{formatValue(item.value, item.data_type)}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </Card>
    )
}
