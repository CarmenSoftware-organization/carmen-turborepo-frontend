"use client";

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
import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import LookupCluster from "@/components/lookup/LookupCluster";
import { useCreateBu, useUpdateBu } from "@/app/hooks/useBu";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const businessUnitSchema = z.object({
  cluster_id: z.string().min(1, "Cluster is required"),
  code: z.string().min(3, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  is_hq: z.boolean(),
  is_active: z.boolean(),
});

type BusinessUnitFormData = z.infer<typeof businessUnitSchema>;

interface BuFormProps {
  businessData?: IBuDto;
  mode: "add" | "edit" | "view";
}

export default function BuForm({ businessData, mode }: BuFormProps) {
  const router = useRouter();
  const [currentMode, setCurrentMode] = useState<"add" | "edit" | "view">(mode);
  const [savedData, setSavedData] = useState<IBuDto | undefined>(businessData);
  const createBu = useCreateBu();
  const updateBu = useUpdateBu();

  const form = useForm<BusinessUnitFormData>({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      cluster_id: businessData?.cluster_id || "",
      code: businessData?.code || "",
      name: businessData?.name || "",
      description: businessData?.description || "",
      is_hq: businessData?.is_hq ?? false,
      is_active: businessData?.is_active ?? true,
    },
  });

  const onSubmit = async (data: BusinessUnitFormData) => {
    try {
      if (currentMode === "edit" && savedData?.id) {
        const response = await updateBu.mutateAsync({ id: savedData.id, payload: data });
        toast.success("Business unit updated successfully!");
        setSavedData(response);
        form.reset(data);
        setCurrentMode("view");
      } else {
        const response = await createBu.mutateAsync(data);
        toast.success("Business unit created successfully!");
        setSavedData(response);
        form.reset(data);
        setCurrentMode("view");
      }
    } catch (error) {
      console.error("Error saving business unit:", error);
      toast.error("Failed to save business unit");
    }
  };

  const getSubmitButtonText = () => {
    if (form.formState.isSubmitting) return "Saving...";
    return currentMode === "add" ? "Create" : "Update";
  };

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <div className="space-y-4">
        <Button size="sm" onClick={() => router.push("/business")} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Business Units
        </Button>

        {currentMode !== "add" && (
          <div className="flex justify-end">
            <Button size={"sm"} onClick={() => setCurrentMode("edit")}>
              Edit
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cluster_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Cluster</FormLabel>
                  <FormControl>
                    <LookupCluster
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={currentMode === "view"}
                    />
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
                  <FormLabel required>Business Unit Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business unit name"
                      {...field}
                      disabled={currentMode === "view"}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter business unit code"
                      {...field}
                      disabled={currentMode === "view"}
                    />
                  </FormControl>
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
                      placeholder="Enter business unit description"
                      {...field}
                      disabled={currentMode === "view"}
                    />
                  </FormControl>
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
                      disabled={currentMode === "view"}
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
                      disabled={currentMode === "view"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {currentMode !== "view" && (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/business")}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {getSubmitButtonText()}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
