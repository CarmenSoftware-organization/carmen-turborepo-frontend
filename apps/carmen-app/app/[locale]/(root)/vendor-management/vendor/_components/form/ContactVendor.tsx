import { useTranslations } from "next-intl";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, User, Mail, Phone, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ContactVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function ContactVendor({ form, disabled }: ContactVendorProps) {
  const t = useTranslations("Vendor");

  const {
    fields: contactFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "vendor_contact.add",
  });

  const handleAddContact = () => {
    append({
      name: "",
      email: "",
      phone: "",
      is_primary: false,
    });
  };

  const handleSetPrimary = (index: number, checked: boolean) => {
    if (checked) {
      // Unset other primaries
      const currentContacts = form.getValues("vendor_contact.add") || [];
      const newContacts = currentContacts.map((c, i) => ({
        ...c,
        is_primary: i === index,
      }));
      form.setValue("vendor_contact.add", newContacts);
    } else {
      form.setValue(`vendor_contact.add.${index}.is_primary`, false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!disabled && (
          <Button
            type="button"
            size="sm"
            onClick={handleAddContact}
            className="h-8 text-xs gap-1.5"
            variant="outline"
          >
            <Plus className="h-3.5 w-3.5" />
            {t("add_contact")}
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {contactFields.length > 0 ? (
          contactFields.map((field, index) => (
            <div
              key={field.id}
              className={cn(
                "relative rounded-lg border bg-card p-4 shadow-sm transition-colors",
                form.watch(`vendor_contact.add.${index}.is_primary`) &&
                  "border-primary/50 bg-primary/5"
              )}
            >
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
                {/* Name */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {t("contact_name")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      {...form.register(`vendor_contact.add.${index}.name`)}
                      placeholder={t("contact_name")}
                      className="h-8 text-sm pl-8"
                      disabled={disabled}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {t("email")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      {...form.register(`vendor_contact.add.${index}.email`)}
                      placeholder={t("email")}
                      className="h-8 text-sm pl-8"
                      disabled={disabled}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {t("phone")}
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      {...form.register(`vendor_contact.add.${index}.phone`)}
                      placeholder={t("phone")}
                      className="h-8 text-sm pl-8"
                      disabled={disabled}
                    />
                  </div>
                </div>

                {/* Primary Checkbox */}
                <div className="flex flex-col space-y-3 pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`primary-${index}`}
                      checked={form.watch(`vendor_contact.add.${index}.is_primary`)}
                      onCheckedChange={(checked) => handleSetPrimary(index, checked as boolean)}
                      disabled={disabled}
                      className="h-4 w-4"
                    />
                    <Label
                      htmlFor={`primary-${index}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t("primary_contact")}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-10 text-muted-foreground">
            <User className="mb-2 h-10 w-10 opacity-20" />
            <p className="text-sm font-medium">{t("no_contacts")}</p>
            {!disabled && (
              <Button
                variant="link"
                onClick={handleAddContact}
                className="text-primary mt-1 h-auto p-0 font-normal text-xs"
              >
                {t("add_contact")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
