import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formType } from "@/dtos/form.dto";
import {
  Hash,
  CalendarIcon,
  FileText,
  Store,
  DollarSign,
  Quote,
} from "lucide-react";
import { Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { CreditNoteFormDto } from "../../dto/cdn.dto";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { CREDIT_NOTE_TYPE } from "@/constants/enum";
import VendorLookup from "@/components/lookup/VendorLookup";
import { useVendor } from "@/hooks/useVendor";
import CurrencyLookup from "@/components/lookup/CurrencyLookup";
import { useCurrency } from "@/hooks/useCurrency";
import GrnLookup from "@/components/lookup/GrnLookup";
import CnReasonLookup from "@/components/lookup/CnReasonLookup";
import { useGrn } from "@/hooks/useGrn";

interface HeadCnFormProps {
  readonly control: Control<CreditNoteFormDto>;
  readonly mode: formType;
  readonly cnNo?: string;
  readonly getCnReasonName: (id: string) => string | null;
}

export default function HeadCnForm({ control, mode, cnNo, getCnReasonName }: HeadCnFormProps) {
  const { getVendorName } = useVendor();
  const { getCurrencyCode, getCurrencyExchangeRate } = useCurrency();
  const currencyId = useWatch({
    control,
    name: "currency_id",
  });

  const { getGrnNo } = useGrn();
  

  return (
    <div className="space-y-4 my-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 p-1 space-y-2">
        {mode !== formType.ADD && (
          <div className="col-span-1 mt-2">
            <Label className="text-xs font-medium">
              <div className="flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Credit Note
              </div>
            </Label>
            <Input value={cnNo} disabled className="mt-2 text-xs bg-muted" />
          </div>
        )}

        <FormField
          control={control}
          name="cn_date"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs mt-1 bg-muted",
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
                          "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
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
          name="credit_note_type"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Type
                </div>
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={mode === formType.VIEW}
                >
                  <SelectTrigger
                    className={cn(
                      "text-xs mt-1",
                      mode === formType.VIEW && "bg-muted"
                    )}
                  >
                    <SelectValue placeholder="Select credit note type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CREDIT_NOTE_TYPE.QUANTITY_RETURN}>
                      Quantity Return
                    </SelectItem>
                    <SelectItem value={CREDIT_NOTE_TYPE.AMOUNT_DISCOUNT}>
                      Amount Discount
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="vendor_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Vendor
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input
                  value={getVendorName(field.value ?? "")}
                  disabled
                  className="bg-muted"
                />
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
          name="currency_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Currency
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Input
                  value={getCurrencyCode(field.value ?? "")}
                  disabled
                  className="bg-muted"
                />
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
          <Label className="text-xs font-medium">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Exchange Rate
            </div>
          </Label>
          <Input
            value={getCurrencyExchangeRate(currencyId ?? "")}
            disabled
            className="bg-muted"
          />
        </div>

        <FormField
          control={control}
          name="grn_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  GRN No.
                </div>
              </FormLabel>
              <FormControl>
                {mode === formType.VIEW ? (
                  <Input
                    value={getGrnNo(field.value ?? "")}
                    disabled
                    className="bg-muted"
                    placeholder="Select GRN"
                  />
                ) : (
                  <GrnLookup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="grn_date"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  GRN Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs mt-1 bg-muted",
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
                          "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
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
          name="cn_reason_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <Quote className="h-3 w-3" />
                  Reason
                </div>
              </FormLabel>
              <FormControl>
                {mode === formType.VIEW ? (
                  <Input
                    value={getCnReasonName(field.value ?? "") ?? ""}
                    disabled
                    className="bg-muted"
                    placeholder="Select reason"
                  />
                ) : (
                  <CnReasonLookup
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoice_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Invoice No.
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "text-xs",
                    mode === formType.VIEW && "bg-muted"
                  )}
                  placeholder="Enter invoice number..."
                  disabled={mode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="invoice_date"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Invoice Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs mt-1 bg-muted",
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
                          "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
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
          name="tax_invoice_no"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Tax Invoice No.
                </div>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "text-xs",
                    mode === formType.VIEW && "bg-muted"
                  )}
                  placeholder="Enter tax invoice number..."
                  disabled={mode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="tax_invoice_date"
          render={({ field }) => (
            <FormItem className="col-span-1">
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Tax Invoice Date
                </div>
              </FormLabel>
              {mode === formType.VIEW ? (
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-2 text-left font-normal text-xs mt-1 bg-muted",
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
                          "w-full pl-2 text-left font-normal text-xs bg-background mt-1",
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Description
                </div>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "mt-1 min-h-[56px] resize-none text-xs",
                    mode === formType.VIEW && "bg-muted text-muted-foreground"
                  )}
                  placeholder="Enter description..."
                  disabled={mode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                <div className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  Note
                </div>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  className={cn(
                    "mt-1 min-h-[56px] resize-none text-xs",
                    mode === formType.VIEW && "bg-muted text-muted-foreground"
                  )}
                  placeholder="Enter note..."
                  disabled={mode === formType.VIEW}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
