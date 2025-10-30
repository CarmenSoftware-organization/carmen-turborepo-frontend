"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { useTranslations } from "next-intl";

interface AddressVendorProps {
  form: UseFormReturn<VendorFormValues>;
}

export default function AddressVendor({ form }: AddressVendorProps) {
  const tVendor = useTranslations("Vendor");
  const tAction = useTranslations("Action");

  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: "vendor_address",
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium text-foreground">{tVendor("address")}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            appendAddress({
              address_type: "mailing_address",
              data: {
                address_line1: "",
                address_line2: "",
                district: "",
                province: "",
                postal_code: "",
                country: "",
              },
            })
          }
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3" />
          {tVendor("add_address")}
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
                  {tVendor("address_type")}
                </Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue(`vendor_address.${index}.address_type`, value)
                  }
                  defaultValue={field.address_type}
                >
                  <SelectTrigger
                    id={`vendor_address.${index}.address_type`}
                    className="h-7 text-xs mt-1"
                  >
                    <SelectValue placeholder="Select address type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mailing_address" className="text-xs">
                      {tVendor("mailing_address")}
                    </SelectItem>
                    <SelectItem value="billing_address" className="text-xs">
                      {tVendor("billing_address")}
                    </SelectItem>
                    <SelectItem value="shipping_address" className="text-xs">
                      {tVendor("shipping_address")}
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
                <span className="sr-only">{tAction("delete")}</span>
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-12 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.address_line1`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("address_line1")}
                </Label>
                <Input
                  id={`vendor_address.${index}.data.address_line1`}
                  {...form.register(`vendor_address.${index}.data.address_line1`)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-12 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.address_line2`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("address_line2")}
                </Label>
                <Input
                  id={`vendor_address.${index}.data.address_line2`}
                  {...form.register(`vendor_address.${index}.data.address_line2`)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-6 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.district`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("district")}
                </Label>
                <Input
                  id={`vendor_address.${index}.data.district`}
                  {...form.register(`vendor_address.${index}.data.district`)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-6 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.province`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("province")}
                </Label>
                <Input
                  id={`vendor_address.${index}.data.province`}
                  {...form.register(`vendor_address.${index}.data.province`)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-6 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.postal_code`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("postal_code")}
                </Label>
                <Input
                  id={`vendor_address.${index}.data.postal_code`}
                  {...form.register(`vendor_address.${index}.data.postal_code`)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="col-span-6 space-y-1">
                <Label
                  htmlFor={`vendor_address.${index}.data.country`}
                  className="text-xs font-medium text-foreground"
                >
                  {tVendor("country")}
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
    </div>
  );
}
