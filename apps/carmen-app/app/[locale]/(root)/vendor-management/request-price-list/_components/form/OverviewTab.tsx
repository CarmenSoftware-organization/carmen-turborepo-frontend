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
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  isViewMode: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templates: any;
}

export default function OverviewTab({ form, isViewMode, templates }: Props) {
  const tRfp = useTranslations("RFP");
  const tPlt = useTranslations("PriceListTemplate");
  const endDate = form.watch("end_date");

  return (
    <div className="space-y-4">
      {/* Overview Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="pricelist_template_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tRfp("price_list_template")}</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                  disabled={isViewMode}
                >
                  <SelectTrigger>
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tRfp("rfp_name")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder={tRfp("rfp_name_placeholder")} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tRfp("status")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={isViewMode}
              >
                <FormControl>
                  <SelectTrigger>
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
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tRfp("validity_period")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isViewMode}
                    >
                      {field.value && endDate ? (
                        <>
                          {format(new Date(field.value), "LLL dd, y")} -{" "}
                          {format(new Date(endDate), "LLL dd, y")}
                        </>
                      ) : (
                        <span>{tRfp("pick_date_range")}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={field.value ? new Date(field.value) : undefined}
                    selected={{
                      from: field.value ? new Date(field.value) : undefined,
                      to: endDate ? new Date(endDate) : undefined,
                    }}
                    onSelect={(range, selectedDay) => {
                      console.log("onSelect range:", range);
                      console.log("onSelect selectedDay:", selectedDay);
                      const currentStart = form.getValues("start_date");
                      console.log("currentStart:", currentStart);

                      if (!range) {
                        if (
                          currentStart &&
                          selectedDay &&
                          isSameDay(new Date(currentStart), selectedDay)
                        ) {
                          console.log("SAME DAY DETECTED - Setting end date");
                          form.setValue("end_date", selectedDay.toISOString(), {
                            shouldDirty: true,
                          });
                        } else {
                          console.log("CLEARING DATES");
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
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="custom_message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tRfp("description")}</FormLabel>
            <FormControl>
              <Textarea {...field} disabled={isViewMode} className="resize-none" rows={3} placeholder={tRfp("description_placeholder")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
