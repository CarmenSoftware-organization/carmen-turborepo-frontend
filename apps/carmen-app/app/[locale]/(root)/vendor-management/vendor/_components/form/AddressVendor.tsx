import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface AddressVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Addresses</h3>
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
            className="h-6 text-[10px] px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Address
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">Type</TableHead>
              <TableHead className="min-w-[250px]">Address</TableHead>
              <TableHead className="w-[200px]">Locality</TableHead>
              <TableHead className="w-[180px]">Region</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addressFields.length > 0 ? (
              addressFields.map((field, index) => (
                <TableRow key={field.id} className="hover:bg-muted/5">
                  <TableCell className="align-top py-1.5">
                    <Select
                      onValueChange={(value) =>
                        form.setValue(`vendor_address.${index}.address_type`, value)
                      }
                      defaultValue={field.address_type}
                      disabled={disabled}
                    >
                      <SelectTrigger className="h-7 text-xs w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailing_address">Mailing Address</SelectItem>
                        <SelectItem value="billing_address">Billing Address</SelectItem>
                        <SelectItem value="shipping_address">Shipping Address</SelectItem>
                        <SelectItem value="contact_address">Contact Address</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.address_line1`)}
                        className="h-7 text-xs"
                        placeholder="Address Line 1"
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.address_line2`)}
                        className="h-7 text-xs"
                        placeholder="Address Line 2 (Optional)"
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.district`)}
                        className="h-7 text-xs"
                        placeholder="District"
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.city`)}
                        className="h-7 text-xs"
                        placeholder="City"
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.province`)}
                        className="h-7 text-xs"
                        placeholder="Province"
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.postal_code`)}
                        className="h-7 text-xs"
                        placeholder="Postal Code"
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.country`)}
                        className="h-7 text-xs"
                        placeholder="Country"
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-1.5 text-right">
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAddress(index)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-16 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground/50 text-muted-foreground p-2">
                    <MapPin className="h-6 w-6 mb-1 opacity-20" />
                    <p className="text-xs">No addresses added</p>
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
                              city: "",
                              postal_code: "",
                              country: "",
                            },
                          })
                        }
                        className="text-primary h-auto p-0 font-normal text-xs"
                      >
                        Add address
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
