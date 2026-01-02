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
import OverviewSection from "./OverviewSection";
import ProductsSection from "./ProductsSection";
import { formatDate } from "@/utils/format/date";
import { useCreatePriceList, useUpdatePriceList } from "../../_hooks/use-price-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const isEditMode = mode === formType.EDIT || mode === formType.ADD;
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
        no: priceList.no || "",
        name: priceList.name || "",
        vendorId: priceList.vender?.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        note: priceList.note || "",
        status: priceList.status,
        currencyId: priceList.currency?.id,
        effectivePeriod: getEffectivePeriod(priceList.effectivePeriod),
        pricelist_detail: (priceList.pricelist_detail || []).map((p: any) => ({
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
  }, [priceList, form]);

  const handleEdit = () => {
    setMode(formType.EDIT);
  };

  const handleCancel = () => {
    if (mode === formType.ADD) {
      router.push("/vendor-management/price-list");
      return;
    }

    if (priceList) {
      const getEffectivePeriod = (period: any) => {
        if (typeof period === "string") {
          const [from, to] = period.split(" - ");
          return { from: from || "", to: to || "" };
        }
        return period || { from: "", to: "" };
      };

      form.reset({
        no: priceList.no || "",
        name: priceList.name || "",
        vendorId: priceList.vender?.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        status: priceList.status,
        currencyId: priceList.currency?.id,
        effectivePeriod: getEffectivePeriod(priceList.effectivePeriod),
        pricelist_detail: (priceList.pricelist_detail || []).map((p: any) => ({
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
    setMode(formType.VIEW);
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

    console.log("Submit Payload:", JSON.stringify(payload, null, 2));

    if (priceList?.id) {
      // @ts-ignore
      updatePriceList(payload, {
        onSuccess: () => {
          toastSuccess({ message: tCommon("update_success") });
          setMode(formType.VIEW);
          router.refresh();
        },
        onError: (error) => {
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
        onError: (error) => {
          toastError({ message: error.message || tCommon("create_error") });
        },
      });
    }
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
    <div className="h-full max-w-3xl mx-auto flex flex-col">
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

          {(isEditMode || isAddMode) && (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isUpdating || isCreating}
              >
                <X className="h-4 w-4" />
                {tCommon("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                size="sm"
                disabled={isUpdating || isCreating}
              >
                <Save className="h-4 w-4" />
                {isUpdating || isCreating ? tCommon("saving") : tCommon("save")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4 pb-8">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">{tPriceList("overview")}</TabsTrigger>
                <TabsTrigger value="products">{tPriceList("products")}</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <OverviewSection form={form} priceList={priceList} isViewMode={isViewMode} />
              </TabsContent>
              <TabsContent value="products">
                <ProductsSection form={form} priceList={priceList} isViewMode={isViewMode} />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </div>
  );
}
