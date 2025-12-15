"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, PenBoxIcon, Save, X } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { priceListSchema, type PriceListFormData } from "../../_schema/price-list.schema";
import type { PriceListDetailDto } from "../../_dto/price-list-dto";
import OverviewSection from "./OverviewSection";
import ProductsSection from "./ProductsSection";
import { formatDate } from "@/utils/format/date";
import { useUpdatePriceList } from "../../_hooks/use-price-list";

interface DetailPriceListProps {
  readonly priceList?: any;
  mode: formType;
}

export default function DetailPriceList({ priceList, mode: initialMode }: DetailPriceListProps) {
  const router = useRouter();
  const { token, buCode, dateFormat } = useAuth();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");
  const [mode, setMode] = useState<formType>(initialMode);

  const isViewMode = mode === formType.VIEW;
  const isEditMode = mode === formType.EDIT;

  console.log("priceList", priceList);

  const form = useForm<PriceListFormData>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      no: "",
      vendorId: "",
      rfpId: "",
      description: "",
      note: "",
      status: "draft",
      currencyId: "",
      effectivePeriod: { from: "", to: "" },
      products: [],
    },
  });

  const { mutate: updatePriceList, isPending: isUpdating } = useUpdatePriceList(
    token,
    buCode,
    priceList?.id || ""
  );

  useEffect(() => {
    if (priceList) {
      const getEffectivePeriod = (period: any) => {
        if (typeof period === "string") {
          const [from, to] = period.split(" - ");
          return { from: from || "", to: to || "" };
        }
        return period || { from: "", to: "" };
      };

      form.reset({
        no: priceList.no,
        // @ts-ignore
        vendorId: priceList.vender?.id || priceList.vendor?.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        note: priceList.note || "",
        status: priceList.status,
        currencyId: priceList.currency?.id,
        effectivePeriod: getEffectivePeriod(priceList.effectivePeriod),
        // @ts-ignore
        products: (priceList.pricelist_detail || priceList.products || []).map((p: any) => ({
          id: p.product_id || p.id,
          code: p.code || p.tb_product?.code,
          name: p.name || p.tb_product?.name,
          moqs: (p.moqs || []).map((m: any) => ({
            minQuantity: m.minQuantity,
            unit: m.unit,
            unitId: m.unitId || m.unit_id,
            price: m.price,
            leadTimeDays: m.leadTimeDays,
            taxProfileId: m.taxProfileId || m.tax_profile_id,
            taxRate: m.taxRate || m.tax_rate,
          })),
        })),
      });
    }
  }, [priceList, form]);

  const handleEdit = () => {
    setMode(formType.EDIT);
  };

  const handleCancel = () => {
    if (priceList) {
      const getEffectivePeriod = (period: any) => {
        if (typeof period === "string") {
          const [from, to] = period.split(" - ");
          return { from: from || "", to: to || "" };
        }
        return period || { from: "", to: "" };
      };

      form.reset({
        no: priceList.no,
        // @ts-ignore
        vendorId: priceList.vender?.id || priceList.vendor?.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        status: priceList.status,
        currencyId: priceList.currency?.id,
        effectivePeriod: getEffectivePeriod(priceList.effectivePeriod),
        // @ts-ignore
        products: (priceList.pricelist_detail || priceList.products || []).map((p: any) => ({
          id: p.product_id || p.id,
          code: p.code || p.tb_product?.code,
          name: p.name || p.tb_product?.name,
          moqs: (p.moqs || []).map((m: any) => ({
            minQuantity: m.minQuantity,
            unit: m.unit,
            unitId: m.unitId || m.unit_id,
            price: m.price,
            leadTimeDays: m.leadTimeDays,
            taxProfileId: m.taxProfileId || m.tax_profile_id,
            taxRate: m.taxRate || m.tax_rate,
          })),
        })),
      });
    }
    setMode(formType.VIEW);
  };

  const onSubmit = (data: PriceListFormData) => {
    const payload = {
      vendor_id: data.vendorId,
      name: data.no, // Mapping 'no' to 'name' as requested
      description: data.description,
      status: data.status,
      currency_id: data.currencyId,
      effective_from_date: `${data.effectivePeriod.from}T00:00:00+07:00`,
      effective_to_date: `${data.effectivePeriod.to}T23:59:59+07:00`,
      note: data.note,
      pricelist_detail: (data.products || []).flatMap((product) =>
        product.moqs.map((moq, index) => ({
          sequence_no: index + 1,
          product_id: product.id,
          unit_id: moq.unitId || "566c45dd-d5fa-4820-99d6-29b24ef06289", // Fallback or from form
          tax_profile_id: moq.taxProfileId || "92cd1c73-0396-4045-9835-c6c9d27f67a9", // Fallback or from form
          tax_rate: moq.taxRate || 7,
          moq_qty: moq.minQuantity,
          price: moq.price,
        }))
      ),
    };

    console.log("Submit Payload:", JSON.stringify(payload, null, 2));

    // @ts-ignore
    updatePriceList(payload, {
      onSuccess: () => {
        toastSuccess({ message: tCommon("update_success") });
        setMode(formType.VIEW);
      },
      onError: (error) => {
        toastError({ message: error.message || tCommon("update_error") });
      },
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "draft":
        return "secondary";
      case "submit":
        return "warning";
      case "inactive":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => router.push("/vendor-management/price-list")}
            variant="outlinePrimary"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {priceList?.no || tPriceList("new_price_list")}
              </h1>
              {priceList?.status && (
                <Badge variant={getStatusVariant(priceList.status)} className="capitalize">
                  {priceList.status}
                </Badge>
              )}
            </div>
            {priceList?.lastUpdate && (
              <p className="text-sm text-muted-foreground">
                {tCommon("last_updated")}:{" "}
                {formatDate(priceList.lastUpdate, dateFormat || "dd/MM/yyyy HH:mm")}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isViewMode && (
            <Button onClick={handleEdit} size="sm">
              <PenBoxIcon className="h-4 w-4" />
              {tCommon("edit")}
            </Button>
          )}

          {isEditMode && (
            <>
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={isUpdating}>
                <X className="h-4 w-4 mr-2" />
                {tCommon("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                size="sm"
                disabled={isUpdating}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdating ? tCommon("saving") : tCommon("save")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 pb-8">
            <OverviewSection form={form} priceList={priceList} isViewMode={isViewMode} />
            <ProductsSection form={form} priceList={priceList} isViewMode={isViewMode} />
          </form>
        </Form>
      </div>
    </div>
  );
}
