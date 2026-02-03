import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray, Controller } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import { FormControl } from "@/components/form-custom/form";

interface AddressVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function AddressVendor({ form, disabled }: AddressVendorProps) {
  const t = useTranslations("Vendor");

  const {
    fields: addressFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "vendor_address.add",
  });

  const handleAddAddress = () => {
    append({
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
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!disabled && (
          <Button
            type="button"
            size="sm"
            onClick={handleAddAddress}
            className="h-8 text-xs gap-1.5"
            variant="outline"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("add_address")}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {addressFields.length > 0 ? (
          addressFields.map((field, index) => (
            <div key={field.id} className="relative rounded-lg border bg-card p-4 shadow-sm">
              {!disabled && (
                <div className="absolute right-2 top-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
                {/* Address Type */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 space-y-1">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {t("address_type")}
                  </Label>
                  <Controller
                    control={form.control}
                    name={`vendor_address.add.${index}.address_type`}
                    render={({ field: selectField }) => (
                      <Select
                        onValueChange={selectField.onChange}
                        defaultValue={selectField.value}
                        disabled={disabled}
                      >
                        <FormControl>
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder={t("select_type")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mailing_address">{t("mailing_address")}</SelectItem>
                          <SelectItem value="billing_address">{t("billing_address")}</SelectItem>
                          <SelectItem value="shipping_address">{t("shipping_address")}</SelectItem>
                          <SelectItem value="contact_address">{t("contact_address")}</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Address Content - Grouped for better visual flow */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {/* Address Line 1 */}
                  <div className="col-span-full space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("address")} <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        {...form.register(`vendor_address.add.${index}.data.address_line1`)}
                        placeholder={t("address_line1")}
                        className="h-8 text-sm pl-8"
                        disabled={disabled}
                      />
                    </div>
                    <div className="mt-1">
                      <Input
                        {...form.register(`vendor_address.add.${index}.data.address_line2`)}
                        placeholder={t("address_line2")}
                        className="h-8 text-sm pl-8"
                        disabled={disabled}
                      />
                    </div>
                  </div>

                  {/* Locality / District */}
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("locality")}
                    </Label>
                    <Input
                      {...form.register(`vendor_address.add.${index}.data.district`)}
                      placeholder={t("district")}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("city")}
                    </Label>
                    <Input
                      {...form.register(`vendor_address.add.${index}.data.city`)}
                      placeholder={t("city")}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>

                  {/* Province */}
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("province")}
                    </Label>
                    <Input
                      {...form.register(`vendor_address.add.${index}.data.province`)}
                      placeholder={t("province")}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>

                  {/* Postal Code */}
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("zip_code")}
                    </Label>
                    <Input
                      {...form.register(`vendor_address.add.${index}.data.postal_code`)}
                      placeholder={t("zip_code")}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>

                  {/* Country */}
                  <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                      {t("country")}
                    </Label>
                    <Input
                      {...form.register(`vendor_address.add.${index}.data.country`)}
                      placeholder={t("country")}
                      className="h-8 text-sm"
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-muted-foreground">
            <MapPin className="mb-2 h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">{t("no_addresses")}</p>
            {!disabled && (
              <Button
                variant="link"
                onClick={handleAddAddress}
                className="text-primary mt-1 h-auto p-0 font-normal text-xs"
              >
                {t("add_address")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
