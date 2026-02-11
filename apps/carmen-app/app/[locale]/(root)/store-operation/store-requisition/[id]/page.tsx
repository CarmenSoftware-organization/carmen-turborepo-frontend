"use client";

import { formType } from "@/dtos/form.dto";
import FormStoreRequisition from "../_components/form/FormStoreRequisition";
import { useAuth } from "@/context/AuthContext";
import { useSrById } from "@/hooks/use-sr";
import { notFound, useParams } from "next/navigation";
import { DetailLoading } from "@/components/loading/DetailLoading";

export default function StoreRequisitionIdPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useSrById(token, buCode, id);

  if (isLoading) {
    return <DetailLoading />;
  }

  if (error) {
    notFound();
  }

  return <FormStoreRequisition mode={formType.VIEW} initData={data?.data} />;
}
