"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { MultiSelectCustom } from "@/components/ui/multi-select-custom";
import { BuTypeGetAllDto, BuTypeFormDto } from "@/dtos/bu-type.dto";
import { useBuTypeQuery, useBuTypeMutation } from "@/hooks/use-bu-type";
import { FormBusinessTypeDialog } from "@/components/shared/FormBusinessTypeDialog";
import { InputValidate } from "@/components/ui-custom/InputValidate";
import { TextareaValidate } from "@/components/ui-custom/TextareaValidate";

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

  const t = useTranslations("Vendor");

  const { buTypes } = useBuTypeQuery(token, buCode, { perpage: -1 });
  const { mutate: createBuType } = useBuTypeMutation(token, buCode);

  const BUSINESS_TYPE_OPTIONS =
    buTypes?.data?.map((item: BuTypeGetAllDto) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const [isBuTypeInternalDialogOpen, setIsBuTypeInternalDialogOpen] = useState(false);

  const isSubmitting = isCreating || isUpdating;

  const vendorFormSchema = useMemo(
    () =>
      createVendorFormSchema({
        nameRequired: t("name_required"),
        codeRequired: t("code_required"),
        contactNameRequired: t("contact_name_required"),
        emailInvalid: t("email_invalid"),
      }),
    [t]
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
          toastSuccess({ message: t("add_success") });
          queryClient.invalidateQueries({ queryKey: ["vendor", buCode] });
          const vendorId = response?.data?.id || response?.id;
          if (vendorId) {
            router.replace(`/vendor-management/vendor/${vendorId}`);
            setCurrentMode(formType.VIEW);
          }
        },
        onError: (error: Error) => {
          console.error("Error creating vendor:", error);
          toastError({ message: t("add_error") });
        },
      });
    } else if (currentMode === formType.EDIT && initData?.id) {
      const submitData = { ...data, id: initData.id };
      updateVendor(submitData, {
        onSuccess: () => {
          toastSuccess({ message: t("update_success") });
          queryClient.invalidateQueries({ queryKey: ["vendor", buCode, initData.id] });
          setCurrentMode(formType.VIEW);
        },
        onError: (error: Error) => {
          console.error("Error updating vendor:", error);
          toastError({ message: t("update_error") });
        },
      });
    }
  };

  const onEdit = () => {
    setCurrentMode(formType.EDIT);
  };

  const onCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentMode === formType.ADD) {
      router.back();
    } else {
      form.reset(initData);
      setCurrentMode(formType.VIEW);
    }
  };

  const handleCreateBuType = (data: BuTypeFormDto) => {
    createBuType(data, {
      onSuccess: () => {
        toastSuccess({ message: t("create_bu_type_success") });
        setIsBuTypeInternalDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["bu-type", buCode] });
      },
      onError: (error: Error) => {
        console.error("Error creating business type:", error);
        toastError({ message: t("create_bu_type_error") });
      },
    });
  };

  const handleBusinessTypeChange = (values: string[], onChange: (value: any) => void) => {
    const selectedTypes = values.map((val: string) => {
      const option = BUSINESS_TYPE_OPTIONS.find(
        (opt: { label: string; value: string }) => opt.value === val
      );
      return { id: val, name: option?.label || "" };
    });
    onChange(selectedTypes);
  };

  const isViewMode = currentMode === formType.VIEW;

  const watchFormValues = form.watch();

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                  <Link href={`/vendor-management/vendor`}>
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                </Button>
                <h1 className="text-lg font-semibold text-foreground">
                  {currentMode === formType.ADD
                    ? t("new_vendor")
                    : initData?.name || t("vendor_details")}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {isViewMode ? (
                  <Button type="button" size="sm" onClick={onEdit} className="h-9 text-sm">
                    {t("edit_vendor")}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onCancel}
                      type="button"
                      className="h-9 text-sm"
                    >
                      {t("cancel")}
                    </Button>
                    <Button type="submit" size="sm" disabled={isSubmitting} className="h-9 text-sm">
                      <Save className="h-4 w-4 mr-1" />
                      {isSubmitting ? t("saving") : t("save")}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
          <Card className="p-3 space-y-3">
            <h2 className="text-base font-semibold text-foreground mb-4">
              {t("general_information")}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="code"
                required
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      {t("code")}
                    </FormLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        maxLength={10}
                        disabled={isViewMode}
                        className="h-10 text-sm font-medium"
                      />
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
                  <FormItem className="space-y-1">
                    <FormLabel className="text-sm font-medium text-muted-foreground">
                      {t("name")}
                    </FormLabel>
                    <FormControl>
                      <InputValidate
                        {...field}
                        disabled={isViewMode}
                        className="h-10 text-sm font-medium"
                        maxLength={100}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="business_type"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    {t("business_type")}
                  </FormLabel>
                  <FormControl>
                    <div className="h-10">
                      <MultiSelectCustom
                        options={BUSINESS_TYPE_OPTIONS}
                        onValueChange={(values: string[]) =>
                          handleBusinessTypeChange(values, field.onChange)
                        }
                        defaultValue={field.value.map((v) => v.id)}
                        placeholder="Select types"
                        variant="inverted"
                        animation={2}
                        maxCount={2}
                        disabled={isViewMode}
                        className="text-sm"
                      >
                        <div className="border-t border-border w-full">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full text-sm justify-start h-9 text-primary hover:text-primary/80 hover:bg-transparent"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setIsBuTypeInternalDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {t("new_business_type")}
                          </Button>
                        </div>
                      </MultiSelectCustom>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-sm font-medium text-muted-foreground">
                    {t("description")}
                  </FormLabel>
                  <FormControl>
                    <TextareaValidate
                      {...field}
                      value={field.value ?? ""}
                      disabled={isViewMode}
                      maxLength={256}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </Card>
          <Card className="p-2">
            <Tabs defaultValue="info">
              <TabsList>
                <TabsTrigger value="info">{t("additional_info")}</TabsTrigger>
                <TabsTrigger value="address">{t("addresses")}</TabsTrigger>
                <TabsTrigger value="contact">{t("contact")}</TabsTrigger>
              </TabsList>

              <TabsContent value="info">
                <InfoVendor form={form} disabled={isViewMode} />
              </TabsContent>

              <TabsContent value="address">
                <AddressVendor form={form} disabled={isViewMode} />
              </TabsContent>

              <TabsContent value="contact">
                <ContactVendor form={form} disabled={isViewMode} />
              </TabsContent>
            </Tabs>
          </Card>
        </form>
      </Form>
      <FormBusinessTypeDialog
        open={isBuTypeInternalDialogOpen}
        onOpenChange={setIsBuTypeInternalDialogOpen}
        onSubmit={handleCreateBuType}
        onCancel={() => setIsBuTypeInternalDialogOpen(false)}
      />
    </div>
  );
}
