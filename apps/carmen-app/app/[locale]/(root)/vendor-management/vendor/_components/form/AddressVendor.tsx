import { useTranslations } from "next-intl";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AddressVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function AddressVendor({ form, disabled }: AddressVendorProps) {
  const t = useTranslations("Vendor");

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
        <h3 className="text-sm font-semibold">{t("addresses")}</h3>
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
            className="h-9 text-xs px-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("add_address")}
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">{t("address_type")}</TableHead>
              <TableHead className="min-w-[250px]">{t("address")}</TableHead>
              <TableHead className="w-[200px]">{t("locality")}</TableHead>
              <TableHead className="w-[180px]">{t("region")}</TableHead>
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
                      <SelectTrigger className="h-9 text-xs w-full">
                        <SelectValue placeholder={t("select_type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mailing_address">{t("mailing_address")}</SelectItem>
                        <SelectItem value="billing_address">{t("billing_address")}</SelectItem>
                        <SelectItem value="shipping_address">{t("shipping_address")}</SelectItem>
                        <SelectItem value="contact_address">{t("contact_address")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.address_line1`)}
                        className="h-9 text-xs"
                        placeholder={t("address_line1")}
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.address_line2`)}
                        className="h-9 text-xs"
                        placeholder={t("address_line2")}
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.district`)}
                        className="h-9 text-xs"
                        placeholder={t("district")}
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.city`)}
                        className="h-9 text-xs"
                        placeholder={t("city")}
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.province`)}
                        className="h-9 text-xs"
                        placeholder={t("province")}
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="align-top py-1.5">
                    <div className="space-y-1.5">
                      <Input
                        {...form.register(`vendor_address.${index}.data.postal_code`)}
                        className="h-9 text-xs"
                        placeholder={t("zip_code")}
                        disabled={disabled}
                      />
                      <Input
                        {...form.register(`vendor_address.${index}.data.country`)}
                        className="h-9 text-xs"
                        placeholder={t("country")}
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
                    <p className="text-xs">{t("no_addresses")}</p>
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
                        {t("add_address")}
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
