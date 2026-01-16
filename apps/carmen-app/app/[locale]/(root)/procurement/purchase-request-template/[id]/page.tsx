"use client";

import { formType } from "@/dtos/form.dto";
import PrtForm from "../_components/form/PrtForm";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { usePrTemplateByIdQuery } from "@/hooks/use-pr-tmpl";
import { DetailLoading } from "@/components/loading/DetailLoading";

export default function PurchaseRequestTemplateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { token, buCode } = useAuth();

  const { prTemplate, isLoading } = usePrTemplateByIdQuery(token, buCode, id);

  if (isLoading) {
    return <DetailLoading />;
  }

  return <PrtForm mode={formType.VIEW} prtData={prTemplate} />;
}
