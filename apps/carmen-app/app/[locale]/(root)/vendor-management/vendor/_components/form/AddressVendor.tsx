import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, MapPin, Building2, Truck, Contact } from "lucide-react";

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
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

interface AddressVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

const getAddressIcon = (type: string) => {
  switch (type) {
    case "mailing_address":
      return <MapPin className="h-4 w-4" />;
    case "billing_address":
      return <Building2 className="h-4 w-4" />;
    case "shipping_address":
      return <Truck className="h-4 w-4" />;
    case "contact_address":
      return <Contact className="h-4 w-4" />;
    default:
      return <MapPin className="h-4 w-4" />;
  }
};

export default function AddressVendor({ form, disabled }: AddressVendorProps) {
  const {
    fields: addressFields,
    append: appendAddress,
    remove: removeAddress,
  } = useFieldArray({
    control: form.control,
    name: "vendor_address",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        {!disabled && (
          <Button
            type="button"
            size="sm"
            onClick={() =>
              appendAddress({
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
              })
            }
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3" />
            Add Address
          </Button>
        )}
      </div>

      <ScrollArea className="h-[394px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addressFields.map((field, index) => (
            <Card key={field.id} className="p-4 space-y-4 relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-full">
                    {getAddressIcon(
                      form.watch(`vendor_address.${index}.address_type`) || "mailing_address"
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(`vendor_address.${index}.address_type`, value)
                      }
                      defaultValue={field.address_type}
                      disabled={disabled}
                    >
                      <SelectTrigger
                        id={`vendor_address.${index}.address_type`}
                        className="h-7 w-[140px] text-xs border-none shadow-none p-0 h-auto font-semibold focus:ring-0"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailing_address">Mailing Address</SelectItem>
                        <SelectItem value="billing_address">Billing Address</SelectItem>
                        <SelectItem value="shipping_address">Shipping Address</SelectItem>
                        <SelectItem value="contact_address">Contact Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAddress(index)}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      District
                    </Label>
                    <Input
                      {...form.register(`vendor_address.${index}.data.district`)}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      City
                    </Label>
                    <Input
                      {...form.register(`vendor_address.${index}.data.city`)}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Province
                    </Label>
                    <Input
                      {...form.register(`vendor_address.${index}.data.province`)}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Postal Code
                    </Label>
                    <Input
                      {...form.register(`vendor_address.${index}.data.postal_code`)}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                      Country
                    </Label>
                    <Input
                      {...form.register(`vendor_address.${index}.data.country`)}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Address Line 1
                  </Label>
                  <Textarea
                    {...form.register(`vendor_address.${index}.data.address_line1`)}
                    className="h-8 text-sm"
                    disabled={disabled}
                    placeholder="Street address, P.O. box"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                    Address Line 2
                  </Label>
                  <Textarea
                    {...form.register(`vendor_address.${index}.data.address_line2`)}
                    className="h-8 text-sm"
                    disabled={disabled}
                    placeholder="Apartment, suite, unit, etc."
                  />
                </div>
              </div>
            </Card>
          ))}
          {addressFields.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
              <MapPin className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No addresses added yet</p>
              {!disabled && (
                <Button
                  variant="link"
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
                  className="text-primary"
                >
                  Add your first address
                </Button>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
