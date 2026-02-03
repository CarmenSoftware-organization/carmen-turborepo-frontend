"use client";

import { Button } from "@/components/ui/button";
import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";
import { formType } from "@/dtos/form.dto";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  useCreatePriceListTemplate,
  useUpdatePriceListTemplate,
} from "@/hooks/use-price-list-template";
import { useAuth } from "@/context/AuthContext";
import OverviewTab from "./OverviewTab";
import ProductsTab from "./ProductsTab";
import RFPTabs from "./RFPTabs";
import { FormValues, FormSchema } from "../../_schema/price-list-template.schema";
import { useProductSelection } from "../../_hooks/useProductSelection";
import { ChevronLeft, FileText, Loader2, PenBoxIcon, Save, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Props {
  readonly templateData?: PriceListTemplateDetailsDto;
  readonly mode: formType;
}

export default function MainForm({ templateData, mode }: Props) {
  const router = useRouter();
  const tPlt = useTranslations("PriceListTemplate");
  const tCommon = useTranslations("Common");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, buCode } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: templateData?.name || "",
      status: templateData?.status || "draft",
      description: templateData?.description || "",
      vendor_instructions: templateData?.vendor_instructions || "",
      validity_period: templateData?.validity_period || 90,
      currency_id: templateData?.currency?.id || "",
      products: {
        add: [],
        update: [],
        remove: [],
      },
    },
  });

  const { initProducts, handleTreeProductSelect } = useProductSelection(templateData, form);

  const createMutation = useCreatePriceListTemplate(token, buCode);
  const updateMutation = useUpdatePriceListTemplate(token, buCode, templateData?.id || "");

  const onSubmit = async (data: FormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    try {
      if (isCreating) {
        await createMutation.mutateAsync({
          name: data.name,
          status: data.status,
          description: data.description,
          valid_period: data.validity_period,
          vendor_instruction: data.vendor_instructions,
          currency_id: data.currency_id,
          products: {
            add: data.products.add,
          },
        });
        toastSuccess({ message: tPlt("add_success") });
        router.push("/vendor-management/price-list-template");
      } else {
        await updateMutation.mutateAsync({
          name: data.name,
          status: data.status,
          description: data.description,
          valid_period: data.validity_period,
          vendor_instruction: data.vendor_instructions,
          currency_id: data.currency_id,
          products: {
            add: data.products.add,
            update: data.products.update,
            remove: data.products.remove,
          },
        });
        toastSuccess({ message: tPlt("edit_success") });
        setCurrentMode(formType.VIEW);
      }
    } catch (error) {
      toastError({ message: tPlt("submit_error") });
      console.error(error);
    }
  };

  const isViewMode = currentMode === formType.VIEW;

  // Determine status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
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
                onClick={() => router.push("/vendor-management/price-list-template")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-tight text-foreground">
                    {currentMode === formType.ADD && tPlt("new_template")}
                    {(currentMode === formType.VIEW || currentMode === formType.EDIT) &&
                      (templateData?.name || "Price List Template")}
                  </h1>
                  {templateData && (
                    <Badge
                      variant="secondary"
                      className={cn("ml-2", getStatusColor(templateData.status))}
                    >
                      {templateData.status}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentMode === formType.VIEW ? (
                <Button
                  size="sm"
                  onClick={() => setCurrentMode(formType.EDIT)}
                  className="h-8 gap-2"
                >
                  <PenBoxIcon className="h-4 w-4" />
                  {tCommon("edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentMode === formType.ADD) {
                        router.push("/vendor-management/price-list-template");
                      } else {
                        form.reset();
                        setCurrentMode(formType.VIEW);
                      }
                    }}
                    disabled={form.formState.isSubmitting}
                    className="h-8"
                  >
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    type="submit"
                    form="price-list-template-form"
                    size="sm"
                    disabled={form.formState.isSubmitting}
                    className="h-8 gap-2 px-4 shadow-sm"
                  >
                    {form.formState.isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    {tCommon("save")}
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
          <form
            id="price-list-template-form"
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
            {/* Overview Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {tPlt("overview")}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <OverviewTab form={form} isViewMode={isViewMode} templateData={templateData} />
              </CardContent>
            </Card>

            {/* Products Section */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                      {tPlt("product")}
                    </h2>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <ProductsTab
                  onProductSelect={handleTreeProductSelect}
                  initialProducts={initProducts}
                  isViewMode={isViewMode}
                />
              </CardContent>
            </Card>

            {/* RFPs Section */}
            {templateData && templateData.rfps && templateData.rfps.length > 0 && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold leading-none tracking-tight">
                        {tPlt("rfp")}
                      </h2>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6">
                  <RFPTabs rfps={templateData.rfps} />
                </CardContent>
              </Card>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
