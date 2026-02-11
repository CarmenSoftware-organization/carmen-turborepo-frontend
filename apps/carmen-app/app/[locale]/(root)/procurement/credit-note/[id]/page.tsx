"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useCreditNoteByIdQuery } from "../_hooks/use-credit-note";
import { notFound, useParams } from "next/navigation";
import CnForm from "../_components/form/CnForm";
import { formType } from "@/dtos/form.dto";


export default function CreditNoteDetailPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, error } = useCreditNoteByIdQuery(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  if (error) {
    notFound();
  }

  return <CnForm mode={formType.VIEW} initialValues={data?.data} />;
}