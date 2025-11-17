"use client";

import { Button } from "@/components/ui/button";
import { PriceListTemplateDetailsDto } from "@/dtos/price-list-template.dto";
import { formType } from "@/dtos/form.dto";
import { useState, useMemo, useCallback, useRef } from "react";
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
import {
  priceListTemplateFormSchema,
  PriceListTemplateFormValues,
} from "../../_schema/price-list-template.schema";
import { ChevronLeft, PenBoxIcon, Plus, Save, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

interface Props {
  readonly templateData?: PriceListTemplateDetailsDto;
  readonly mode: formType;
}

export default function MainForm({ templateData, mode }: Props) {
  const router = useRouter();
  const tPlt = useTranslations("PriceListTemplate");
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const { token, buCode } = useAuth();

  const form = useForm<PriceListTemplateFormValues>({
    resolver: zodResolver(priceListTemplateFormSchema),
    defaultValues: {
      name: templateData?.name || "",
      status: templateData?.status || "draft",
      description: templateData?.description || "",
      valid_period: templateData?.valid_period || 90,
      currency_id: templateData?.currency?.id || "",
      products: {
        add: [],
        remove: [],
      },
    },
  });

  const initProducts = useMemo(() => {
    return (
      templateData?.products?.map((product) => ({
        key: product.id,
        title: product.name,
      })) || []
    );
  }, [templateData?.products]);

  const initProductKeys = useMemo(() => {
    return initProducts.map((product) => product.key);
  }, [initProducts]);

  const createMutation = useCreatePriceListTemplate(token, buCode);
  const updateMutation = useUpdatePriceListTemplate(token, buCode, templateData?.id || "");

  const previousProductIdsRef = useRef<string>("");

  const handleTreeProductSelect = useCallback(
    (productIds: { id: string }[]) => {
      const currentProductIds = initProductKeys.map((key) => key.toString());
      const newProductIds = productIds.map((p) => p.id);

      // Create a string representation for comparison
      const newIdsString = newProductIds.sort().join(",");

      if (newIdsString === previousProductIdsRef.current) {
        return;
      }

      previousProductIdsRef.current = newIdsString;

      const toAdd = newProductIds
        .filter((id) => !currentProductIds.includes(id))
        .map((id) => ({ id }));
      const toRemove = currentProductIds
        .filter((id) => !newProductIds.includes(id))
        .map((id) => ({ id }));

      // Only update if there are actual changes
      if (toAdd.length > 0 || toRemove.length > 0) {
        form.setValue("products", {
          add: toAdd,
          remove: toRemove,
        });
      }
    },
    [initProductKeys, form]
  );

  const onSubmit = async (data: PriceListTemplateFormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    try {
      if (isCreating) {
        await createMutation.mutateAsync(data);
        toastSuccess({ message: tPlt("add_success") });
        router.push("/vendor-management/price-list-template");
      } else {
        await updateMutation.mutateAsync(data);
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
    <div className="flex flex-col p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/vendor-management/price-list-template")}
            variant={"outlinePrimary"}
            size={"sm"}
            className="h-8 w-8"
          >
            <ChevronLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {currentMode === formType.ADD && tPlt("new_template")}
              {(currentMode === formType.VIEW || currentMode === formType.EDIT) &&
                templateData?.name}
            </h1>
            {templateData && (
              <p className="text-sm text-muted-foreground">
                {tPlt("last_update")}: {new Date(templateData.update_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW && (
            <Button size="sm" onClick={() => setCurrentMode(formType.EDIT)}>
              <PenBoxIcon />
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
              >
                <X />
              </Button>
              <Button type="submit" form="price-list-template-form" size="sm">
                <Save />
              </Button>
            </>
          )}
          {currentMode === formType.ADD && (
            <Button type="submit" form="price-list-template-form">
              <Plus />
            </Button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <Form {...form}>
          <form id="price-list-template-form" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="overview" className="flex flex-col">
              <TabsList>
                <TabsTrigger value="overview">{tPlt("overview")}</TabsTrigger>
                <TabsTrigger value="products">{tPlt("product")}</TabsTrigger>
                {templateData && <TabsTrigger value="rfps">{tPlt("rfp")}</TabsTrigger>}
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="mt-0">
                  <OverviewTab form={form} isViewMode={isViewMode} templateData={templateData} />
                </TabsContent>
                <TabsContent value="products" className="mt-0">
                  <ProductsTab
                    onProductSelect={handleTreeProductSelect}
                    products={templateData?.products}
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
