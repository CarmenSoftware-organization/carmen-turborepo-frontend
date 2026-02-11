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
import { useBuConfig } from "@/context/BuConfigContext";
import OverviewTab from "./OverviewTab";
import ProductsTab from "./ProductsTab";
import RFPTabs from "./RFPTabs";
import { FormValues, FormSchema } from "../../_schema/price-list-template.schema";
import { useProductSelection } from "../../_hooks/useProductSelection";
import { ChevronLeft, Loader2, PenBoxIcon, Save, Trash2 } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { Badge } from "@/components/ui/badge";

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
  const { currencyBase } = useBuConfig();

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

  console.log("templateData", templateData);

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

  return (
    <div className="flex flex-col min-h-screen p-3 pb-10">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="container">
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
                    <Badge variant={templateData.status} className="font-bold">
                      {templateData.status.toLocaleUpperCase()}
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
                  >
                    {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                    {tCommon("save")}
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 />
                    {tCommon("delete")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form
          id="price-list-template-form"
          onSubmit={(e) => {
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <div className="my-4">
            <OverviewTab form={form} isViewMode={isViewMode} currencyBase={currencyBase ?? ""} />
          </div>
          <ProductsTab
            onProductSelect={handleTreeProductSelect}
            initialProducts={initProducts}
            isViewMode={isViewMode}
          />
          {templateData && templateData.rfps && templateData.rfps.length > 0 && (
            <RFPTabs rfps={templateData.rfps} />
          )}
        </form>
      </Form>
    </div>
  );
}
