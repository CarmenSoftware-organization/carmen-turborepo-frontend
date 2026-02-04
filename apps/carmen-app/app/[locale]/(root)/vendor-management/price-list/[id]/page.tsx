"use client";

import { useAuth } from "@/context/AuthContext";
import { usePriceListById } from "@/hooks/use-price-list";
import { useParams } from "next/navigation";
import DetailPriceList from "../_components/form/FormDetailPriceList";
import { formType } from "@/dtos/form.dto";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { InternalServerError, Unauthorized } from "@/components/error-ui";

export default function PriceListDetailPage() {
  const { token, buCode } = useAuth();
  const { id } = useParams();

  const {
    data: priceListDetail,
    isLoading,
    error,
    isUnauthorized,
  } = usePriceListById(token, buCode, id as string);

  if (error) {
    return <InternalServerError />;
  }

  if (isUnauthorized) {
    return <Unauthorized />;
  }

  if (isLoading) {
    return <DetailLoading />;
  }

  return <DetailPriceList priceList={priceListDetail.data} mode={formType.VIEW} />;
}
