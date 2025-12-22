"use client";

import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { createVendorFormSchema } from "../../_schemas/vendor-form.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/form-custom/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LookupBuType from "@/components/lookup/LookupBuType";

interface MainVendorFormProps {
  readonly mode: formType;
  readonly initData?: VendorFormValues;
}

const defaultValues: VendorFormValues = {
  id: "",
  name: "",
  code: "",
  description: "",
  note: "",
  business_type: [],
  info: [],
  vendor_address: [],
  vendor_contact: [],
};

export default function MainVendorForm({ mode, initData }: MainVendorFormProps) {
  const { token, buCode } = useAuth();
  const [currentMode, setCurrentMode] = useState<formType>(mode);

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
    console.log(data);
  };

  const isDirty = form.formState;
  console.log("isDirty", isDirty);

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* <pre>{JSON.stringify(initData, null, 2)}</pre> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Vendor name" {...field} />
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
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input placeholder="Vendor code" {...field} />
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
                  <Textarea placeholder="Vendor description" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea placeholder="Vendor note" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="business_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Type</FormLabel>
                <FormControl>
                  <LookupBuType {...field} onValueChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
