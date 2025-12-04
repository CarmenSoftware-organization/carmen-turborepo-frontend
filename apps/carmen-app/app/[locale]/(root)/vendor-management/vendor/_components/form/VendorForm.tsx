"use client";

import { useEffect, useState, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useVendorMutation, useUpdateVendor } from "@/hooks/use-vendor";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { createVendorFormSchema } from "../../_schemas/vendor-form.schema";
import { useRouter, Link } from "@/lib/navigation";
import { Card } from "@/components/ui/card";
import InfoVendor from "./InfoVendor";
import AddressVendor from "./AddressVendor";
import ContactVendor from "./ContactVendor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { MultiSelect } from "@/components/ui/multi-select";
import { useBuTypeQuery } from "@/app/[locale]/(root)/configuration/business-type/_hooks/use-bu-type";
import { BuTypeGetAllDto } from "@/dtos/bu-type.dto";

const defaultValues: VendorFormValues = {
  id: "",
  name: "",
  code: "",
  description: "",
  business_type: [],
  info: [],
  vendor_address: [],
  vendor_contact: [],
};

interface VendorFormProps {
  readonly mode: formType;
  readonly initData?: VendorFormValues;
}

export default function VendorForm({ mode, initData }: VendorFormProps) {
  const { token, buCode } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createVendor, isPending: isCreating } = useVendorMutation(token, buCode);
  const { mutate: updateVendor, isPending: isUpdating } = useUpdateVendor(
    token,
    buCode,
    initData?.id ?? ""
  );

  const { buTypes } = useBuTypeQuery(token, buCode);

  const BUSINESS_TYPE_OPTIONS =
    buTypes?.data?.map((item: BuTypeGetAllDto) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const isSubmitting = isCreating || isUpdating;

  const vendorFormSchema = useMemo(
    () =>
      createVendorFormSchema({
        nameRequired: "Vendor name is required",
        codeRequired: "Code is required",
      }),
    []
  );

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: currentMode === formType.ADD ? defaultValues : initData,
  });

  useEffect(() => {
    if (initData && currentMode === formType.EDIT) {
      form.reset(initData);
    }
  }, [form, initData, currentMode]);

  const onSubmit = (data: VendorFormValues) => {
    if (currentMode === formType.ADD) {
      createVendor(data, {
        onSuccess: (response: any) => {
          toastSuccess({ message: "Vendor added successfully" });
          queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
          const vendorId = response?.data?.id || response?.id;
          if (vendorId) {
            router.replace(`/vendor-management/vendor/${vendorId}`);
            setCurrentMode(formType.VIEW);
          }
        },
        onError: (error: Error) => {
          console.error("Error creating vendor:", error);
          toastError({ message: "Failed to add vendor" });
        },
      });
    } else if (currentMode === formType.EDIT && initData?.id) {
      const submitData = { ...data, id: initData.id };
      updateVendor(submitData, {
        onSuccess: () => {
          toastSuccess({ message: "Vendor updated successfully" });
          queryClient.invalidateQueries({ queryKey: ["vendor", buCode, initData.id] });
          setCurrentMode(formType.VIEW);
        },
        onError: (error: Error) => {
          console.error("Error updating vendor:", error);
          toastError({ message: "Failed to update vendor" });
        },
      });
    }
  };

  const onCancel = () => {
    if (currentMode === formType.ADD) {
      router.back();
    } else {
      setCurrentMode(formType.VIEW);
    }
  };

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0" asChild>
                <Link href={`/vendor-management/vendor`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              </Button>
              <h1 className="text-lg font-medium text-foreground">
                {mode === formType.ADD ? "Add Vendor" : "Edit Vendor"}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onCancel}>
                <X />
              </Button>
              <Button type="submit" size={"sm"} disabled={isSubmitting}>
                <Save />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-4">
            <FormField
              control={form.control}
              name="code"
              required
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel className="text-xs font-medium">Code</FormLabel>
                  <FormControl>
                    <Input {...field} maxLength={4} disabled={mode === formType.VIEW} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              required
              render={({ field }) => (
                <FormItem className="col-span-5">
                  <FormLabel className="text-xs font-medium">Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={mode === formType.VIEW} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem className="col-span-4">
                  <FormLabel className="text-xs font-medium">Business Type</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={BUSINESS_TYPE_OPTIONS}
                      onValueChange={(values: string[]) => {
                        const selectedTypes = values.map((val: string) => {
                          const option = BUSINESS_TYPE_OPTIONS.find(
                            (opt: { label: string; value: string }) => opt.value === val
                          );
                          return { id: val, name: option?.label || "" };
                        });
                        field.onChange(selectedTypes);
                      }}
                      defaultValue={field.value.map((v) => v.id)}
                      placeholder="Select business types"
                      variant="inverted"
                      animation={2}
                      maxCount={3}
                      disabled={mode === formType.VIEW}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-12">
                  <FormLabel className="text-xs font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="min-h-[80px]"
                      disabled={mode === formType.VIEW}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-9 rounded-none">
              <TabsTrigger value="info" className="text-xs">
                Info
              </TabsTrigger>
              <TabsTrigger value="address" className="text-xs">
                Address
              </TabsTrigger>
              <TabsTrigger value="contact" className="text-xs">
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="p-3 space-y-3">
              <InfoVendor form={form} disabled={mode === formType.VIEW} />
            </TabsContent>

            <TabsContent value="address" className="p-3 space-y-3">
              <AddressVendor form={form} disabled={mode === formType.VIEW} />
            </TabsContent>

            <TabsContent value="contact" className="p-3 space-y-3">
              <ContactVendor form={form} disabled={mode === formType.VIEW} />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </Card>
  );
}
