"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useBuConfig } from "@/context/BuConfigContext";
import { Button } from "@/components/ui/button";
import { FileText, Save, ChevronLeft, Pencil, Loader2, Trash2 } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { priceListSchema, type PriceListFormData } from "../../_schema/price-list.schema";
import OverviewSection from "./OverviewSection";
import ProductsSection from "./ProductsSection";
import { useCreatePriceList, useUpdatePriceList, useDeletePriceList } from "@/hooks/use-price-list";
import { PriceListBreadcrumb } from "../shared";
import { PricelistDetail } from "../../_schema/pl.dto";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { useQueryClient } from "@tanstack/react-query";
import { Form } from "@/components/form-custom/form";

interface PriceListFormProps {
  readonly initialData?: PricelistDetail;
  readonly mode: formType;
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

const toFormValues = (data: PricelistDetail): PriceListFormData => {
  // Handle both nested vendor.id and flat vendor_id from API
  const vendorId = data.vendor?.id || (data as any).vendor_id || "";
  const currencyId = data.currency?.id || (data as any).currency_id || "";

  return {
    no: data.no || "",
    name: data.name || "",
    vendorId,
    rfpId: "",
    description: data.description || "",
    note: data.note || "",
    status: data.status as PriceListFormData["status"],
    currencyId,
    effectivePeriod: getEffectivePeriod(data.effectivePeriod),
    pricelist_detail: (data.pricelist_detail || []).map((p: any) => ({
      dbId: p.id,
      sequence_no: p.sequence_no,
      product_id: p.product_id,
      product_name: p.product_name || "",
      product_code: p.product_code || "",
      price: p.price,
      price_without_tax: p.price_without_tax ?? 0,
      unit_id: p.unit_id,
      unit_name: p.unit_name || "",
      tax_profile_id: p.tax_profile_id,
      tax_profile_name: p.tax_profile?.rate ? `${p.tax_profile.rate}%` : "",
      tax_rate: p.tax_profile?.rate ?? 0,
      tax_amt: p.tax_amt ?? 0,
      lead_time_days: p.lead_time_days ?? 0,
      moq_qty: p.moq_qty,
      _action: "none" as const,
    })),
  };
};

const getDefaultFormValues = (defaultCurrencyId?: string): PriceListFormData => ({
  no: "",
  name: "",
  vendorId: "",
  rfpId: "",
  description: "",
  note: "",
  status: "draft",
  currencyId: defaultCurrencyId || "",
  effectivePeriod: { from: "", to: "" },
  pricelist_detail: [],
});

export default function PriceListForm({ initialData, mode }: PriceListFormProps) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const { defaultCurrencyId, dateFormat } = useBuConfig();
  const queryClient = useQueryClient();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");

  // Mode State
  const [currentMode, setCurrentMode] = useState<formType>(mode);
  const isViewMode = currentMode === formType.VIEW;
  const isAddMode = currentMode === formType.ADD;

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const defaultFormValues = getDefaultFormValues(defaultCurrencyId ?? "");

  const getInitialFormValues = (): PriceListFormData => {
    if (isAddMode) return defaultFormValues;
    if (initialData) return toFormValues(initialData);
    return defaultFormValues;
  };

  const form = useForm<PriceListFormData>({
    resolver: zodResolver(priceListSchema),
    defaultValues: getInitialFormValues(),
  });

