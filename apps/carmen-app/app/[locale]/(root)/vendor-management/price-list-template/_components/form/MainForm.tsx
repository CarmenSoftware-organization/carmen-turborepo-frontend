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
import TabOverview from "./TabOverview";
import TabProducts from "./TabProducts";
import TabCampaigns from "./TabCampaigns";
import {
  priceListTemplateFormSchema,
  PriceListTemplateFormValues,
} from "../../_schema/price-list-template.schema";
import { ChevronLeft, PenBoxIcon, Save, X } from "lucide-react";
import { useRouter } from "@/lib/navigation";
import { toast } from "sonner";

interface Props {
  readonly templateData?: PriceListTemplateDetailsDto;
  readonly mode: formType;
}

export default function MainForm({ templateData, mode }: Props) {
  const router = useRouter();
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
      console.log("[MainForm] handleTreeProductSelect called");
      console.log("  - Received product IDs:", productIds.length);

      const currentProductIds = initProductKeys.map((key) => key.toString());
      const newProductIds = productIds.map((p) => p.id);

      // Create a string representation for comparison
      const newIdsString = newProductIds.sort().join(",");

      console.log("  - Previous:", previousProductIdsRef.current);
      console.log("  - New:", newIdsString);

      // Only process if the product IDs have actually changed
      if (newIdsString === previousProductIdsRef.current) {
        console.log("  -> Same as previous, skipping");
        return;
      }

      previousProductIdsRef.current = newIdsString;

      const toAdd = newProductIds
        .filter((id) => !currentProductIds.includes(id))
        .map((id) => ({ id }));
      const toRemove = currentProductIds
        .filter((id) => !newProductIds.includes(id))
        .map((id) => ({ id }));

      console.log("  - To add:", toAdd.length);
      console.log("  - To remove:", toRemove.length);

      // Only update if there are actual changes
      if (toAdd.length > 0 || toRemove.length > 0) {
        console.log("  -> Updating form.setValue");
        form.setValue("products", {
          add: toAdd,
          remove: toRemove,
        });
      } else {
        console.log("  -> No changes to add/remove");
      }
    },
    [initProductKeys, form]
  );

  const onSubmit = async (data: PriceListTemplateFormValues): Promise<void> => {
    const isCreating = currentMode === formType.ADD;

    try {
      if (isCreating) {
        await createMutation.mutateAsync(data);
        toast.success("Price list template created successfully");
        router.push("/vendor-management/price-list-template");
      } else {
        await updateMutation.mutateAsync(data);
        toast.success("Price list template updated successfully");
        setCurrentMode(formType.VIEW);
      }
    } catch (error) {
      toast.error(isCreating ? "Failed to create template" : "Failed to update template");
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
              {currentMode === formType.ADD && "Create New Price List Template"}
              {currentMode === formType.EDIT && "Edit Price List Template"}
              {currentMode === formType.VIEW && templateData?.name}
            </h1>
            {templateData && (
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(templateData.update_date).toLocaleDateString()}
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
            <>
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                Clear Form
              </Button>
              <Button type="submit" form="price-list-template-form">
                Create Template
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden mt-4">
        <Form {...form}>
          <form id="price-list-template-form" onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="overview" className="flex flex-col">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                {templateData && <TabsTrigger value="campaigns">Campaigns</TabsTrigger>}
              </TabsList>
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="overview" className="mt-0">
                  <TabOverview form={form} isViewMode={isViewMode} templateData={templateData} />
                </TabsContent>
                <TabsContent value="products" className="mt-0">
                  <TabProducts
                    onProductSelect={handleTreeProductSelect}
                    products={templateData?.products}
                    isViewMode={isViewMode}
                  />
                </TabsContent>
                {templateData && (
                  <TabsContent value="campaigns" className="mt-0">
                    <TabCampaigns campaigns={templateData.campaigns || []} />
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
