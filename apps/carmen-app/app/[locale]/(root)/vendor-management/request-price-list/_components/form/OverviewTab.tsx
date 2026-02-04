import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { formatDate } from "@/utils/format/date";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isViewMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templates: any;
  dateFormat: string;
}

export default function OverviewTab({ form, isViewMode, templates, dateFormat }: Props) {
  const tRfp = useTranslations("RFP");
  const tPlt = useTranslations("PriceListTemplate");
  const endDate = form.watch("end_date");

  const Label = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Info */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">{tRfp("tab_overview")}</h3>
        </div>

        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2 space-y-1">
                <Label>{tRfp("rfp_name")}</Label>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isViewMode}
                    placeholder={tRfp("rfp_name_placeholder")}
                    className="h-8 text-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tRfp("status")}</Label>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isViewMode}
                >
                  <FormControl>
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder={tRfp("select_status")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">{tRfp("status_draft")}</SelectItem>
                    <SelectItem value="active">{tRfp("status_active")}</SelectItem>
                    <SelectItem value="submit">{tRfp("status_submit")}</SelectItem>
                    <SelectItem value="completed">{tRfp("status_completed")}</SelectItem>
                    <SelectItem value="inactive">{tRfp("status_inactive")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pricelist_template_id"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Label>{tRfp("price_list_template")}</Label>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                    disabled={isViewMode}
                  >
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue placeholder={tPlt("select_template")} />
                    </SelectTrigger>
                    <SelectContent>
                      {templates?.data?.map((template: any) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem className="space-y-1 col-span-2">
                <Label>{tRfp("validity_period")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-8 text-xs",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isViewMode}
                      >
                        {field.value && endDate ? (
                          <>
                            <span>{formatDate(field.value, dateFormat || "yyyy-MM-dd")}</span>
                            {"-"}
                            <span>{formatDate(endDate, dateFormat || "yyyy-MM-dd")}</span>
                          </>
                        ) : (
                          <span>{tRfp("pick_date_range")}</span>
                        )}
                        <CalendarIcon className="ml-auto h-3 w-3 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={field.value ? new Date(field.value) : undefined}
                      selected={{
                        from: field.value ? new Date(field.value) : undefined,
                        to: endDate ? new Date(endDate) : undefined,
                      }}
                      onSelect={(range, selectedDay) => {
                        const currentStart = form.getValues("start_date");

                        if (!range) {
                          if (
                            currentStart &&
                            selectedDay &&
                            isSameDay(new Date(currentStart), selectedDay)
                          ) {
                            form.setValue("end_date", selectedDay.toISOString(), {
                              shouldDirty: true,
                            });
                          } else {
                            form.setValue("start_date", "", { shouldDirty: true });
                            form.setValue("end_date", "", { shouldDirty: true });
                          }
                          return;
                        }

                        if (range.from) {
                          form.setValue("start_date", range.from.toISOString(), {
                            shouldDirty: true,
                          });
                        } else {
                          form.setValue("start_date", "", { shouldDirty: true });
                        }

                        if (range.to) {
                          form.setValue("end_date", range.to.toISOString(), {
                            shouldDirty: true,
                          });
                        } else {
                          form.setValue("end_date", "", { shouldDirty: true });
                        }
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
                {form.formState.errors.end_date && (
                  <p className="text-[0.8rem] font-medium text-destructive">
                    {form.formState.errors.end_date.message as string}
                  </p>
                )}
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-foreground">Details</h3>
        <FormField
          control={form.control}
          name="custom_message"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <Label>{tRfp("description")}</Label>
              <FormControl>
                <Textarea
                  {...field}
                  disabled={isViewMode}
                  className="resize-none text-xs"
                  placeholder={tRfp("description_placeholder")}
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
