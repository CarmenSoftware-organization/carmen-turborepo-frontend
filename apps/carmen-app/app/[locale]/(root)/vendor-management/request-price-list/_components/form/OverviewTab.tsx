import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import LookupPrt from "@/components/lookup/LookupPrt";
import { useTranslations } from "next-intl";

interface Props {
  // @ts-ignore
  form: UseFormReturn<any>;
  isViewMode: boolean;
  rfpData?: RfpDetailDto;
}

export default function OverviewTab({ form, isViewMode, rfpData }: Props) {
  const tRfp = useTranslations("RFP");

  return (
    <div className="space-y-8 mt-4">
      {/* Performance Metrics - View Only */}
      {rfpData?.performance && isViewMode && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("performance_metrics")}
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">{tRfp("response_rate")}</p>
              <p className="text-2xl font-bold">{rfpData.performance.res_rate}%</p>
              <p className="text-xs text-muted-foreground">
                {rfpData.performance.submission} {tRfp("submissions")}
              </p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">{tRfp("avg_response_time")}</p>
              <p className="text-2xl font-bold">{rfpData.performance.avg_time}</p>
              <p className="text-xs text-muted-foreground">{tRfp("days_to_respond")}</p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">{tRfp("completion_rate")}</p>
              <p className="text-2xl font-bold">{rfpData.performance.comp_rate}%</p>
              <p className="text-xs text-muted-foreground">{tRfp("of_total_vendors")}</p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">{tRfp("total_submissions")}</p>
              <p className="text-2xl font-bold">{rfpData.performance.submission}</p>
              <p className="text-xs text-muted-foreground">{tRfp("completed_total")}</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          {tRfp("rfp_information")}
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRfp("rfp_name")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isViewMode}
                      placeholder={tRfp("rfp_name_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="valid_period"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRfp("valid_period_days")}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      disabled={isViewMode}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      placeholder="90"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{tRfp("description")}</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder={tRfp("description_placeholder")}
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="status"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRfp("status")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
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
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tRfp("price_list_template")}</FormLabel>
                  <FormControl>
                    <LookupPrt {...field} disabled={isViewMode} onValueChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Template Information (View Only) */}
      {rfpData?.template && isViewMode && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {tRfp("template_information")}
          </h2>
          <div className="bg-muted/30 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tRfp("template_name")}</p>
                <p className="text-sm font-medium">{rfpData.template.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tRfp("created_by")}</p>
                <p className="text-sm">{rfpData.template.created.user}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{tRfp("created_date")}</p>
                <p className="text-sm">
                  {new Date(rfpData.template.created.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}