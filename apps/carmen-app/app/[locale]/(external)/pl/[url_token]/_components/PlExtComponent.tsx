"use client";

import { useState, useCallback } from "react";
import { usePriceListExternal } from "../_hooks/use-price-list-external";
import { Unauthorized, InternalServerError } from "@/components/error-ui";
import { AxiosError } from "axios";
import PriceListHeader from "./PriceListHeader";
import PriceListProductsTable from "./PriceListProductsTable";
import { CatLoading } from "@/components/error-ui/illustrations";
import { useTranslations } from "next-intl";
import { MoqTierDto, PricelistExternalDetailDto } from "./pl-external.dto";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";

interface PlExtComponentProps {
  urlToken: string;
}

export default function PlExtComponent({ urlToken }: PlExtComponentProps) {
  const { data, isLoading, isError, error } = usePriceListExternal(urlToken);
  const tCommon = useTranslations("Common");

  // Track pending tier updates: { productId: MoqTierDto[] }
  const [pendingTierUpdates, setPendingTierUpdates] = useState<Record<string, MoqTierDto[]>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasPendingChanges = Object.keys(pendingTierUpdates).length > 0;

  const handleTiersUpdate = useCallback((productId: string, tiers: MoqTierDto[]) => {
    setPendingTierUpdates((prev) => ({
      ...prev,
      [productId]: tiers,
    }));
  }, []);

  const buildSubmitPayload = () => {
    const tb_pricelist_detail = data?.tb_pricelist_detail.map(
      (item: PricelistExternalDetailDto) => {
        // Use pending updates if available, otherwise use original moq_tiers
        const details = pendingTierUpdates[item.id] || item.moq_tiers || [];
        return {
          ...item,
          details,
        };
      }
    );

    return {
      ...data,
      tb_pricelist_detail,
    };
  };

  const handleSave = async () => {
    if (!hasPendingChanges) {
      toastError({ message: "No changes to save" });
      return;
    }

    const payload = buildSubmitPayload();
    console.log("Payload:", payload);

    setIsSaving(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toastSuccess({ message: "Changes saved successfully" });
      setPendingTierUpdates({});
    } catch (err) {
      toastError({ message: "Failed to save changes" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (hasPendingChanges) {
      toastError({ message: "Please save all changes before submitting" });
      return;
    }

    const payload = buildSubmitPayload();
    console.log("=== SUBMIT ===");
    console.log("Payload:", payload);

    setIsSubmitting(true);
    try {
      // TODO: Implement actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      toastSuccess({ message: "Price list submitted successfully" });
    } catch (err) {
      toastError({ message: "Failed to submit price list" });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading) {
    return (
      <div className="pt-40 flex flex-col items-center justify-center gap-4">
        <div className="animate-bounce">
          <CatLoading />
        </div>
        <p className="text-primary text-lg font-medium animate-pulse">
          {tCommon("pls_wait")}
          <span className="inline-flex ml-1">
            <span className="animate-[bounce_1s_infinite_0ms]">.</span>
            <span className="animate-[bounce_1s_infinite_200ms]">.</span>
            <span className="animate-[bounce_1s_infinite_400ms]">.</span>
          </span>
        </p>
      </div>
    );
  }

  if (isError) {
    const axiosError = error as AxiosError;
    const status = axiosError?.response?.status;

    if (status === 401) {
      return <Unauthorized />;
    }

    return <InternalServerError />;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <PriceListHeader data={data} />
      <PriceListProductsTable
        items={data.tb_pricelist_detail}
        onTiersUpdate={handleTiersUpdate}
        onSave={handleSave}
        onSubmit={handleSubmit}
        hasPendingChanges={hasPendingChanges}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
