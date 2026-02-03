"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChevronLeft, Plus, Save, Building2, MapPin, Phone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useVendorMutation, useUpdateVendor } from "@/hooks/use-vendor";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { createVendorFormSchema } from "../../_schemas/vendor-form.schema";
import { useRouter } from "@/lib/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  vendor_address: { add: [] },
  vendor_contact: { add: [] },
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

  const Label = ({ children }: { children: React.ReactNode }) => (
    <FormLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
      {children}
    </FormLabel>
  );

  console.log("form err", form.formState.errors);

  console.log("watch", form.watch());

  return (
    <div className="min-h-screen bg-muted/40 pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md pb-4 pt-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="hidden h-6 w-px bg-border md:block" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {currentMode === formType.ADD
                      ? t("new_vendor")
                      : initData?.name || t("vendor_details")}
                  </h1>
                  {isViewMode && (
                    <Badge
                      variant="secondary"
                      className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 shadow-none border-0"
                    >
                      Active
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentMode === formType.ADD
                    ? "Create a new vendor profile"
                    : `Code: ${initData?.code}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isViewMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.back()}
                    className="h-8 text-xs"
                  >
                    Back
                  </Button>
                  <Button size="sm" onClick={onEdit} className="h-8 text-xs gap-1.5">
                    Edit Vendor
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    disabled={isSubmitting}
                    className="h-8 text-xs gap-1.5 min-w-[100px]"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {isSubmitting ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        {t("save")}
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Form {...form}>
          <form className="space-y-6">
            {/* General Information Card */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("general_information")}</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
                  <FormField
                    control={form.control}
                    name="code"
                    required
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <Label>{t("code")}</Label>
                        <FormControl>
                          <InputValidate
                            {...field}
                            maxLength={10}
                            disabled={isViewMode}
                            className="h-8 text-sm"
                            placeholder={t("code_placeholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="name"
                    required
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2 lg:col-span-3 space-y-1">
                        <Label>{t("name")}</Label>
                        <FormControl>
                          <InputValidate
                            {...field}
                            disabled={isViewMode}
                            className="h-8 text-sm"
                            maxLength={100}
                            placeholder={t("name_placeholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="business_type"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2 lg:col-span-2 space-y-1">
                        <Label>{t("business_type")}</Label>
                        <FormControl>
                          <div className="h-8">
                            <MultiSelectCustom
                              options={BUSINESS_TYPE_OPTIONS}
                              onValueChange={(values: string[]) =>
                                handleBusinessTypeChange(values, field.onChange)
                              }
                              defaultValue={field.value.map((v) => v.id)}
                              placeholder="Select types"
                              variant="inverted"
                              animation={2}
                              maxCount={3}
                              disabled={isViewMode}
                              className="text-sm rounded-md"
                            >
                              <div className="border-t border-border w-full">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="w-full text-xs justify-start h-8 text-primary hover:text-primary/80 hover:bg-transparent px-2"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsBuTypeInternalDialogOpen(true);
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {t("new_business_type")}
                                </Button>
                              </div>
                            </MultiSelectCustom>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2 lg:col-span-4 space-y-1">
                        <Label>{t("description")}</Label>
                        <FormControl>
                          <TextareaValidate
                            {...field}
                            value={field.value ?? ""}
                            disabled={isViewMode}
                            maxLength={256}
                            className="min-h-[80px] text-sm resize-none"
                            placeholder={t("description_placeholder")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </Card>

            {/* Additional Info Section */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("additional_info")}</h3>
                </div>
              </div>
              <div className="p-6">
                <InfoVendor form={form} disabled={isViewMode} />
              </div>
            </Card>

            {/* Address Section */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("addresses")}</h3>
                </div>
              </div>
              <div className="p-6">
                <AddressVendor form={form} disabled={isViewMode} />
              </div>
            </Card>

            {/* Contact Section */}
            <Card className="overflow-hidden border-border/60 shadow-sm">
              <div className="border-b bg-muted/40 px-6 py-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-sm">{t("contact")}</h3>
                </div>
              </div>
              <div className="p-6">
                <ContactVendor form={form} disabled={isViewMode} />
              </div>
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
    </div>
  );
}
