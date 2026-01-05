"use client";

import { useAuth } from "@/context/AuthContext";
import { usePriceListById } from "@/hooks/use-price-list";
import { useParams } from "next/navigation";
import DetailPriceList from "../_components/form/FormDetailPriceList";
import { formType } from "@/dtos/form.dto";

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
    return <div>Error: {error.message}</div>;
  }

  if (isUnauthorized) {
    return <div>Unauthorized</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <DetailPriceList priceList={priceListDetail.data} mode={formType.VIEW} />;
}
