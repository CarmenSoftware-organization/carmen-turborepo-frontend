"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Save, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { priceListSchema, type PriceListFormData } from "../../_schema/price-list.schema";
import OverviewSection from "./OverviewSection";
import ProductsSection from "./ProductsSection";
import { useCreatePriceList, useUpdatePriceList } from "@/hooks/use-price-list";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { PriceListBreadcrumb, ProductsCardHeader } from "../shared";

interface PriceListFormProps {
  readonly initialData?: any;
  readonly mode: formType.ADD | formType.EDIT;
  readonly onViewMode: () => void;
}

export default function PriceListForm({ initialData, mode, onViewMode }: PriceListFormProps) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");

  const isAddMode = mode === formType.ADD;

  const form = useForm<PriceListFormData>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      no: "",
      name: "",
      vendorId: "",
      rfpId: "",
      description: "",
      note: "",
      status: "draft",
      currencyId: "",
      effectivePeriod: { from: "", to: "" },
      pricelist_detail: [],
    },
  });

  const { mutate: createPriceList, isPending: isCreating } = useCreatePriceList(token, buCode);
  const { mutate: updatePriceList, isPending: isUpdating } = useUpdatePriceList(
    token,
    buCode,
    initialData?.id || ""
  );

  const productsCount = form.watch("pricelist_detail")?.length || 0;

  useEffect(() => {
    if (initialData) {
      const getEffectivePeriod = (period: any) => {
        if (typeof period === "string") {
          const [from, to] = period.split(" - ");
          return { from: from || "", to: to || "" };
        }
        return period || { from: "", to: "" };
      };

      form.reset({
        no: initialData.no || "",
        name: initialData.name || "",
        vendorId: initialData.vender?.id,
        rfpId: initialData.rfp?.id || "",
        description: initialData.description || "",
        note: initialData.note || "",
        status: initialData.status,
        currencyId: initialData.currency?.id,
        effectivePeriod: getEffectivePeriod(initialData.effectivePeriod),
        pricelist_detail: (initialData.pricelist_detail || []).map((p: any) => ({
          sequence_no: p.sequence_no,
          product_id: p.product_id,
          unit_id: p.unit_id,
          tax_profile_id: p.tax_profile_id,
          tax_rate: p.tax_rate,
          moq_qty: p.moq_qty,
          price: p.price,
          lead_time_days: p.lead_time_days,
        })),
      });
    }
  }, [initialData, form]);

  const handleCancel = () => {
    if (isAddMode) {
      router.push("/vendor-management/price-list");
      return;
    }

    if (initialData) {
      const getEffectivePeriod = (period: any) => {
        if (typeof period === "string") {
          const [from, to] = period.split(" - ");
          return { from: from || "", to: to || "" };
        }
        return period || { from: "", to: "" };
      };

      form.reset({
        no: initialData.no || "",
        name: initialData.name || "",
        vendorId: initialData.vender?.id,
        rfpId: initialData.rfp?.id || "",
        description: initialData.description || "",
        note: initialData.note || "",
        status: initialData.status,
        currencyId: initialData.currency?.id,
        effectivePeriod: getEffectivePeriod(initialData.effectivePeriod),
        pricelist_detail: (initialData.pricelist_detail || []).map((p: any) => ({
          sequence_no: p.sequence_no,
          product_id: p.product_id,
          unit_id: p.unit_id,
          tax_profile_id: p.tax_profile_id,
          tax_rate: p.tax_rate,
          moq_qty: p.moq_qty,
          price: p.price,
          lead_time_days: p.lead_time_days,
        })),
      });
    }
    onViewMode();
  };

  const onSubmit = (data: PriceListFormData) => {
    const payload = {
      vendor_id: data.vendorId,
      name: data.name,
      description: data.description,
      status: data.status,
      currency_id: data.currencyId,
      from_date: data.effectivePeriod.from,
      to_date: data.effectivePeriod.to,
      note: data.note,
      pricelist_detail: {
        create: (data.pricelist_detail || []).map((item) => {
          const taxRate = item.tax_rate || 0;
          const price = Number(item.price) || 0;
          const taxAmt = (price * taxRate) / 100;

          return {
            sequence_no: item.sequence_no,
            product_id: item.product_id,
            unit_id: item.unit_id,
            tax_profile_id: item.tax_profile_id,
            tax_rate: taxRate,
            moq_qty: Number(item.moq_qty) || 0,
            price: price,
            price_without_tax: price,
            tax_amt: taxAmt,
            lead_time_days: Number(item.lead_time_days) || 0,
          };
        }),
      },
    };

    if (initialData?.id) {
      // @ts-ignore
      updatePriceList(payload, {
        onSuccess: () => {
          toastSuccess({ message: tCommon("update_success") });
          onViewMode();
          router.refresh();
        },
        onError: (error: any) => {
          toastError({ message: error.message || tCommon("update_error") });
        },
      });
    } else {
      // @ts-ignore
      createPriceList(payload, {
        onSuccess: () => {
          toastSuccess({ message: tCommon("create_success") });
          router.push("/vendor-management/price-list");
          router.refresh();
        },
        onError: (error: any) => {
          toastError({ message: error.message || tCommon("create_error") });
        },
      });
    }
  };

  return (
    <div className="space-y-4 mx-auto max-w-3xl">
      {/* Header: Breadcrumb + Action buttons */}
      <div className="flex items-center justify-between">
        <PriceListBreadcrumb
          currentPage={isAddMode ? tPriceList("new_price_list") : initialData?.no}
        />
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="h-8 gap-1.5"
                >
                  <X className="h-4 w-4" />
                  {tCommon("cancel")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("cancel")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  variant="default"
                  size="sm"
                  disabled={isCreating || isUpdating}
                  className="h-8 gap-1.5"
                >
                  <Save className="h-4 w-4" />
                  {isCreating || isUpdating ? tCommon("saving") : tCommon("save")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("save")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Overview Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold leading-none tracking-tight">
                    {isAddMode ? tPriceList("new_price_list") : tPriceList("edit_price_list")}
                  </h2>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <OverviewSection form={form} priceList={initialData} isViewMode={false} />
            </CardContent>
          </Card>

          {/* Products Card */}
          <Card>
            <CardHeader className="pb-3">
              <ProductsCardHeader count={productsCount} />
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <ProductsSection form={form} priceList={initialData} isViewMode={false} />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
