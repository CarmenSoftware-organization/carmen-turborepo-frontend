"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PriceListFormData } from "../../_schema/price-list.schema";
import LookupCurrency from "@/components/lookup/LookupCurrency";
import VendorLookup from "@/components/lookup/LookupVendor";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/utils/format/date";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";

interface OverviewSectionProps {
  form: UseFormReturn<PriceListFormData>;
  priceList?: {
    vendor?: { name: string };
    currency?: { name: string };
  };
  isViewMode: boolean;
  defaultCurrency: string;
  dateFormat: string;
}

export default function OverviewSection({
  form,
  priceList,
  isViewMode,
  defaultCurrency,
  dateFormat,
}: OverviewSectionProps) {
  const tCommon = useTranslations("Common");
  const tStatus = useTranslations("Status");
  const tPriceList = useTranslations("PriceList");

  const Label = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            {tPriceList("basic_information")}
          </h3>
        </div>
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
          {isViewMode && (
            <FormField
              control={form.control}
              name="no"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Label>{tPriceList("no")}</Label>
                  <FormControl>
                    <Input {...field} disabled className="h-8 bg-muted/50 text-xs" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            required
            render={({ field }) => (
              <FormItem className="col-span-2 space-y-1">
                <Label>{tPriceList("pl_name")}</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={tPriceList("enter_pl_name")}
                    className="h-8 text-sm"
                    disabled={isViewMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            required
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tCommon("status")}</Label>
                <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                  <FormControl>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={tCommon("select_status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">{tStatus("draft")}</SelectItem>
                    <SelectItem value="submit">{tStatus("submit")}</SelectItem>
                    <SelectItem value="active">{tStatus("active")}</SelectItem>
                    <SelectItem value="inactive">{tStatus("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {tPriceList("vendor_section")}
        </h3>
        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="vendorId"
            required
            render={({ field }) => (
              <FormItem className="space-y-1 col-span-2">
                <Label>{tPriceList("vendor")}</Label>
                <FormControl>
                  {isViewMode ? (
                    <Input
                      disabled
                      className="h-8 bg-muted/50 text-xs"
                      value={priceList?.vendor?.name || "-"}
                    />
                  ) : (
                    <VendorLookup
                      onValueChange={field.onChange}
                      value={field.value}
                      classNames="h-8 text-xs"
                      initialDisplayName={priceList?.vendor?.name}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Currency */}
          <FormField
            control={form.control}
            name="currencyId"
            required
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tPriceList("currency")}</Label>
                <FormControl>
                  {isViewMode ? (
                    <Input
                      disabled
                      className="h-7 bg-muted/50 text-sm"
                      value={priceList?.currency?.name || "-"}
                    />
                  ) : (
                    <LookupCurrency
                      onValueChange={field.onChange}
                      value={field.value || defaultCurrency}
                      classNames="h-8 text-xs"
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <FormField
            control={form.control}
            name="effectivePeriod"
            required
            render={({ field }) => {
              const dateRange =
                field.value?.from && field.value?.to
                  ? { from: new Date(field.value.from), to: new Date(field.value.to) }
                  : undefined;

              return (
                <FormItem className="space-y-1 col-span-2">
                  <Label>{tPriceList("effective_period")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          disabled={isViewMode}
                          className={cn(
                            "h-8 w-full pl-3 text-left font-normal text-sm",
                            !dateRange && "text-muted-foreground"
                          )}
                        >
                          {dateRange ? (
                            <>
                              <span>{formatDate(dateRange.from, dateFormat || "yyyy-MM-dd")}</span>
                              {"-"}
                              <span>{formatDate(dateRange.to, dateFormat || "yyyy-MM-dd")}</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground/40">
                              {tPriceList("enter_effective_period")}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          if (range?.from && range?.to) {
                            field.onChange({
                              from: format(range.from, "yyyy-MM-dd"),
                              to: format(range.to, "yyyy-MM-dd"),
                            });
                          } else if (range?.from) {
                            field.onChange({
                              from: format(range.from, "yyyy-MM-dd"),
                              to: format(range.from, "yyyy-MM-dd"),
                            });
                          }
                        }}
                        disabled={isViewMode}
                        initialFocus
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="rfpId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tPriceList("rfp")}</Label>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={tPriceList("select_rfp")}
                    className="h-8 text-sm"
                    disabled={isViewMode}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">
          {tPriceList("additional_details")}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tCommon("description")}</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPriceList("enter_description")}
                    rows={2}
                    className="min-h-[60px] resize-none text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Note */}
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tCommon("note")}</Label>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tPriceList("enter_note")}
                    rows={2}
                    className="min-h-[60px] resize-none text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
