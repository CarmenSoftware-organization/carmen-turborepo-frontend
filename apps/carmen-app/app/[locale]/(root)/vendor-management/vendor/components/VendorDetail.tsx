"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formType } from "@/dtos/form.dto";
import { VendorFormDto, VendorGetDto } from "@/dtos/vendor-management";
import { Link } from "@/lib/navigation";
import { ChevronLeft, Mail, MapPin, Phone, SquarePen } from "lucide-react";
import VendorFormDialog from "./VendorFormDialog";
import { v4 as uuidv4 } from 'uuid';

interface FormVendorProps {
    initialValues?: VendorFormDto;
    onSuccess?: () => void;
}

interface VendorAddressWithId {
    id: string;
    address_type: string;
    address: {
        line_1: string;
        line_2: string;
        sub_district: string;
        district: string;
        province: string;
        postal_code: string;
        country: string;
    };
    is_active: boolean;
}

interface VendorContactWithId {
    id: string;
    contact_type: string;
    description: string;
    info: Array<{
        label: string;
        value: string;
        data_type: string;
    }>;
    is_active: boolean;
}

export default function VendorDetail({ initialValues, onSuccess }: FormVendorProps) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    // Convert initialValues to VendorGetDto for the edit dialog
    const vendorData: VendorGetDto | undefined = initialValues ? {
        id: initialValues.id as string,
        name: initialValues.name,
        description: initialValues.description || "",
        is_active: initialValues.is_active,
        info: initialValues.info || [],
        vendor_address: initialValues.vendor_address?.map(address => ({
            id: (address as VendorAddressWithId).id || uuidv4(),
            address_type: address.address_type,
            address: address.address,
            is_active: (address as VendorAddressWithId).is_active || true
        })),
        vendor_contact: initialValues.vendor_contact?.map(contact => ({
            id: (contact as VendorContactWithId).id || uuidv4(),
            contact_type: contact.contact_type,
            description: contact.description,
            info: contact.info,
            is_active: (contact as VendorContactWithId).is_active || true
        }))
    } : undefined;

    const handleEditSuccess = () => {
        if (onSuccess) {
            onSuccess();
        }
    };

    return (
        <div className="p-2 space-y-2">
            <Card>
                <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link href="/vendor-management/vendor">
                                            <ChevronLeft className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <CardTitle className="text-xl font-bold">{initialValues?.name}</CardTitle>
                                    <Badge variant={initialValues?.is_active ? "active" : "inactive"}>{initialValues?.is_active ? "Active" : "Inactive"}</Badge>
                                </div>
                            </div>
                            <CardDescription className="my-1 mx-4">{initialValues?.description}</CardDescription>
                        </div>
                        <Button
                            variant="default"
                            size="sm"
                            className=""
                            onClick={() => setEditDialogOpen(true)}
                        >
                            <SquarePen className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                {initialValues?.info?.map((info, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-xs font-medium">{info.label}:</span>
                                        <span className="text-xs">{info.value ? info.value : "-"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Address Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {initialValues?.vendor_address && initialValues.vendor_address.map((address, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">
                                            {address.address_type === "contact_address" ? "Contact Address" : address.address_type}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {address.address.postal_code}
                                            <br />
                                            {address.address.province}
                                            {address.address.district}
                                            {address.address.sub_district}
                                            <br />
                                            {address.address.line_1}
                                            <br />
                                            {address.address.line_2}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {initialValues?.vendor_contact && initialValues.vendor_contact.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {initialValues.vendor_contact.map((contact, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {contact.contact_type === "phone" ? (
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Mail className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            <span className="text-xs font-medium">{contact.description}</span>
                                        </div>
                                        <Separator />
                                        <div>
                                            {contact.info.map((info, infoIndex) => (
                                                <div key={infoIndex} className="flex flex-col gap-1">
                                                    <span className="text-xs text-muted-foreground">{info.label}</span>
                                                    {contact.contact_type === "phone" ? (
                                                        <Link href={`tel:${info.value}`} className="text-xs text-primary hover:underline">
                                                            {info.value}
                                                        </Link>
                                                    ) : (
                                                        <Link href={`mailto:${info.value}`} className="text-xs text-primary hover:underline">
                                                            {info.value}
                                                        </Link>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="bg-muted rounded-md h-48 flex items-center justify-center mt-4">
                        <span className="text-muted-foreground">Map</span>
                    </div>
                </CardContent>
            </Card>

            {/* Vendor Edit Dialog */}
            {vendorData && (
                <VendorFormDialog
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    mode={formType.EDIT}
                    initialData={vendorData}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
}
