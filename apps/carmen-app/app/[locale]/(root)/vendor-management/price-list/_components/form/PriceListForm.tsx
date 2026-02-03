"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Save, X, ChevronLeft } from "lucide-react";
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
import { PricelistDetail } from "../../_schema/pl.dto";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PriceListFormProps {
  readonly initialData?: PricelistDetail;
  readonly mode: formType.ADD | formType.EDIT;
  readonly onViewMode: () => void;
}

const getEffectivePeriod = (period: any): { from: string; to: string } => {
  if (typeof period === "string") {
    const [from, to] = period.split(" - ");
    return { from: from || "", to: to || "" };
  }
  if (Array.isArray(period) && period.length === 2) {
    return { from: period[0] || "", to: period[1] || "" };
  }
  if (typeof period === "object" && period !== null && "from" in period && "to" in period) {
    return { from: String(period.from), to: String(period.to) };
  }
  return { from: "", to: "" };
};

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
      form.reset({
        no: initialData.no || "",
        name: initialData.name || "",
        vendorId: initialData.vendor?.id,
        // rfpId: initialData.rfp?.id || "",
        description: initialData.description || "",
        note: initialData.note || "",
        status: initialData.status as PriceListFormData["status"],
        currencyId: initialData.currency?.id,
        effectivePeriod: getEffectivePeriod(initialData.effectivePeriod),
        pricelist_detail: (initialData.pricelist_detail || []).map((p) => ({
          dbId: p.id, // ใช้ dbId แทน id
          sequence_no: p.sequence_no,
          product_id: p.product_id,
          product_name: p.product_name || "",
          product_code: "", // Not available in DTO
          price: p.price,
          unit_id: p.unit_id,
          unit_name: p.unit_name || "",
          tax_profile_id: p.tax_profile_id,
          tax_profile_name: p.tax_profile?.rate ? `${p.tax_profile.rate}%` : "",
          tax_rate: p.tax_profile?.rate ?? 0,
          moq_qty: p.moq_qty,
          _action: "none" as const,
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
      form.reset({
        no: initialData.no || "",
        name: initialData.name || "",
        vendorId: initialData.vendor?.id,
        // rfpId: initialData.rfp?.id || "",
        description: initialData.description || "",
        note: initialData.note || "",
        status: initialData.status as PriceListFormData["status"],
        currencyId: initialData.currency?.id,
        effectivePeriod: getEffectivePeriod(initialData.effectivePeriod),
        pricelist_detail: (initialData.pricelist_detail || []).map((p) => ({
          dbId: p.id, // ใช้ dbId แทน id
          sequence_no: p.sequence_no,
          product_id: p.product_id,
          product_name: p.product_name || "",
          product_code: "", // Not available in DTO
          price: p.price,
          unit_id: p.unit_id,
          unit_name: p.unit_name || "",
          tax_profile_id: p.tax_profile_id,
          tax_profile_name: p.tax_profile?.rate ? `${p.tax_profile.rate}%` : "",
          tax_rate: p.tax_profile?.rate ?? 0,
          moq_qty: p.moq_qty,
          _action: "none" as const,
        })),
      });
    }
    onViewMode();
  };

  const formatDateToISO = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString();
  };

  const onSubmit = (data: PriceListFormData) => {
    const items = data.pricelist_detail || [];

    // แยก items ตาม action
    const addItems = items
      .filter((item) => item._action === "add")
      .map((item, index) => ({
        sequence_no: item.sequence_no ?? index + 1,
        product_id: item.product_id,
        price: item.price,
        unit_id: item.unit_id,
        tax_profile_id: item.tax_profile_id,
        tax_rate: item.tax_rate || 0,
        moq_qty: Number(item.moq_qty) || 0,
      }));

    const updateItems = items
      .filter((item) => item._action === "update" && item.dbId)
      .map((item) => ({
        id: item.dbId,
        sequence_no: item.sequence_no,
        product_id: item.product_id,
        price: item.price,
        unit_id: item.unit_id,
        tax_profile_id: item.tax_profile_id,
        tax_rate: item.tax_rate || 0,
        moq_qty: Number(item.moq_qty) || 0,
      }));

    const removeItems = items
      .filter((item) => item._action === "remove" && item.dbId)
      .map((item) => ({ id: item.dbId! }));

    // สร้าง pricelist_detail object โดยใส่เฉพาะ array ที่มีข้อมูล
    const pricelistDetail: Record<string, any> = {};
    if (addItems.length > 0) pricelistDetail.add = addItems;
    if (updateItems.length > 0) pricelistDetail.update = updateItems;
    if (removeItems.length > 0) pricelistDetail.remove = removeItems;

    const payload = {
      vendor_id: data.vendorId,
      name: data.name,
      description: data.description,
      status: data.status,
      currency_id: data.currencyId,
      effective_from_date: formatDateToISO(data.effectivePeriod.from),
      effective_to_date: formatDateToISO(data.effectivePeriod.to),
      note: data.note,
      pricelist_detail: Object.keys(pricelistDetail).length > 0 ? pricelistDetail : undefined,
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

  // Determine status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "submit":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
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
                onClick={handleCancel}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-tight text-foreground">
                    {isAddMode ? tPriceList("new_price_list") : initialData?.no || "Price List"}
                  </h1>
                  {!isAddMode && (
                    <Badge
                      variant="secondary"
                      className={cn("ml-2", getStatusColor(initialData?.status))}
                    >
                      {initialData?.status}
                    </Badge>
                  )}
                </div>
                <PriceListBreadcrumb
                  currentPage={isAddMode ? tPriceList("new_price_list") : initialData?.no || ""}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                disabled={isCreating || isUpdating}
                className="h-8"
              >
                {tCommon("cancel")}
              </Button>
              <Button
                onClick={form.handleSubmit(onSubmit)}
                variant="default"
                size="sm"
                disabled={isCreating || isUpdating}
                className="h-8 gap-2 px-4 shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                {isCreating || isUpdating ? tCommon("saving") : tCommon("save")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Overview Section */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <OverviewSection form={form} priceList={initialData} isViewMode={false} />
              </div>
            </div>

            {/* Products Section */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold leading-none">Price List Items</h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Manage products and prices ({productsCount} items)
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-0">
                <ProductsSection form={form} isViewMode={false} />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
