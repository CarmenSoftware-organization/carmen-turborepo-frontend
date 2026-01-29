"use client";

import { DetailSkeleton } from "@/components/loading/DetailSkeleton";
import { InternalServerError } from "@/components/error-ui";
import { useAuth } from "@/context/AuthContext";
import { ADJUSTMENT_TYPE } from "@/dtos/adjustment-type.dto";
import { useAdjustmentTypeByIdQuery } from "@/hooks/use-adjustment-type";
import { notFound, useParams } from "next/navigation";
import FormAdjustment from "../../components/FormAdjustment";
import { formType } from "@/dtos/form.dto";
import axios from "axios";

export default function StockInIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useAdjustmentTypeByIdQuery(
    token,
    buCode,
    id,
    ADJUSTMENT_TYPE.STOCK_IN
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
      form_type={ADJUSTMENT_TYPE.STOCK_IN}
      initValues={data?.data}
    />
  );
}
