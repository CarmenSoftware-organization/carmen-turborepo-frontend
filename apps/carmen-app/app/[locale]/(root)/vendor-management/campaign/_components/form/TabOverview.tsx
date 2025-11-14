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
import { CampaignDetailDto } from "@/dtos/campaign.dto";

interface TabOverviewProps {
  form: UseFormReturn<any>;
  isViewMode: boolean;
  campaignData?: CampaignDetailDto;
}

export default function TabOverview({ form, isViewMode, campaignData }: TabOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Performance Metrics - View Only */}
      {campaignData?.performance && isViewMode && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Performance Metrics
          </h2>
          <div className="grid gap-3 md:grid-cols-4">
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Response Rate</p>
              <p className="text-2xl font-bold">{campaignData.performance.res_rate}%</p>
              <p className="text-xs text-muted-foreground">
                {campaignData.performance.submission} submissions
              </p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Avg Response Time</p>
              <p className="text-2xl font-bold">{campaignData.performance.avg_time}</p>
              <p className="text-xs text-muted-foreground">days to respond</p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Completion Rate</p>
              <p className="text-2xl font-bold">{campaignData.performance.comp_rate}%</p>
              <p className="text-xs text-muted-foreground">of total vendors</p>
            </div>
            <div className="bg-muted/30 p-4 space-y-2">
              <p className="text-xs text-muted-foreground uppercase">Total Submissions</p>
              <p className="text-2xl font-bold">{campaignData.performance.submission}</p>
              <p className="text-xs text-muted-foreground">completed / total</p>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Campaign Information
        </h2>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isViewMode}
                      placeholder="e.g., Q1 2025 Beverage Price Request"
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
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isViewMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="submit">Submit</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
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
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isViewMode}
                    placeholder="Provide a detailed description of this campaign..."
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
              name="valid_period"
              required
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Period (days)</FormLabel>
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

            <FormField
              control={form.control}
              name="template_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template ID</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isViewMode} placeholder="Enter template ID" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Template Information (View Only) */}
      {campaignData?.template && isViewMode && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Template Information
          </h2>
          <div className="bg-muted/30 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Template Name</p>
                <p className="text-sm font-medium">{campaignData.template.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Template ID</p>
                <p className="font-mono text-sm">{campaignData.template.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created By</p>
                <p className="text-sm">{campaignData.template.created.user}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Created Date</p>
                <p className="text-sm">
                  {new Date(campaignData.template.created.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
