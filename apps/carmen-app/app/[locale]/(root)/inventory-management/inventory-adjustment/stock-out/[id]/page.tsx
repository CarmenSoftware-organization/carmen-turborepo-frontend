"use client";

import { DetailSkeleton } from "@/components/loading/DetailSkeleton";
import { InternalServerError } from "@/components/error-ui";
import { useAuth } from "@/context/AuthContext";
import { notFound, useParams } from "next/navigation";
import FormAdjustment from "../../_components/FormAdjustment";
import { formType } from "@/dtos/form.dto";
import axios from "axios";
import { useInventoryAdjustmentByIdQuery } from "@/hooks/use-inventory-adjustment";
import { STOCK_IN_OUT_TYPE } from "@/dtos/stock-in-out.dto";

export default function StockOutIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useInventoryAdjustmentByIdQuery(
    token,
    buCode,
    id,
    STOCK_IN_OUT_TYPE.STOCK_OUT
  );

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    if (axios.isAxiosError(error) && error.response?.status === 500) {
      return <InternalServerError />;
    }
    notFound();
  }

  if (!data) {
    notFound();
  }

  return (
    <FormAdjustment
      mode={formType.EDIT}
      form_type={STOCK_IN_OUT_TYPE.STOCK_OUT}
      initValues={data?.data}
    />
  );
}
