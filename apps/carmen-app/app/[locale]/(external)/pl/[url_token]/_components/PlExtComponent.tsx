"use client";

import { usePriceListExternal } from "../_hooks/use-price-list-external";
import { Unauthorized, InternalServerError } from "@/components/error-ui";
import { AxiosError } from "axios";
import PriceListHeader from "./PriceListHeader";
import PriceListProductsTable from "./PriceListProductsTable";
import { CatLoading } from "@/components/error-ui/illustrations";
import { useTranslations } from "next-intl";

interface PlExtComponentProps {
  urlToken: string;
}

export default function PlExtComponent({ urlToken }: PlExtComponentProps) {
  const { data, isLoading, isError, error } = usePriceListExternal(urlToken);
  const tCommon = useTranslations("Common");
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
      <PriceListProductsTable items={data.tb_pricelist_detail} />
    </div>
  );
}
