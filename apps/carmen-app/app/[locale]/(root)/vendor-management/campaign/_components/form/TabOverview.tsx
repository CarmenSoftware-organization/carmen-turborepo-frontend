import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
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
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <FormField
          control={form.control}
          name="name"
          required
          render={({ field }) => (
            <FormItem>
              <FormLabel>Campaign Name</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder="Enter campaign name" />
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
                  placeholder="Enter description"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="valid_period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid Period (days)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  disabled={isViewMode}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="Enter valid period in days"
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
              <FormLabel>Template</FormLabel>
              <FormControl>
                <Input {...field} disabled={isViewMode} placeholder="Select template" />
              </FormControl>
              <FormDescription>Template ID for this campaign</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Performance Metrics (View Only) */}
      {campaignData?.performance && isViewMode && (
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Response Rate</p>
              <p className="text-2xl font-bold">{campaignData.performance.res_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{campaignData.performance.avg_time} days</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-2xl font-bold">{campaignData.performance.comp_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Submission</p>
              <p className="text-2xl font-bold">{campaignData.performance.submission}</p>
            </div>
          </div>
        </div>
      )}

      {/* Template Information (View Only) */}
      {campaignData?.template && isViewMode && (
        <div className="border rounded-lg p-4 space-y-4">
          <h2 className="text-lg font-semibold">Template Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Template Name</p>
              <p className="font-medium">{campaignData.template.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template ID</p>
              <p className="font-medium">{campaignData.template.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created By</p>
              <p className="font-medium">{campaignData.template.created.user}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created Date</p>
              <p className="font-medium">
                {new Date(campaignData.template.created.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
