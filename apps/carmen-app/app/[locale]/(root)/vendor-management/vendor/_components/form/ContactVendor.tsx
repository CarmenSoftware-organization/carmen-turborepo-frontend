"use client";

import { UseFormReturn } from "react-hook-form";
import { Plus, Trash2, Phone, Mail, User, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContactVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function ContactVendor({ form, disabled }: ContactVendorProps) {
  // Get contact fields from form
  const contactFields = form.watch("vendor_contact") || [];

  const handleAddContact = () => {
    const currentContacts = form.getValues("vendor_contact") || [];
    form.setValue("vendor_contact", [
      ...currentContacts,
      {
        name: "",
        email: "",
        phone: "",
        is_primary: false,
      },
    ]);
  };

  const handleRemoveContact = (index: number) => {
    const currentContacts = form.getValues("vendor_contact") || [];
    const newContacts = [...currentContacts];
    newContacts.splice(index, 1);
    form.setValue("vendor_contact", newContacts);
  };

  const handleSetPrimary = (index: number, checked: boolean) => {
    if (checked) {
      // Unset other primaries if we set this one (assuming single primary)
      // Or just set this one true. Based on payload user provided, multiple might not be expected but let's assume one primary.
      // Actually payload example didn't show multiple primaries, but let's be safe and unset others.
      const currentContacts = form.getValues("vendor_contact") || [];
      const newContacts = currentContacts.map((c, i) => ({
        ...c,
        is_primary: i === index,
      }));
      form.setValue("vendor_contact", newContacts);
    } else {
      form.setValue(`vendor_contact.${index}.is_primary`, false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-foreground">Contact List</h3>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddContact}
            className="h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Contact
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactFields.map((field, index) => (
          <Card key={`contact-${index}`} className="p-4 space-y-4 relative group">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-full">
                  <User className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Contact #{index + 1}</Label>
                  {field.is_primary && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1 ml-2">
                      Primary
                    </Badge>
                  )}
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveContact(index)}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...form.register(`vendor_contact.${index}.name`)}
                  placeholder="Contact Name"
                  className="h-8 text-sm font-medium"
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </Label>
                  <Input
                    {...form.register(`vendor_contact.${index}.email`)}
                    placeholder="email@example.com"
                    className="h-8 text-sm"
                    disabled={disabled}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone
                  </Label>
                  <Input
                    {...form.register(`vendor_contact.${index}.phone`)}
                    placeholder="Phone Number"
                    className="h-8 text-sm"
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2 border-t mt-2">
                <Checkbox
                  id={`primary-${index}`}
                  checked={field.is_primary}
                  onCheckedChange={(checked) => handleSetPrimary(index, checked as boolean)}
                  disabled={disabled}
                />
                <Label
                  htmlFor={`primary-${index}`}
                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
                >
                  <Star
                    className={
                      form.watch(`vendor_contact.${index}.is_primary`)
                        ? "fill-yellow-400 text-yellow-400 h-3 w-3"
                        : "h-3 w-3"
                    }
                  />
                  Set as Primary Contact
                </Label>
              </div>
            </div>
          </Card>
        ))}

        {contactFields.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
            <User className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No contacts added yet</p>
            {!disabled && (
              <Button variant="link" onClick={handleAddContact} className="text-primary">
                Add your first contact
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
