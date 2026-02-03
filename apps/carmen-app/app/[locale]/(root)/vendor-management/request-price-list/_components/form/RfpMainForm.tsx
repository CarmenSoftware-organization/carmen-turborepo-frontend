"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formType } from "@/dtos/form.dto";
import { RfpDetailDto } from "@/dtos/rfp.dto";
import { RfpFormValues, rfpFormSchema } from "../../_schema/rfp.schema";
import { Form } from "@/components/form-custom/form";
import { Button } from "@/components/ui/button";
import { Save, X, PenBoxIcon, ChevronLeft, FileText, Loader2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useVendor } from "@/hooks/use-vendor";
import { useCreateRfp, useUpdateRfp } from "@/hooks/use-rfp";
import { createRfp } from "../../_handlers/rfp-create.handlers";
import { updateRfp } from "../../_handlers/rfp-update.handlers";
import { transformToCreateDto, transformToUpdateDto } from "../../_helper/transform-rfp-form";
import { usePriceListTemplates } from "@/hooks/use-price-list-template";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import OverviewTab from "./OverviewTab";
import VendorsTab from "./VendorsTab";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface Props {
  readonly rfpData?: RfpDetailDto;
  readonly mode: formType;
}

export default function RfpMainForm({ rfpData, mode }: Props) {
  const router = useRouter();
  const tRfp = useTranslations("RFP");
  const { token, buCode } = useAuth();
  const { data: templates } = usePriceListTemplates(token, buCode);

  const { vendors } = useVendor(token, buCode, { perpage: -1 });

  const [currentMode, setCurrentMode] = useState<formType>(mode);

  const isViewMode = currentMode === formType.VIEW;

  const form = useForm<RfpFormValues>({
    resolver: zodResolver(rfpFormSchema),
    mode: "onChange",
    defaultValues: {
      name: rfpData?.name || "",
      status: rfpData?.status || "draft",
      start_date: rfpData?.start_date,
      end_date: rfpData?.end_date,
      custom_message: rfpData?.custom_message || "",
      pricelist_template_id: rfpData?.pricelist_template?.id || "",
      dimension: rfpData?.dimension || "",
      info: typeof rfpData?.info === "string" ? rfpData.info : JSON.stringify(rfpData?.info || {}),
      vendors: {
        add: [],
        remove: [],
      },
    },
  });

  useEffect(() => {
    if (rfpData) {
      form.reset({
        name: rfpData.name || "",
        status: rfpData.status || "draft",
        start_date: rfpData.start_date,
        end_date: rfpData.end_date,
        custom_message: rfpData.custom_message || "",
        pricelist_template_id: rfpData.pricelist_template?.id || "",
        dimension: rfpData.dimension || "",
        info: typeof rfpData.info === "string" ? rfpData.info : JSON.stringify(rfpData?.info || {}),
        vendors: {
          add: [],
          remove: [],
        },
      });
    }
  }, [rfpData, form]);

  const createMutation = useCreateRfp(token, buCode);
  const updateMutation = useUpdateRfp(token, buCode, rfpData?.id || "");

  const onSubmit = async (data: RfpFormValues) => {
    console.log(data);
    if (currentMode === formType.ADD) {
      const dto = transformToCreateDto(data, vendors?.data || []);
      await createRfp(dto, createMutation, form, data, (result) => {
        const newId = result?.data?.id || result?.id;
        if (result.success) {
          toastSuccess({
            message: tRfp("create_success"),
          });
          router.replace(`/vendor-management/request-price-list/${newId}`);
          setCurrentMode(formType.VIEW);
        } else {
          toastError({
            message: result.message,
          });
        }
      });
    } else {
      const originalVendorIds = rfpData?.vendors?.map((v) => v.vendor_id) || [];
      const dto = transformToUpdateDto(data, vendors?.data || [], originalVendorIds);
      await updateRfp(dto, updateMutation, form, (result) => {
        if (result.success) {
          toastSuccess({
            message: tRfp("update_success"),
          });
          setCurrentMode(formType.VIEW);
        } else {
          toastError({
            message: result.message,
          });
        }
      });
    }
  };

  // Determine status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
      case "submitted":
      case "submit":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "completed":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "inactive":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background/50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md pb-4 pt-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-tight text-foreground">
                    {currentMode === formType.ADD
                      ? tRfp("create_new")
                      : rfpData?.name || "RFP Details"}
                  </h1>
                  {rfpData && (
                    <Badge
                      variant="secondary"
                      className={cn("ml-2", getStatusColor(rfpData.status))}
                    >
                      {rfpData.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isViewMode ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentMode(formType.EDIT)}
                  className="h-8 gap-2"
                >
                  <PenBoxIcon className="h-4 w-4" />
                  {tRfp("edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentMode(formType.VIEW)}
                    className="h-8"
                  >
                    <X className="h-4 w-4 mr-1" />
                    {tRfp("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 gap-2 px-4 shadow-sm"
                    onClick={form.handleSubmit(onSubmit, (errors) => {
                      console.error("Form Validation Errors:", errors);
                      toastError({
                        message: `Form validation failed: ${Object.keys(errors).join(", ")}`,
                      });
                    })}
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    {tRfp("save")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Form {...form}>
          <div className="space-y-6">
            {/* Overview Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {tRfp("tab_overview")}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <OverviewTab form={form} isViewMode={isViewMode} templates={templates} />
              </CardContent>
            </Card>

            {/* Vendors Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {tRfp("tab_vendors")}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6 px-0 md:px-6">
                {/* Note: px-0 on mobile for table to reach edges if needed, but md:px-6 is standard card padding */}
                <VendorsTab
                  form={form}
                  isViewMode={isViewMode}
                  rfpData={rfpData}
                  vendors={vendors?.data || []}
                />
              </CardContent>
            </Card>
          </div>
        </Form>
      </div>
    </div>
  );
}