  const { mutate: createPriceList, isPending: isCreating } = useCreatePriceList(token, buCode);
  const { mutate: updatePriceList, isPending: isUpdating } = useUpdatePriceList(
    token,
    buCode,
    initialData?.id || ""
  );
  const { mutate: deletePriceList, isPending: isDeleting } = useDeletePriceList(token, buCode);

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (initialData && currentMode !== formType.ADD) {
      const formValues = toFormValues(initialData);
      form.reset(formValues);
    }
  }, [initialData, form, currentMode]);

  const handleEdit = useCallback(() => {
    setCurrentMode(formType.EDIT);
  }, []);

  const handleCancel = useCallback(() => {
    if (isAddMode) {
      router.push("/vendor-management/price-list");
      return;
    }

    // Reset form to initial data
    if (initialData) {
      form.reset(toFormValues(initialData));
    }
    setCurrentMode(formType.VIEW);
  }, [isAddMode, initialData, form, router]);

  const handleDelete = useCallback(() => {
    setIsDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!initialData?.id) return;

    deletePriceList(initialData.id, {
      onSuccess: () => {
        toastSuccess({ message: tPriceList("delete_success") });
        queryClient.removeQueries({ queryKey: ["price-list", buCode, initialData.id] });
        queryClient.invalidateQueries({ queryKey: ["price-list", buCode] });
        router.replace("/vendor-management/price-list");
      },
      onError: () => {
        toastError({ message: tPriceList("delete_error") });
      },
    });
    setIsDeleteDialogOpen(false);
  }, [initialData?.id, deletePriceList, tPriceList, queryClient, buCode, router]);

  const formatDateToISO = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toISOString();
  };

  const onSubmit = useCallback(
    (data: PriceListFormData) => {
      const items = data.pricelist_detail || [];

      const addItems = items
        .filter((item) => item._action === "add")
        .map((item, index) => ({
          sequence_no: item.sequence_no ?? index + 1,
          product_id: item.product_id,
          price: item.price,
          price_without_tax: item.price_without_tax || 0,
          unit_id: item.unit_id,
          tax_profile_id: item.tax_profile_id,
          tax_rate: item.tax_rate || 0,
          tax_amt: item.tax_amt || 0,
          lead_time_days: item.lead_time_days || 0,
          moq_qty: Number(item.moq_qty) || 0,
        }));

      const updateItems = items
        .filter((item) => item._action === "update" && item.dbId)
        .map((item) => ({
          id: item.dbId,
          sequence_no: item.sequence_no,
          product_id: item.product_id,
          price: item.price,
          price_without_tax: item.price_without_tax || 0,
          unit_id: item.unit_id,
          tax_profile_id: item.tax_profile_id,
          tax_rate: item.tax_rate || 0,
          tax_amt: item.tax_amt || 0,
          lead_time_days: item.lead_time_days || 0,
          moq_qty: Number(item.moq_qty) || 0,
        }));

      const removeItems = items
        .filter((item) => item._action === "remove" && item.dbId)
        .map((item) => ({ id: item.dbId! }));

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
            toastSuccess({ message: tPriceList("update_success") });
            queryClient.invalidateQueries({ queryKey: ["price-list", buCode, initialData.id] });
            setCurrentMode(formType.VIEW);
          },
          onError: (error: any) => {
            toastError({ message: error.message || tPriceList("update_error") });
          },
        });
      } else {
        // @ts-ignore
        createPriceList(payload, {
          onSuccess: () => {
            toastSuccess({ message: tPriceList("create_success") });
            queryClient.invalidateQueries({ queryKey: ["price-list", buCode] });
            router.push("/vendor-management/price-list");
          },
          onError: (error: any) => {
            toastError({ message: error.message || tPriceList("create_error") });
          },
        });
      }
    },
    [initialData, updatePriceList, createPriceList, tCommon, queryClient, buCode, router]
  );

  return (
    <div className="flex flex-col min-h-screen mx-4 pb-10">
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={tPriceList("delete_price_list")}
        description={tPriceList("delete_price_list_confirmation")}
      />

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-background pb-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => router.back()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold tracking-tight text-foreground">
                    {isAddMode ? tPriceList("new_price_list") : initialData?.name || "Price List"}
                  </h1>
                  {!isAddMode && initialData?.status && (
                    <Badge variant={initialData.status} className="font-bold">
                      {initialData.status.toUpperCase()}
                    </Badge>
                  )}
                </div>
                <PriceListBreadcrumb
                  currentPage={isAddMode ? tPriceList("new_price_list") : initialData?.no || ""}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isViewMode ? (
                <Button size="sm" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                  {tCommon("edit")}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="h-8"
                  >
                    {tCommon("cancel")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="h-8 gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-3.5 w-3.5" />
                        {tCommon("save")}
                      </>
                    )}
                  </Button>
                  {!isAddMode && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="h-8"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {tCommon("delete")}
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <OverviewSection
              form={form}
              priceList={initialData}
              isViewMode={isViewMode}
              defaultCurrency={defaultCurrencyId || ""}
              dateFormat={dateFormat ?? "yyyy-MM-dd"}
            />
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-none">{tPriceList("pl_items")}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{tPriceList("mangage_pl")}</p>
                </div>
              </div>
            </div>
            <ProductsSection form={form} isViewMode={isViewMode} token={token} buCode={buCode} />
          </form>
        </Form>
      </div>
    </div>
  );
}
