import { useTranslations } from "next-intl";

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
  const t = useTranslations("Vendor");
  const {
    fields: infoFields,
    append: appendInfo,
    remove: removeInfo,
  } = useFieldArray({
    control: form.control,
    name: "info",
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => appendInfo({ label: "", value: "", data_type: "string" })}
            className="h-8 text-xs gap-1.5"
            disabled={disabled}
          >
            <Plus className="h-3.5 w-3.5" />
            {t("add_info")}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {infoFields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-12 gap-3 items-end border border-border/40 rounded-md bg-muted/5 p-3"
          >
            <div className="col-span-12 md:col-span-4 space-y-1">
              <Label
                htmlFor={`info.${index}.label`}
                className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground"
              >
                {t("label")}
              </Label>
              <Input
                id={`info.${index}.label`}
                {...form.register(`info.${index}.label`)}
                className="h-8 text-sm bg-background"
                placeholder={t("label")}
                disabled={disabled}
              />
            </div>
            <div className="col-span-12 md:col-span-5 space-y-1">
              <Label
                htmlFor={`info.${index}.value`}
                className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground"
              >
                {t("value")}
              </Label>
              {form.watch(`info.${index}.data_type`) === "date" ? (
                <Popover>
                  <PopoverTrigger asChild disabled={disabled}>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-8 text-sm bg-background",
                        !form.watch(`info.${index}.value`) && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                      {(() => {
                        const value = form.watch(`info.${index}.value`);
                        return value ? (
                          format(new Date(value), "PP")
                        ) : (
                          <span>{t("pick_date")}</span>
                        );
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
                  className="h-8 text-sm bg-background"
                  placeholder={t("value")}
                  disabled={disabled}
                />
              )}
            </div>
            <div className="col-span-10 md:col-span-2 space-y-1">
              <Label
                htmlFor={`info.${index}.data_type`}
                className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground"
              >
                {t("type")}
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
                <SelectTrigger id={`info.${index}.data_type`} className="h-8 text-sm bg-background">
                  <SelectValue placeholder={t("type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string" className="text-xs">
                    {t("text")}
                  </SelectItem>
                  <SelectItem value="number" className="text-xs">
                    {t("number")}
                  </SelectItem>
                  <SelectItem value="date" className="text-xs">
                    {t("date")}
                  </SelectItem>
                  <SelectItem value="datetime" className="text-xs">
                    {t("datetime")}
                  </SelectItem>
                  <SelectItem value="boolean" className="text-xs">
                    {t("boolean")}
                  </SelectItem>
                  <SelectItem value="dataset" className="text-xs">
                    {t("dataset")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 md:col-span-1 flex justify-center pb-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeInfo(index)}
                disabled={disabled}
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">{t("delete")}</span>
              </Button>
            </div>
          </div>
        ))}
        {infoFields.length === 0 && (
          <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
            {t("no_additional_info_added")}
          </div>
        )}
      </div>
    </div>
  );
}
