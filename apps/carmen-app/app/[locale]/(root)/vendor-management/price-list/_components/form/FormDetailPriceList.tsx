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
import { useUpdatePriceList } from "../../_hooks/use-price-list";
import { priceListSchema, type PriceListFormData } from "../../_schema/price-list.schema";
import type { PriceListDetailDto } from "../../_dto/price-list-dto";
import OverviewSection from "./OverviewSection";
import ProductsSection from "./ProductsSection";
import { formatDate } from "@/utils/format/date";

interface DetailPriceListProps {
  readonly priceList?: PriceListDetailDto;
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

  const form = useForm<PriceListFormData>({
    resolver: zodResolver(priceListSchema),
    defaultValues: {
      no: "",
      vendorId: "",
      rfpId: "",
      description: "",
      status: "draft",
      currencyId: "",
      effectivePeriod: "",
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
      form.reset({
        no: priceList.no,
        vendorId: priceList.vendor.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        status: priceList.status,
        currencyId: priceList.currency.id,
        effectivePeriod: priceList.effectivePeriod,
        products: priceList.products.map((p) => ({
          id: p.id,
          moqs: p.moqs,
        })),
      });
    }
  }, [priceList, form]);

  const handleEdit = () => {
    setMode(formType.EDIT);
  };

  const handleCancel = () => {
    if (priceList) {
      form.reset({
        no: priceList.no,
        vendorId: priceList.vendor.id,
        rfpId: priceList.rfp?.id || "",
        description: priceList.description || "",
        status: priceList.status,
        currencyId: priceList.currency.id,
        effectivePeriod: priceList.effectivePeriod,
        products: priceList.products.map((p) => ({
          id: p.id,
          moqs: p.moqs,
        })),
      });
    }
    setMode(formType.VIEW);
  };

  const onSubmit = (data: PriceListFormData) => {
    updatePriceList(data, {
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
    <div className="h-full w-full flex flex-col">
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
