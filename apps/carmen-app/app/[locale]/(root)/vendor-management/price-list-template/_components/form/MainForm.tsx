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
import { ChevronLeft, PenBoxIcon, Plus, Save, X } from "lucide-react";
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
    add: z.array(z.any()), // Use any for now as UI handles complex objects, validation can be refined
    update: z.array(z.any()).optional(),
    remove: z.array(z.any()).optional(),
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function MainForm({ templateData, mode }: Props) {
  const router = useRouter();
  const tPlt = useTranslations("PriceListTemplate");
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
        key: product.id,
        title: product.name,
        moq: product.moq?.map((m: any) => ({
          ...m,
          id: m.id || crypto.randomUUID(),
        })),
      })) || []
    );
  }, [templateData?.products]);

  const initProductKeys = useMemo(() => {
    return initProducts.map((product) => product.key);
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

      const stripMoqIds = (moq: any[]) => {
        return moq.map(({ id, ...rest }: any) => rest);
      };

      const toAdd = products
        .filter((p) => !currentProductIds.includes(p.id))
        .map((p) => ({
          product_id: p.id,
          moq: stripMoqIds(p.moq || []),
        }));

      const toRemove = currentProductIds
        .filter((id) => !newProductIds.includes(id))
        .map((id) => ({ id }));

      const toUpdate = products
        .filter((p) => {
          if (!currentProductIds.includes(p.id)) return false;
          const initialProduct = initProducts.find((ip) => ip.key === p.id);
          if (!initialProduct) return false;

          // Compare MOQ (ignoring IDs)
          const initialMoq = stripMoqIds(initialProduct.moq || []);
          const currentMoq = stripMoqIds(p.moq || []);
          return JSON.stringify(initialMoq) !== JSON.stringify(currentMoq);
        })
        .map((p) => ({
          product_id: p.id,
          moq: stripMoqIds(p.moq || []),
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

  console.log("form value", form.watch());

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
