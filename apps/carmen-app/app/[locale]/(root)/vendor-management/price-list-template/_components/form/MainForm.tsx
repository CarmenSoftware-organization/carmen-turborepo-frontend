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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import OverviewTab from "./OverviewTab";
import ProductsTab from "./ProductsTab";
import RFPTabs from "./RFPTabs";
import { FormValues, FormSchema } from "../../_schema/price-list-template.schema";
import { useProductSelection } from "../../_hooks/useProductSelection";
import { ChevronLeft, Loader2, PenBoxIcon, Plus, Save, X } from "lucide-react";
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

  return (
    <div className="flex flex-col p-4 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/vendor-management/price-list-template")}
            variant={"outlinePrimary"}
            size={"icon"}
            className="h-8 w-8 hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {currentMode === formType.ADD && tPlt("new_template")}
              {(currentMode === formType.VIEW || currentMode === formType.EDIT) &&
                templateData?.name}
            </h1>
            {templateData && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={templateData.status} className="px-2 py-0.5 font-medium">
                  {templateData.status}
                </Badge>
                <span>•</span>
                <span>
                  {tPlt("last_update")}: {new Date(templateData.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW && (
            <Button size="sm" onClick={() => setCurrentMode(formType.EDIT)}>
              <PenBoxIcon className="h-4 w-4" />
              {tCommon("edit")}
            </Button>
          )}
          {currentMode === formType.EDIT && (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  form.reset();
                  setCurrentMode(formType.VIEW);
                }}
                disabled={form.formState.isSubmitting}
              >
                <X className="h-4 w-4" />
                {tCommon("cancel")}
              </Button>
              <Button
                type="submit"
                form="price-list-template-form"
                size="sm"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {tCommon("save")}
              </Button>
            </>
          )}
          {currentMode === formType.ADD && (
            <Button
              type="submit"
              form="price-list-template-form"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {tCommon("save")}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <Form {...form}>
          <form id="price-list-template-form" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="overview" className="flex flex-col">
              <div className="border-b border-border/40 mb-6">
                <TabsList className="bg-transparent p-0 h-auto gap-6">
                  <TabsTrigger value="overview">{tPlt("overview")}</TabsTrigger>
                  <TabsTrigger value="products">{tPlt("product")}</TabsTrigger>
                  {templateData && <TabsTrigger value="rfps">{tPlt("rfp")}</TabsTrigger>}
                </TabsList>
              </div>
              <div className="flex-1 overflow-y-auto min-h-[500px]">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab form={form} isViewMode={isViewMode} templateData={templateData} />
                </TabsContent>
                <TabsContent value="products" className="mt-0">
                  <ProductsTab
                    onProductSelect={handleTreeProductSelect}
                    initialProducts={initProducts}
                    isViewMode={isViewMode}
                  />
                </TabsContent>
                {templateData && (
                  <TabsContent value="rfps" className="mt-0">
                    <RFPTabs rfps={templateData.rfps || []} />
                  </TabsContent>
                )}
              </div>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
