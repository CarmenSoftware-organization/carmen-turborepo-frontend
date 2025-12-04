"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2, Phone, Mail, Globe, HelpCircle } from "lucide-react";
import { format } from "date-fns";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { VendorFormValues } from "@/dtos/vendor.dto";
import {
  infoItemSchema,
  contactSchema,
} from "@/app/[locale]/(root)/vendor-management/vendor/_schemas/vendor-form.schema";
import { Card } from "@/components/ui/card";

interface ContactVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

const getContactIcon = (type: string) => {
  switch (type) {
    case "phone_number":
      return <Phone className="h-4 w-4" />;
    case "email_address":
      return <Mail className="h-4 w-4" />;
    case "website":
      return <Globe className="h-4 w-4" />;
    default:
      return <HelpCircle className="h-4 w-4" />;
  }
};

export default function ContactVendor({ form, disabled }: ContactVendorProps) {
  // Helper function to add contact info field
  const addContactInfoField = (contactIndex: number) => {
    const currentInfo = form.getValues(`vendor_contact.${contactIndex}.info`) || [];
    form.setValue(`vendor_contact.${contactIndex}.info`, [
      ...currentInfo,
      { label: "", value: "", data_type: "string" },
    ]);
  };

  // Helper function to remove contact info field
  const removeContactInfoField = (contactIndex: number, infoIndex: number) => {
    const currentInfo = form.getValues(`vendor_contact.${contactIndex}.info`) || [];
    if (currentInfo.length <= 1) return;

    const newInfo = [...currentInfo];
    newInfo.splice(infoIndex, 1);
    form.setValue(`vendor_contact.${contactIndex}.info`, newInfo);
  };

  // Get contact fields from form
  const contactFields = form.watch("vendor_contact") || [];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-foreground">Contact List</h3>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const currentContacts = form.getValues("vendor_contact") || [];
              form.setValue("vendor_contact", [
                ...currentContacts,
                {
                  contact_type: "phone_number",
                  description: "",
                  info: [{ label: "Contact", value: "", data_type: "string" }],
                },
              ]);
            }}
            className="h-8 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Contact
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contactFields.map((field, contactIndex) => {
          // Get the current contact info fields from form values
          const contactInfoFields = form.watch(`vendor_contact.${contactIndex}.info`) || [];

          return (
            <Card key={`contact-${contactIndex}`} className="p-4 space-y-4 relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-muted rounded-full">
                    {getContactIcon(
                      form.watch(`vendor_contact.${contactIndex}.contact_type`) || "other"
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Type</Label>
                    <Select
                      onValueChange={(value) =>
                        form.setValue(
                          `vendor_contact.${contactIndex}.contact_type`,
                          value as z.infer<typeof contactSchema>["contact_type"]
                        )
                      }
                      defaultValue={field.contact_type}
                      disabled={disabled}
                    >
                      <SelectTrigger
                        id={`vendor_contact.${contactIndex}.contact_type`}
                        className="h-7 w-[140px] text-xs border-none shadow-none p-0 h-auto font-semibold focus:ring-0"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone_number">Phone</SelectItem>
                        <SelectItem value="email_address">Email</SelectItem>
                        <SelectItem value="website">Website</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {!disabled && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const currentContacts = form.getValues("vendor_contact") || [];
                      if (currentContacts.length <= 1) return;
                      const newContacts = [...currentContacts];
                      newContacts.splice(contactIndex, 1);
                      form.setValue("vendor_contact", newContacts);
                    }}
                    className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-1">
                <Label className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">
                  Description
                </Label>
                <Input
                  id={`vendor_contact.${contactIndex}.description`}
                  {...form.register(`vendor_contact.${contactIndex}.description`)}
                  placeholder="e.g. Sales Department"
                  className="h-8 text-sm"
                  disabled={disabled}
                />
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-medium text-muted-foreground">Details</h4>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => addContactInfoField(contactIndex)}
                      className="h-6 text-[10px] px-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Detail
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  {contactInfoFields.map((infoField, infoIndex) => (
                    <div
                      key={`contact-${contactIndex}-info-${infoIndex}`}
                      className="grid grid-cols-12 gap-2 items-start"
                    >
                      <div className="col-span-4">
                        <Input
                          {...form.register(
                            `vendor_contact.${contactIndex}.info.${infoIndex}.label`
                          )}
                          className="h-7 text-xs"
                          placeholder="Label"
                          disabled={disabled}
                        />
                      </div>
                      <div className="col-span-7">
                        {form.watch(
                          `vendor_contact.${contactIndex}.info.${infoIndex}.data_type`
                        ) === "date" ? (
                          <Popover>
                            <PopoverTrigger asChild disabled={disabled}>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal h-7 text-xs",
                                  !form.watch(
                                    `vendor_contact.${contactIndex}.info.${infoIndex}.value`
                                  ) && "text-muted-foreground"
                                )}
                                disabled={disabled}
                              >
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {(() => {
                                  const value = form.watch(
                                    `vendor_contact.${contactIndex}.info.${infoIndex}.value`
                                  );
                                  return value ? (
                                    format(new Date(value), "PP")
                                  ) : (
                                    <span>Pick a date</span>
                                  );
                                })()}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={(() => {
                                  const value = form.watch(
                                    `vendor_contact.${contactIndex}.info.${infoIndex}.value`
                                  );
                                  return value ? new Date(value) : undefined;
                                })()}
                                onSelect={(date) =>
                                  form.setValue(
                                    `vendor_contact.${contactIndex}.info.${infoIndex}.value`,
                                    date ? date.toISOString() : ""
                                  )
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        ) : (
                          <Input
                            type={
                              form.watch(
                                `vendor_contact.${contactIndex}.info.${infoIndex}.data_type`
                              ) === "number"
                                ? "number"
                                : "text"
                            }
                            {...form.register(
                              `vendor_contact.${contactIndex}.info.${infoIndex}.value`
                            )}
                            className="h-7 text-xs"
                            placeholder="Value"
                            disabled={disabled}
                          />
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        {!disabled && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeContactInfoField(contactIndex, infoIndex)}
                            disabled={contactInfoFields.length <= 1}
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
        {contactFields.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground bg-muted/20">
            <Phone className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No contacts added yet</p>
            {!disabled && (
              <Button
                variant="link"
                onClick={() => {
                  const currentContacts = form.getValues("vendor_contact") || [];
                  form.setValue("vendor_contact", [
                    ...currentContacts,
                    {
                      contact_type: "phone_number",
                      description: "",
                      info: [{ label: "Contact", value: "", data_type: "string" }],
                    },
                  ]);
                }}
                className="text-primary"
              >
                Add your first contact
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
