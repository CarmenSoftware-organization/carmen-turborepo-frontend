import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";
import LookupCluster from "@/components/lookup/LookupCluster";
import type { RegisterBuFormData } from "../../_schema/register-bu.schema";

export default function StepBu() {
  const { control } = useFormContext<RegisterBuFormData>();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="cluster_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Cluster</FormLabel>
            <FormControl>
              <LookupCluster value={field.value} onValueChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="code"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter business unit code" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel required>Business Unit Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter business unit name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="is_hq"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Headquarters</FormLabel>
              <FormDescription>Mark this business unit as headquarters</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active Status</FormLabel>
              <FormDescription>Enable or disable this business unit</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
