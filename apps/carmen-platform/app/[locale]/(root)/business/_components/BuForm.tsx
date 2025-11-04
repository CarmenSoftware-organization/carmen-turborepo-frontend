"use client";

import { useCluster } from "@/app/hooks/useCluster";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ControllerRenderProps } from "react-hook-form";
import type { GetClusterDto } from "@/dto/cluster.dto";

const businessUnitSchema = z.object({
  cluster_id: z.string().min(1, "Cluster is required"),
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  is_hq: z.boolean(),
  is_active: z.boolean(),
});

type BusinessUnitFormData = z.infer<typeof businessUnitSchema>;

interface BuFormProps {
  businessData?: IBuDto;
  mode: "add" | "edit" | "view";
}

export default function BuForm({ businessData, mode = "edit" }: BuFormProps) {
  const { data: clusterData } = useCluster();
  const router = useRouter();

  const form = useForm<BusinessUnitFormData>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      cluster_id: businessData?.cluster_id || "",
      code: businessData?.code || "",
      name: businessData?.name || "",
      is_hq: businessData?.is_hq ?? false,
      is_active: businessData?.is_active ?? true,
    },
  });

  const clusters = clusterData?.data || [];

  const onSubmit = async (data: BusinessUnitFormData) => {
    try {
      console.log("Form data:", data);
      // TODO: Add API call here
      // if (mode === "edit" && businessData?.id) {
      //   await updateBusinessUnit({ id: businessData.id, payload: data });
      // } else {
      //   await createBusinessUnit(data);
      // }
      router.push("/business");
    } catch (error) {
      console.error("Error saving business unit:", error);
    }
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/business")} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Business Units
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === "add"
              ? "Add New Business Unit"
              : mode === "edit"
                ? "Edit Business Unit"
                : "View Business Unit"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "add"
              ? "Create a new business unit with the required information"
              : mode === "edit"
                ? "Update business unit information"
                : "View business unit details"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Unit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business unit name"
                      {...field}
                      disabled={mode === "view"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Code Field */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business unit code"
                      {...field}
                      disabled={mode === "view"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cluster Field */}
            <FormField
              control={form.control}
              name="cluster_id"
              render={({
                field,
              }: {
                field: ControllerRenderProps<BusinessUnitFormData, "cluster_id">;
              }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Cluster</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={mode === "view"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cluster" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clusters.map((cluster: GetClusterDto) => (
                        <SelectItem key={cluster.id} value={cluster.id}>
                          {cluster.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Is Headquarters Switch */}
            <FormField
              control={form.control}
              name="is_hq"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Headquarters</FormLabel>
                    <FormDescription>Mark this business unit as headquarters</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mode === "view"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Is Active Switch */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>Enable or disable this business unit</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={mode === "view"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            {mode !== "view" && (
              <div className="flex gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/business")}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  <Save className="h-4 w-4 mr-2" />
                  {form.formState.isSubmitting ? "Saving..." : mode === "add" ? "Create" : "Update"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
