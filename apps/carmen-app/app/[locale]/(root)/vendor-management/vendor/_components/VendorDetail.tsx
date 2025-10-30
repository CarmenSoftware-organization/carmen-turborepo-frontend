"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Download, Mail, Phone, Globe, MapPin, ChevronLeft } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { VendorFormValues } from "@/dtos/vendor.dto";
import VendorForm from "./form/VendorForm";
import { formType } from "@/dtos/form.dto";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface VendorDetailProps {
  vendor: VendorFormValues;
}

const formatDate = (dateString: string | undefined, includeTime = false) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return includeTime ? format(date, "MMM d, yyyy 'at' h:mm a") : format(date, "MMM d, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};
const formatValue = (value: string | undefined, dataType: string | undefined) => {
  if (!value) return "N/A";
  switch (dataType) {
    case "date":
    case "datetime":
      return formatDate(value, dataType === "datetime");
    case "number":
      return new Intl.NumberFormat().format(Number(value));
    default:
      return value;
  }
};

const getContactIcon = (type: string | undefined) => {
  if (!type) return null;
  switch (type) {
    case "phone_number":
      return <Phone className="h-3 w-3" />;
    case "email_address":
      return <Mail className="h-3 w-3" />;
    case "website":
      return <Globe className="h-3 w-3" />;
    default:
      return null;
  }
};

export default function VendorDetail({ vendor }: VendorDetailProps) {
  const tCommon = useTranslations("Common");
  const tVendor = useTranslations("Vendor");
  const tAction = useTranslations("Action");
  const [isEditMode, setIsEditMode] = useState(false);
  const handleEdit = () => setIsEditMode(true);

  if (isEditMode) {
    return <VendorForm mode={formType.EDIT} initData={vendor} />;
  }

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
            {tCommon("export")}
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={handleEdit}>
            <Edit className="h-3 w-3" />
            {tAction("edit")}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-1">
        <p className="text-xs font-semibold">{tCommon("description")}</p>
        <p className="text-xs">{vendor.description ? vendor.description : "-"}</p>
      </div>

      <Tabs className="w-full" defaultValue="info">
        <TabsList className="w-full grid grid-cols-3 h-9">
          <TabsTrigger value="info">{tVendor("info")}</TabsTrigger>
          <TabsTrigger value="address">{tVendor("address")}</TabsTrigger>
          <TabsTrigger value="contact">{tVendor("contact")}</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="p-4 space-y-3">
          <h3 className="text-xs font-medium">{tVendor("additional_info")}</h3>
          {vendor?.info && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendor.info?.map((item, index) => (
                <div key={index} className="space-y-1 mt-1">
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-xs">{formatValue(item.value, item.data_type)}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="address" className="p-4 space-y-3">
          <h3 className="text-xs font-medium text-gray-700 mb-3">{tVendor("address")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendor?.vendor_address?.map((address, index) => (
              <div key={index} className="border border-gray-100 rounded p-3">
                <div className="flex items-center gap-1 mb-2">
                  <MapPin className="h-3 w-3 text-gray-500" />
                  <p className="text-xs font-medium text-gray-700">
                    {address?.address_type
                      ?.replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
                <Separator className="my-2" />
                {address?.data && (
                  <div className="space-y-1 text-xs">
                    <p>{address.data.address_line1}</p>
                    {address.data.address_line2 && <p>{address.data.address_line2}</p>}
                    <p>
                      {address.data.district}, {address.data.province} {address.data.postal_code}
                    </p>
                    <p>{address.data.country}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contact" className="p-2 space-y-3">
          <h3 className="text-xs">{tVendor("contact_info")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendor?.vendor_contact?.map((contact, index) => (
              <div key={index} className="p-2">
                <div className="flex items-center gap-1 mb-1">
                  {contact?.contact_type && getContactIcon(contact.contact_type)}
                  <p className="text-xs">
                    {contact?.contact_type?.replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                </div>
                <p className="text-xs mb-2">{contact.description}</p>
                <Separator className="my-2" />
                {contact.info && (
                  <div className="space-y-2">
                    {contact.info.map((item, infoIndex) => (
                      <div key={infoIndex} className="p-2">
                        <p className="text-xs font-medium text-gray-500">{item.label}</p>
                        <p className="text-sm">{formatValue(item.value, item.data_type)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
