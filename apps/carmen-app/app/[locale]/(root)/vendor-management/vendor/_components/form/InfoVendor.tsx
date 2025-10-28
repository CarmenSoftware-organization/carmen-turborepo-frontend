"use client"

import { useFieldArray, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { VendorFormValues } from "@/dtos/vendor.dto"
import { infoItemSchema } from "@/app/[locale]/(root)/vendor-management/vendor/_schemas/vendor-form.schema"
import { useTranslations } from "next-intl"

interface InfoVendorProps {
    form: UseFormReturn<VendorFormValues>
}

export default function InfoVendor({ form }: InfoVendorProps) {
    const tVendor = useTranslations('Vendor');
    const tCommon = useTranslations('Common');

    const {
        fields: infoFields,
        append: appendInfo,
        remove: removeInfo,
    } = useFieldArray({
        control: form.control,
        name: "info",
    })

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-medium text-foreground">{tVendor("additional_info")}</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => appendInfo({ label: "", value: "", data_type: "string" })}
                    className="h-7 text-xs"
                >
                    <Plus className="h-3 w-3" />
                    {tVendor("add_info")}
                </Button>
            </div>

            <div className="space-y-2">
                {infoFields.map((field, index) => (
                    <div
                        key={field.id}
                        className="grid grid-cols-12 gap-2 items-center border border-border rounded p-2"
                    >
                        <div className="col-span-4 space-y-1">
                            <Label htmlFor={`info.${index}.label`} className="text-xs font-medium text-foreground">
                                {tCommon("label")}
                            </Label>
                            <Input id={`info.${index}.label`} {...form.register(`info.${index}.label`)} className="h-7 text-xs" />
                        </div>
                        <div className="col-span-5 space-y-1">
                            <Label htmlFor={`info.${index}.value`} className="text-xs font-medium text-foreground">
                                {tCommon("value")}
                            </Label>
                            {form.watch(`info.${index}.data_type`) === "date" ? (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal h-7 text-xs",
                                                !form.watch(`info.${index}.value`) && "text-muted-foreground",
                                            )}
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
                                            selected={
                                                (() => {
                                                    const value = form.watch(`info.${index}.value`);
                                                    return value ? new Date(value) : undefined;
                                                })()
                                            }
                                            onSelect={(date) => form.setValue(`info.${index}.value`, date ? date.toISOString() : "")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            ) : (
                                <Input
                                    id={`info.${index}.value`}
                                    type={form.watch(`info.${index}.data_type`) === "number" ? "number" : "text"}
                                    {...form.register(`info.${index}.value`)}
                                    className="h-7 text-xs"
                                />
                            )}
                        </div>
                        <div className="col-span-2 space-y-1">
                            <Label htmlFor={`info.${index}.data_type`} className="text-xs font-medium text-foreground">
                                {tCommon("data_type")}
                            </Label>
                            <Select
                                onValueChange={(value) => form.setValue(`info.${index}.data_type`, value as z.infer<typeof infoItemSchema>["data_type"])}
                                defaultValue={field.data_type}
                            >
                                <SelectTrigger id={`info.${index}.data_type`} className="h-7 text-xs">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="string" className="text-xs">
                                        {tCommon("text")}
                                    </SelectItem>
                                    <SelectItem value="number" className="text-xs">
                                        {tCommon("number")}
                                    </SelectItem>
                                    <SelectItem value="date" className="text-xs">
                                        {tCommon("date")}
                                    </SelectItem>
                                    <SelectItem value="datetime" className="text-xs">
                                        {tCommon("datetime")}
                                    </SelectItem>
                                    <SelectItem value="boolean" className="text-xs">
                                        {tCommon("boolean")}
                                    </SelectItem>
                                    <SelectItem value="dataset" className="text-xs">
                                        {tCommon("dataset")}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-1 flex justify-end items-end h-full">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeInfo(index)}
                                disabled={infoFields.length === 1}
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
    )
}