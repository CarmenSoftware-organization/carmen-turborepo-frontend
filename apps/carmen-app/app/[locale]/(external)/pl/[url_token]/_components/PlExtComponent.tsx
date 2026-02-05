"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  usePriceListExternal,
  useUpdatePriceListExternal,
  useSubmitPriceListExternal,
  PricelistExternalDto,
} from "../_hooks/use-price-list-external";
import { Unauthorized, InternalServerError } from "@/components/error-ui";
import { AxiosError } from "axios";
import PriceListHeader from "./PriceListHeader";
import PriceListProductsTable from "./PriceListProductsTable";
import { CatLoading } from "@/components/error-ui/illustrations";
import { useTranslations } from "next-intl";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

interface PlExtComponentProps {
  urlToken: string;
}

export default function PlExtComponent({ urlToken }: PlExtComponentProps) {
  const { data, isLoading, isError, error } = usePriceListExternal(urlToken);
  const tCommon = useTranslations("Common");

  const updateMutation = useUpdatePriceListExternal(urlToken);
  const submitMutation = useSubmitPriceListExternal(urlToken);

  const [isViewMode, setIsViewMode] = useState(true);

  // Initialize form
  const form = useForm<PricelistExternalDto>({
    defaultValues: {
      id: "",
      pricelist_no: "",
      name: "",
      status: "draft",
      vendor_id: "",
      vendor_name: null,
      currency_id: "",
      currency_code: "",
      effective_from_date: "",
      effective_to_date: "",
      description: null,
      note: null,
      tb_pricelist_detail: [],
    },
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (data) {
      form.reset(data);
    }
  }, [data, form]);

  const handleSave = async () => {
    const formData = form.getValues();

    if (!form.formState.isDirty) {
      toastError({ message: "No changes to save" });
      return;
    }

    try {
      await updateMutation.mutateAsync(formData);
      toastSuccess({ message: "Changes saved successfully" });
      form.reset(formData); // Reset dirty state
    } catch (err) {
      toastError({ message: "Failed to save changes" });
    }
  };

  const handleSubmit = async () => {
    const formData = form.getValues();

    if (form.formState.isDirty) {
      toastError({ message: "Please save all changes before submitting" });
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      toastSuccess({ message: "Price list submitted successfully" });
    } catch (err) {
      toastError({ message: "Failed to submit price list" });
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

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <PriceListHeader data={data} />
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsViewMode(!isViewMode)}
          className="gap-1.5"
        >
          {isViewMode ? (
            <>
              <Pencil className="h-4 w-4" />
              Edit Mode
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              View Mode
            </>
          )}
        </Button>
      </div>
      <PriceListProductsTable
        form={form}
        isViewMode={isViewMode}
        onSave={handleSave}
        onSubmit={handleSubmit}
        isSaving={updateMutation.isPending}
        isSubmitting={submitMutation.isPending}
      />
    </div>
  );
}
