"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Building2, MapPin, Users, FileText, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessType {
  id: string;
  name: string;
}

interface CustomInfo {
  label: string;
  value: string;
  data_type: string;
}

interface VendorAddress {
  address_type: string;
  data: {
    address_line1: string;
    address_line2: string;
    district: string;
    province: string;
    city: string;
    postal_code: string;
    country: string;
  };
}

interface VendorContact {
  name: string;
  email: string;
  phone: string;
  is_primary: boolean;
}

interface VendorData {
  name: string;
  code: string;
  description: string;
  business_type: BusinessType[];
  info: CustomInfo[];
  vendor_address: VendorAddress[];
  vendor_contact: VendorContact[];
}

export function VendorRegistrationForm() {
  const [formData, setFormData] = useState<VendorData>({
    name: "",
    code: "",
    description: "",
    business_type: [],
    info: [],
    vendor_address: [],
    vendor_contact: [],
  });

  const [businessTypeName, setBusinessTypeName] = useState("");
  const [customFieldLabel, setCustomFieldLabel] = useState("");
  const [customFieldValue, setCustomFieldValue] = useState("");
  const [customFieldType, setCustomFieldType] = useState("string");
  const [success, setSuccess] = useState(false);

  const addBusinessType = () => {
    if (businessTypeName.trim()) {
      setFormData({
        ...formData,
        business_type: [
          ...formData.business_type,
          { id: crypto.randomUUID(), name: businessTypeName },
        ],
      });
      setBusinessTypeName("");
    }
  };

  const removeBusinessType = (id: string) => {
    setFormData({
      ...formData,
      business_type: formData.business_type.filter((bt) => bt.id !== id),
    });
  };

  const addCustomField = () => {
    if (customFieldLabel.trim() && customFieldValue.trim()) {
      setFormData({
        ...formData,
        info: [
          ...formData.info,
          { label: customFieldLabel, value: customFieldValue, data_type: customFieldType },
        ],
      });
      setCustomFieldLabel("");
      setCustomFieldValue("");
      setCustomFieldType("string");
    }
  };

  const removeCustomField = (index: number) => {
    setFormData({
      ...formData,
      info: formData.info.filter((_, i) => i !== index),
    });
  };

  const addAddress = () => {
    setFormData({
      ...formData,
      vendor_address: [
        ...formData.vendor_address,
        {
          address_type: "mailing_address",
          data: {
            address_line1: "",
            address_line2: "",
            district: "",
            province: "",
            city: "",
            postal_code: "",
            country: "",
          },
        },
      ],
    });
  };

  const updateAddress = (index: number, field: string, value: string) => {
    const newAddresses = [...formData.vendor_address];
    if (field === "address_type") {
      newAddresses[index].address_type = value;
    } else {
      newAddresses[index].data = { ...newAddresses[index].data, [field]: value };
    }
    setFormData({ ...formData, vendor_address: newAddresses });
  };

  const removeAddress = (index: number) => {
    setFormData({
      ...formData,
      vendor_address: formData.vendor_address.filter((_, i) => i !== index),
    });
  };

  const addContact = () => {
    setFormData({
      ...formData,
      vendor_contact: [
        ...formData.vendor_contact,
        { name: "", email: "", phone: "", is_primary: formData.vendor_contact.length === 0 },
      ],
    });
  };

  const updateContact = (index: number, field: string, value: string | boolean) => {
    const newContacts = [...formData.vendor_contact];
    if (field === "is_primary" && value === true) {
      newContacts.forEach((c, i) => {
        c.is_primary = i === index;
      });
    } else {
      newContacts[index] = { ...newContacts[index], [field]: value };
    }
    setFormData({ ...formData, vendor_contact: newContacts });
  };

  const removeContact = (index: number) => {
    setFormData({
      ...formData,
      vendor_contact: formData.vendor_contact.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Vendor Data:", JSON.stringify(formData, null, 2));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Vendor Registration</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Complete vendor information and contact details
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            ERP System
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <CardTitle>Basic Information</CardTitle>
              </div>
              <CardDescription>Essential vendor details and identification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Vendor Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter vendor name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-input"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Vendor Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="code"
                    placeholder="e.g., V-001234"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="bg-input"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the vendor"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[100px] bg-input"
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Types */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Business Types</CardTitle>
              </div>
              <CardDescription>Categories and classifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add business type"
                  value={businessTypeName}
                  onChange={(e) => setBusinessTypeName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBusinessType())}
                  className="bg-input"
                />
                <Button type="button" onClick={addBusinessType} size="icon" variant="secondary">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.business_type.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.business_type.map((bt) => (
                    <Badge key={bt.id} variant="secondary" className="gap-1 pl-3 pr-1">
                      {bt.name}
                      <button
                        type="button"
                        onClick={() => removeBusinessType(bt.id)}
                        className="ml-1 rounded-sm hover:bg-accent"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Fields */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Custom Information</CardTitle>
              </div>
              <CardDescription>Additional vendor-specific data fields</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-12">
                <div className="space-y-2 md:col-span-4">
                  <Input
                    placeholder="Field label"
                    value={customFieldLabel}
                    onChange={(e) => setCustomFieldLabel(e.target.value)}
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2 md:col-span-4">
                  <Input
                    placeholder="Field value"
                    value={customFieldValue}
                    onChange={(e) => setCustomFieldValue(e.target.value)}
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Select value={customFieldType} onValueChange={setCustomFieldType}>
                    <SelectTrigger className="bg-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  onClick={addCustomField}
                  size="icon"
                  variant="secondary"
                  className="md:col-span-1"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {formData.info.length > 0 && (
                <div className="space-y-2">
                  {formData.info.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-3"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium">{field.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {field.value}{" "}
                          <Badge variant="outline" className="ml-2 text-xs">
                            {field.data_type}
                          </Badge>
                        </span>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeCustomField(index)}
                        size="icon"
                        variant="ghost"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Addresses */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <CardTitle>Addresses</CardTitle>
                </div>
                <Button type="button" onClick={addAddress} size="sm" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Address
                </Button>
              </div>
              <CardDescription>Vendor location and mailing addresses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.vendor_address.map((address, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Address {index + 1}</Label>
                    <Button
                      type="button"
                      onClick={() => removeAddress(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Address Type</Label>
                    <Select
                      value={address.address_type}
                      onValueChange={(value) => updateAddress(index, "address_type", value)}
                    >
                      <SelectTrigger className="bg-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailing_address">Mailing Address</SelectItem>
                        <SelectItem value="billing_address">Billing Address</SelectItem>
                        <SelectItem value="shipping_address">Shipping Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Address Line 1</Label>
                      <Input
                        placeholder="Street address"
                        value={address.data.address_line1}
                        onChange={(e) => updateAddress(index, "address_line1", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Address Line 2</Label>
                      <Input
                        placeholder="Apt, suite, etc."
                        value={address.data.address_line2}
                        onChange={(e) => updateAddress(index, "address_line2", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">District</Label>
                      <Input
                        placeholder="District"
                        value={address.data.district}
                        onChange={(e) => updateAddress(index, "district", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">City</Label>
                      <Input
                        placeholder="City"
                        value={address.data.city}
                        onChange={(e) => updateAddress(index, "city", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Province</Label>
                      <Input
                        placeholder="Province/State"
                        value={address.data.province}
                        onChange={(e) => updateAddress(index, "province", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Postal Code</Label>
                      <Input
                        placeholder="Postal code"
                        value={address.data.postal_code}
                        onChange={(e) => updateAddress(index, "postal_code", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-sm font-medium">Country</Label>
                      <Input
                        placeholder="Country"
                        value={address.data.country}
                        onChange={(e) => updateAddress(index, "country", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contacts */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle>Contact Persons</CardTitle>
                </div>
                <Button type="button" onClick={addContact} size="sm" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Contact
                </Button>
              </div>
              <CardDescription>Key contact information for vendor representatives</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.vendor_contact.map((contact, index) => (
                <div
                  key={index}
                  className="space-y-4 rounded-lg border border-border bg-muted/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Label className="text-base font-semibold">Contact {index + 1}</Label>
                      {contact.is_primary && (
                        <Badge variant="default" className="text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeContact(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Name</Label>
                      <Input
                        placeholder="Full name"
                        value={contact.name}
                        onChange={(e) => updateContact(index, "name", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={contact.email}
                        onChange={(e) => updateContact(index, "email", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Phone</Label>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={contact.phone}
                        onChange={(e) => updateContact(index, "phone", e.target.value)}
                        className="bg-input"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`primary-${index}`}
                      checked={contact.is_primary}
                      onChange={(e) => updateContact(index, "is_primary", e.target.checked)}
                      className="h-4 w-4 rounded border-border bg-input"
                    />
                    <Label htmlFor={`primary-${index}`} className="text-sm">
                      Set as primary contact
                    </Label>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              All required fields must be completed before submission
            </p>
            <div className="flex gap-3">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" className="min-w-[120px]">
                {success ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Saved
                  </>
                ) : (
                  "Register Vendor"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
