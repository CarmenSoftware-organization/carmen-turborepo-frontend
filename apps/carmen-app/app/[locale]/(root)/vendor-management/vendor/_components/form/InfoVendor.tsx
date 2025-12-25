"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
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
import { infoItemSchema } from "@/app/[locale]/(root)/vendor-management/vendor/_schemas/vendor-form.schema";

interface InfoVendorProps {
  form: UseFormReturn<VendorFormValues>;
  disabled?: boolean;
}

export default function InfoVendor({ form, disabled }: InfoVendorProps) {
  const {
    fields: infoFields,
    append: appendInfo,
    remove: removeInfo,
  } = useFieldArray({
    control: form.control,
    name: "info",
  });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-semibold text-foreground">Additional Info</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => appendInfo({ label: "", value: "", data_type: "string" })}
          className="h-6 text-[10px] px-2"
          disabled={disabled}
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Info
        </Button>
      </div>

      <div className="space-y-1">
        {infoFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-1 items-end border border-border/50 rounded bg-muted/10 p-1.5"
          >
            <div className="col-span-4 space-y-0.5">
              <Label
                htmlFor={`info.${index}.label`}
                className="text-[10px] uppercase font-bold text-muted-foreground"
              >
                Label
              </Label>
              <Input
                id={`info.${index}.label`}
                {...form.register(`info.${index}.label`)}
                className="h-7 text-xs bg-background"
                placeholder="Label"
                disabled={disabled}
              />
            </div>
            <div className="col-span-5 space-y-0.5">
              <Label
                htmlFor={`info.${index}.value`}
                className="text-[10px] uppercase font-bold text-muted-foreground"
              >
                Value
              </Label>
              {form.watch(`info.${index}.data_type`) === "date" ? (
                <Popover>
                  <PopoverTrigger asChild disabled={disabled}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-7 text-xs bg-background",
                        !form.watch(`info.${index}.value`) && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {(() => {
                        const value = form.watch(`info.${index}.value`);
                        return value ? format(new Date(value), "PP") : <span>Pick a date</span>;
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={(() => {
                        const value = form.watch(`info.${index}.value`);
                        return value ? new Date(value) : undefined;
                      })()}
                      onSelect={(date) =>
                        form.setValue(`info.${index}.value`, date ? date.toISOString() : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <Input
                  id={`info.${index}.value`}
                  type={form.watch(`info.${index}.data_type`) === "number" ? "number" : "text"}
                  {...form.register(`info.${index}.value`)}
                  className="h-7 text-xs bg-background"
                  placeholder="Value"
                  disabled={disabled}
                />
              )}
            </div>
            <div className="col-span-2 space-y-0.5">
              <Label
                htmlFor={`info.${index}.data_type`}
                className="text-[10px] uppercase font-bold text-muted-foreground"
              >
                Type
              </Label>
              <Select
                onValueChange={(value) =>
                  form.setValue(
                    `info.${index}.data_type`,
                    value as z.infer<typeof infoItemSchema>["data_type"]
                  )
                }
                defaultValue={field.data_type}
                disabled={disabled}
              >
                <SelectTrigger id={`info.${index}.data_type`} className="h-7 text-xs bg-background">
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
            <div className="col-span-1 flex justify-center pb-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeInfo(index)}
                disabled={disabled || infoFields.length === 1}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
