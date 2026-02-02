"use client";

import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useAdjustmentTypeByIdQuery } from "@/hooks/use-adjustment-type";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";
import FormAdjustmentType from "../_components/FormAdjustmentType";

export default function AdjustmentTypeIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useAdjustmentTypeByIdQuery(token, buCode, id);

  if (error) {
    notFound();
  }

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return <FormAdjustmentType defaultValues={data?.data} mode={formType.VIEW} />;
}
