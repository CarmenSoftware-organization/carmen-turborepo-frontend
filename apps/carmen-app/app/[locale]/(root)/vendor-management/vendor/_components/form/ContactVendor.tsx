"use client";

import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Plus, Trash2, User, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface ContactVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function ContactVendor({ form, disabled }: ContactVendorProps) {
  // Get contact fields from form using useFieldArray for better perf and management
  const {
    fields: contactFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "vendor_contact",
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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold">Contact List</h3>
        {!disabled && (
          <Button
            type="button"
            size="sm"
            onClick={handleAddContact}
            className="h-6 text-[10px] px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Contact
          </Button>
        )}
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[50px] text-center">#</TableHead>
              <TableHead className="min-w-[200px]">Name</TableHead>
              <TableHead className="min-w-[200px]">Email</TableHead>
              <TableHead className="min-w-[150px]">Phone</TableHead>
              <TableHead className="w-[80px] text-center">Primary</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactFields.length > 0 ? (
              contactFields.map((field, index) => (
                <TableRow key={field.id} className="hover:bg-muted/5">
                  <TableCell className="text-center text-xs text-muted-foreground py-1.5">
                    {index + 1}
                  </TableCell>
                  <TableCell className="py-1.5">
                    <Input
                      {...form.register(`vendor_contact.${index}.name`)}
                      placeholder="Contact Name"
                      className="h-7 text-xs font-medium"
                      disabled={disabled}
                    />
                  </TableCell>
                  <TableCell className="py-1.5">
                    <div className="relative">
                      <Mail className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                      <Input
                        {...form.register(`vendor_contact.${index}.email`)}
                        placeholder="Email"
                        className="h-7 text-xs pl-7"
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-1.5">
                    <div className="relative">
                      <Phone className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
                      <Input
                        {...form.register(`vendor_contact.${index}.phone`)}
                        placeholder="Phone"
                        className="h-7 text-xs pl-7"
                        disabled={disabled}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-center py-1.5">
                    <div className="flex justify-center">
                      <Checkbox
                        id={`primary-${index}`}
                        checked={form.watch(`vendor_contact.${index}.is_primary`)}
                        onCheckedChange={(checked) => handleSetPrimary(index, checked as boolean)}
                        disabled={disabled}
                        className="h-4 w-4"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-1.5">
                    {!disabled && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
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
                <TableCell colSpan={6} className="h-16 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground/50 text-muted-foreground p-2">
                    <User className="h-6 w-6 mb-1 opacity-20" />
                    <p className="text-xs">No contacts added</p>
                    {!disabled && (
                      <Button
                        variant="link"
                        onClick={handleAddContact}
                        className="text-primary h-auto p-0 font-normal text-xs"
                      >
                        Add contact
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
