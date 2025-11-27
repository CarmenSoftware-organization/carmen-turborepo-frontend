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
  CreatePriceTemplateRequestSchema,
  UpdatePriceTemplateRequestSchema,
  PriceTemplateStatusEnum,
} from "../../_schema/price-list-template.schema";
import { ChevronLeft, Loader2, PenBoxIcon, Plus, Save, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { z } from "zod";

interface Props {
  readonly templateData?: PriceListTemplateDetailsDto;
  readonly mode: formType;
}

// Define a form schema that covers both create and update scenarios
const FormSchema = CreatePriceTemplateRequestSchema.extend({
  products: z.object({
    add: z.array(
      z.object({
        product_id: z.string(),
        moq: z.array(
          z.object({
            unit_id: z.string(),
            unit_name: z.string(),
            note: z.string().optional(),
            qty: z.number(),
          })
        ),
      })
    ),
    update: z
      .array(
        z.object({
          product_id: z.string(),
          moq: z.array(
            z.object({
              unit_id: z.string(),
              unit_name: z.string(),
              note: z.string().optional(),
              qty: z.number(),
            })
          ),
        })
      )
      .optional(),
    remove: z.array(z.object({ id: z.string() })).optional(),
  }),
});

type FormValues = z.infer<typeof FormSchema>;

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
      vendor_instruction: templateData?.vendor_instruction || "",
      valid_period: templateData?.valid_period || 90,
      currency_id: templateData?.currency?.id || "",
      products: {
        add: [],
        update: [],
        remove: [],
      },
    },
  });

  const initProducts = useMemo(() => {
    return (
      templateData?.products?.map((product) => ({
        id: product.id,
        name: product.name,
        moq:
          product.moq?.map((m) => ({
            ...m,
            note: m.note || "",
          })) || [],
      })) || []
    );
  }, [templateData?.products]);

  const initProductKeys = useMemo(() => {
    return initProducts.map((product) => product.id);
  }, [initProducts]);

  const createMutation = useCreatePriceListTemplate(token, buCode);
  const updateMutation = useUpdatePriceListTemplate(token, buCode, templateData?.id || "");

  const previousDataRef = useRef<string>("");

  const handleTreeProductSelect = useCallback(
    (products: { id: string; moq?: any[] }[]) => {
      // Deep compare to avoid infinite loops
      const currentDataString = JSON.stringify(products);
      if (currentDataString === previousDataRef.current) {
        return;
      }
      previousDataRef.current = currentDataString;

      const currentProductIds = initProductKeys.map((key) => key.toString());
      const newProductIds = products.map((p) => p.id);

      const toAdd = products
        .filter((p) => !currentProductIds.includes(p.id))
        .map((p) => ({
          product_id: p.id,
          moq: p.moq || [],
        }));

      const toRemove = currentProductIds
        .filter((id) => !newProductIds.includes(id))
        .map((id) => ({ id }));

      const toUpdate = products
        .filter((p) => {
          if (!currentProductIds.includes(p.id)) return false;
          const initialProduct = initProducts.find((ip) => ip.id === p.id);
          if (!initialProduct) return false;

          // Compare MOQ
          const initialMoq = initialProduct.moq || [];
          const currentMoq = p.moq || [];
          return JSON.stringify(initialMoq) !== JSON.stringify(currentMoq);
        })
        .map((p) => ({
          product_id: p.id,
          moq: p.moq || [],
        }));

      form.setValue("products", {
        add: toAdd,
        remove: toRemove,
        update: toUpdate,
      });
    },
    [initProductKeys, initProducts, form]
  );

  const onSubmit = async (data: FormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    try {
      if (isCreating) {
        await createMutation.mutateAsync({
          name: data.name,
          status: data.status,
          description: data.description,
          valid_period: data.valid_period,
          vendor_instruction: data.vendor_instruction,
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
          valid_period: data.valid_period,
          vendor_instruction: data.vendor_instruction,
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
