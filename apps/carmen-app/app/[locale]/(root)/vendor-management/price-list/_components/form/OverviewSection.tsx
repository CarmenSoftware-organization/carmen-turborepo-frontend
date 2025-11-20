"use client";

import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { PriceListFormData } from "../../_schema/price-list.schema";
import type { PriceListDetailDto } from "../../_dto/price-list-dto";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";

interface OverviewSectionProps {
  form: UseFormReturn<PriceListFormData>;
  priceList?: PriceListDetailDto;
  isViewMode: boolean;
}

export default function OverviewSection({ form, priceList, isViewMode }: OverviewSectionProps) {
  const tCommon = useTranslations("Common");
  const tStatus = useTranslations("Status");
  const tPriceList = useTranslations("PriceList");

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
        {tPriceList("overview")}
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Price List No */}
        <FormField
          control={form.control}
          name="no"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPriceList("no")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder={tPriceList("enter_no")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tCommon("status")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                <FormControl>
                  <SelectTrigger>
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

        {/* Vendor */}
        <FormField
          control={form.control}
          name="vendorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPriceList("vendor")}</FormLabel>
              <FormControl>
                {isViewMode ? (
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {priceList?.vendor?.name || "-"}
                  </div>
                ) : (
                  <Input {...field} disabled placeholder={tPriceList("select_vendor")} />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPriceList("currency")}</FormLabel>
              <FormControl>
                {isViewMode ? (
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {priceList?.currency?.code || "-"}
                  </div>
                ) : (
                  // <Input {...field} disabled placeholder={tPriceList("select_currency")} />
                  <CurrencyLookup onValueChange={field.onChange} value={field.value} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* RFP */}
        <FormField
          control={form.control}
          name="rfpId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tPriceList("rfp")}</FormLabel>
              <FormControl>
                {isViewMode ? (
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                    {priceList?.rfp?.name || "-"}
                  </div>
                ) : (
                  <Input {...field} disabled placeholder={tPriceList("select_rfp")} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Effective Period */}
        <FormField
          control={form.control}
          name="effectivePeriod"
          render={({ field }) => {
            const dateRange = field.value?.from && field.value?.to
              ? { from: new Date(field.value.from), to: new Date(field.value.to) }
              : undefined;

            return (
              <FormItem>
                <FormLabel>{tPriceList("effective_period")}</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={isViewMode}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !dateRange && "text-muted-foreground"
                        )}
                      >
                        {dateRange ? (
                          <>
                            {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                          </>
                        ) : (
                          <span>{tPriceList("enter_effective_period")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tCommon("description")}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                disabled={isViewMode}
                placeholder={tPriceList("enter_description")}
                rows={3}
                className="resize-none"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Currency Details - View Only */}
      {isViewMode && priceList && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tPriceList("currency_details")}
          </h2>
          <div className="bg-muted/30 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tPriceList("currency_code")}</p>
                <p className="text-sm font-medium">{priceList.currency?.code || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tPriceList("active_status")}</p>
                <p className="text-sm font-medium">
                  {priceList.isActive ? tCommon("yes") : tCommon("no")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
