"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Trash2, Download, Mail, Phone, Globe, MapPin } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { VendorFormValues } from "@/dtos/vendor.dto"
import VendorForm from "./vendor-form"
import { formType } from "@/dtos/form.dto"

interface VendorDetailProps {
    vendor: VendorFormValues & {
        status?: string;
        created_at?: string;
        updated_at?: string;
    }
}

export default function VendorDetail({ vendor }: VendorDetailProps) {
    const [activeTab, setActiveTab] = useState("info")
    const [isEditMode, setIsEditMode] = useState(false)

    // Handle toggling edit mode
    const handleEdit = () => setIsEditMode(true)
    const handleBack = () => setIsEditMode(false)

    const formatDate = (dateString: string | undefined, includeTime = false) => {
        if (!dateString) return "N/A"
        try {
            const date = new Date(dateString)
            return includeTime ? format(date, "MMM d, yyyy 'at' h:mm a") : format(date, "MMM d, yyyy")
        } catch (error) {
            console.error("Error formatting date:", error)
            return dateString
        }
    }
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
    }

    // Get icon for contact type
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
    }

    // If in edit mode, render the VendorForm component
    if (isEditMode) {
        return (
            <main className="bg-gray-50 min-h-screen">
                <div className="max-w-screen-xl mx-auto py-4 px-4">
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                        <div className="border-b border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleBack}>
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <h1 className="text-lg font-medium text-gray-800">Edit Vendor</h1>
                                    <p className="text-xs text-gray-500">Vendor ID: {vendor.id || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <VendorForm mode={formType.EDIT} initData={vendor} />
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="bg-gray-50 min-h-screen">
            <div className="max-w-screen-xl mx-auto py-4 px-4">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                    {/* Header */}
                    <div className="border-b border-gray-200 p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Link href={`/vendor-management/vendor`}>
                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                        <ArrowLeft className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-lg font-medium text-gray-800">{vendor.name}</h1>
                                        <Badge variant={vendor.status === "active" ? "default" : "secondary"} className="text-[10px] h-5">
                                            {vendor.status?.toUpperCase() || "N/A"}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500">Vendor ID: {vendor.id || "N/A"}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    <Download className="mr-1 h-3 w-3" />
                                    Export
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                    <Trash2 className="mr-1 h-3 w-3" />
                                    Delete
                                </Button>
                                <Button size="sm" className="h-7 text-xs" onClick={handleEdit}>
                                    <Edit className="mr-1 h-3 w-3" />
                                    Edit
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs font-medium text-gray-500">Description</p>
                                <p className="text-sm">{vendor.description || "No description available"}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Created</p>
                                <p className="text-sm">{formatDate(vendor.created_at, true)}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-500">Last Updated</p>
                                <p className="text-sm">{formatDate(vendor.updated_at, true)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabbed Content */}
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full grid grid-cols-3 h-9 bg-gray-50 rounded-none border-b">
                            <TabsTrigger value="info" className="text-xs font-medium rounded-none data-[state=active]:bg-white">
                                Additional Info
                            </TabsTrigger>
                            <TabsTrigger value="address" className="text-xs font-medium rounded-none data-[state=active]:bg-white">
                                Addresses
                            </TabsTrigger>
                            <TabsTrigger value="contact" className="text-xs font-medium rounded-none data-[state=active]:bg-white">
                                Contacts
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="info" className="p-4 space-y-3">
                            <h3 className="text-xs font-medium text-gray-700 mb-3">Additional Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {vendor.info.map((item, index) => (
                                    <div key={index} className="border border-gray-100 rounded p-2 bg-gray-50">
                                        <p className="text-xs font-medium text-gray-500">{item.label}</p>
                                        <p className="text-sm">{formatValue(item.value, item.data_type)}</p>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="address" className="p-4 space-y-3">
                            <h3 className="text-xs font-medium text-gray-700 mb-3">Addresses</h3>
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
                                        <div className="space-y-1 text-sm">
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

                        <TabsContent value="contact" className="p-4 space-y-3">
                            <h3 className="text-xs font-medium text-gray-700 mb-3">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {vendor.vendor_contact.map((contact, index) => (
                                    <div key={index} className="border border-gray-100 rounded p-3 bg-gray-50">
                                        <div className="flex items-center gap-1 mb-1">
                                            {getContactIcon(contact.contact_type)}
                                            <p className="text-xs font-medium text-gray-700">
                                                {contact.contact_type.replace(/\b\w/g, (l) => l.toUpperCase())}
                                            </p>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-2">{contact.description}</p>
                                        <Separator className="my-2" />
                                        <div className="space-y-2">
                                            {contact.info.map((item, infoIndex) => (
                                                <div key={infoIndex} className="bg-white p-2 rounded border border-gray-100">
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
                </div>
            </div>
        </main>
    )
}
