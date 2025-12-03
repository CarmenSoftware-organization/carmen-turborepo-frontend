"use client";

import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
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

interface ContactVendorProps {
  form: UseFormReturn<VendorFormValues>;
}

export default function ContactVendor({ form }: ContactVendorProps) {
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
    <div className="space-y-3">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xs font-medium text-foreground">Contact Info</h3>
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
          className="h-7 text-xs"
        >
          <Plus className="h-3 w-3" />
          Add Contact
        </Button>
      </div>

      <div className="space-y-3">
        {contactFields.map((field, contactIndex) => {
          // Get the current contact info fields from form values
          const contactInfoFields = form.watch(`vendor_contact.${contactIndex}.info`) || [];

          return (
            <div key={`contact-${contactIndex}`} className="border border-border rounded p-2">
              <div className="grid grid-cols-12 gap-2 mb-2">
                <div className="col-span-5 space-y-1">
                  <Label
                    htmlFor={`vendor_contact.${contactIndex}.contact_type`}
                    className="text-xs font-medium text-foreground"
                  >
                    Contact Type
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      form.setValue(
                        `vendor_contact.${contactIndex}.contact_type`,
                        value as z.infer<typeof contactSchema>["contact_type"]
                      )
                    }
                    defaultValue={field.contact_type}
                  >
                    <SelectTrigger
                      id={`vendor_contact.${contactIndex}.contact_type`}
                      className="h-7 text-xs"
                    >
                      <SelectValue placeholder="Select contact type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone_number" className="text-xs">
                        Phone
                      </SelectItem>
                      <SelectItem value="email_address" className="text-xs">
                        Email
                      </SelectItem>
                      <SelectItem value="website" className="text-xs">
                        Website
                      </SelectItem>
                      <SelectItem value="other" className="text-xs">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-6 space-y-1">
                  <Label
                    htmlFor={`vendor_contact.${contactIndex}.description`}
                    className="text-xs font-medium text-foreground"
                  >
                    Description
                  </Label>
                  <Input
                    id={`vendor_contact.${contactIndex}.description`}
                    {...form.register(`vendor_contact.${contactIndex}.description`)}
                    placeholder="e.g. Sales Department"
                    className="h-7 text-xs"
                  />
                </div>
                <div className="col-span-1 flex justify-end items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const currentContacts = form.getValues("vendor_contact") || [];
                      if (currentContacts.length <= 1) return;
                      const newContacts = [...currentContacts];
                      newContacts.splice(contactIndex, 1);
                      form.setValue("vendor_contact", newContacts);
                    }}
                    disabled={contactFields.length <= 1}
                    className="h-7 w-7 p-0"
                  >
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-medium text-foreground">Contact Details</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addContactInfoField(contactIndex)}
                    className="h-6 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    Add Detail
                  </Button>
                </div>

                {contactInfoFields.map((infoField, infoIndex) => (
                  <div
                    key={`contact-${contactIndex}-info-${infoIndex}`}
                    className="grid grid-cols-12 gap-2 items-center border border-border rounded p-1 bg-background"
                  >
                    <div className="col-span-4 space-y-1">
                      <Label
                        htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.label`}
                        className="text-xs font-medium text-foreground"
                      >
                        Label
                      </Label>
                      <Input
                        id={`vendor_contact.${contactIndex}.info.${infoIndex}.label`}
                        {...form.register(`vendor_contact.${contactIndex}.info.${infoIndex}.label`)}
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="col-span-5 space-y-1">
                      <Label
                        htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.value`}
                        className="text-xs font-medium text-foreground"
                      >
                        Value
                      </Label>
                      {form.watch(`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`) ===
                      "date" ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal h-7 text-xs",
                                !form.watch(
                                  `vendor_contact.${contactIndex}.info.${infoIndex}.value`
                                ) && "text-muted-foreground"
                              )}
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
                          id={`vendor_contact.${contactIndex}.info.${infoIndex}.value`}
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
                        />
                      )}
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label
                        htmlFor={`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`}
                        className="text-xs font-medium text-foreground"
                      >
                        Type
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          form.setValue(
                            `vendor_contact.${contactIndex}.info.${infoIndex}.data_type`,
                            value as z.infer<typeof infoItemSchema>["data_type"]
                          )
                        }
                        defaultValue={infoField.data_type}
                      >
                        <SelectTrigger
                          id={`vendor_contact.${contactIndex}.info.${infoIndex}.data_type`}
                          className="h-7 text-xs"
                        >
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="string" className="text-xs">
                            Text
                          </SelectItem>
                          <SelectItem value="number" className="text-xs">
                            Number
                          </SelectItem>
                          <SelectItem value="date" className="text-xs">
                            Date
                          </SelectItem>
                          <SelectItem value="datetime" className="text-xs">
                            Datetime
                          </SelectItem>
                          <SelectItem value="boolean" className="text-xs">
                            Boolean
                          </SelectItem>
                          <SelectItem value="dataset" className="text-xs">
                            Dataset
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-1 flex justify-end items-end h-full">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContactInfoField(contactIndex, infoIndex)}
                        disabled={contactInfoFields.length <= 1}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
