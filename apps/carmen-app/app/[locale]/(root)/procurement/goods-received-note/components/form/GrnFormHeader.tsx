"use client";

import { Control, useWatch } from "react-hook-form";
import {
  FileText,
  Store,
  Coins,
  FileType,
  GitBranch,
  Clock,
  CreditCard,
  AlignLeft,
  MessageSquare,
  CalendarIcon,
  DollarSign,
} from "lucide-react";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formType } from "@/dtos/form.dto";
import { CreateGRNDto } from "@/dtos/grn.dto";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useVendor } from "@/hooks/useVendor";
import { useCurrency } from "@/hooks/useCurrency";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { DOC_TYPE } from "@/constants/enum";
import { useCreditTermQuery } from "@/hooks/useCreditTerm";
import CreditTermLookup from "@/components/lookup/CreditTermLookup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";

interface GrnFormHeaderProps {
  readonly control: Control<CreateGRNDto>;
  readonly mode: formType;
  readonly token: string;
  readonly tenantId: string;
}

export default function GrnFormHeader({
  control,
  mode,
  token,
  tenantId,
}: GrnFormHeaderProps) {
  const { getVendorName } = useVendor();
  const { getCurrencyCode } = useCurrency();
  const { getCreditTermName } = useCreditTermQuery(token, tenantId);

  const isTypeBlank =
    new URLSearchParams(window.location.search).get("type") === "blank";

  const { getCurrencyExchangeRate } = useCurrency();
  const currencyId = useWatch({
    control,
    name: "currency_id",
  });

  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GRN Number */}

        <FormField
          control={control}
          name="grn_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  GRN Number
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value}
                  disabled={mode === formType.ADD}
                  className={`${mode === formType.ADD ? "bg-muted" : ""}`}
                  placeholder="GRN Number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="received_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs bg-muted",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-2 text-left font-normal text-xs bg-background",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Select date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString() : new Date().toISOString()
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </FormItem>
          )}
        />

        {/* Vendor ID */}
        <FormField
          control={control}
          name="vendor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Vendor
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">
                  {getVendorName(field.value)}
                </p>
              ) : (
                <FormControl>
                  <VendorLookup
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="doc_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FileType className="h-4 w-4" />
                  Document Type
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">{field.value}</p>
              ) : (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isTypeBlank}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={DOC_TYPE.MANUAL}>Manual</SelectItem>
                    <SelectItem value={DOC_TYPE.PURCHASE_ORDER}>
                      Purchase Order
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Currency ID */}
        <FormField
          control={control}
          name="currency_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Currency
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">
                  {getCurrencyCode(field.value)}
                </p>
              ) : (
                <FormControl>
                  <CurrencyLookup
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Exchange Rate
            </div>
          </Label>
          <Input value={getCurrencyExchangeRate(currencyId)} disabled />
        </div>

        <FormField
          control={control}
          name="invoice_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4" />
                  Invoice No.
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">{field.value}</p>
              ) : (
                <FormControl>
                  <Input {...field} />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoice_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Invoice Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs bg-muted",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span className="text-muted-foreground">Select date</span>
                  )}
                  <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                </Button>
              ) : (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-2 text-left font-normal text-xs bg-background",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Select date
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(
                          date ? date.toISOString() : new Date().toISOString()
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="credit_term_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Credit Term
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <p className="text-xs text-muted-foreground">
                  {getCreditTermName(field.value)}
                </p>
              ) : (
                <FormControl>
                  <CreditTermLookup
                    onValueChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <AlignLeft className="h-4 w-4" />
                Description
              </div>
            </FormLabel>
            {mode === formType.VIEW ? (
              <p className="text-xs text-muted-foreground">{field.value}</p>
            ) : (
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Note */}
      <FormField
        control={control}
        name="note"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Note
              </div>
            </FormLabel>
            {mode === formType.VIEW ? (
              <p className="text-xs text-muted-foreground">{field.value}</p>
            ) : (
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
      </div>

      

      <div className="mt-6 flex flex-col gap-4">
        <FormLabel className="text-sm font-medium">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment Methods
          </div>
        </FormLabel>
        <div className="flex flex-row gap-8">
          <FormField
            control={control}
            name="is_consignment"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  Consignment
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked: boolean | "indeterminate") => {
                      field.onChange(!!checked);
                    }}
                    disabled={mode === formType.VIEW}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_cash"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  Cash
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked: boolean | "indeterminate") => {
                      field.onChange(!!checked);
                    }}
                    disabled={mode === formType.VIEW}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3">
                <FormLabel className="cursor-pointer text-sm font-medium">
                  Active
                </FormLabel>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked: boolean | "indeterminate") => {
                      field.onChange(!!checked);
                    }}
                    disabled={mode === formType.VIEW}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
