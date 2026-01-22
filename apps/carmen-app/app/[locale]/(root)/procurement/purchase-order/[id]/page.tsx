"use client";

import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePoIdQuery } from "@/hooks/use-po";
import PoForm from "../_components/form/PoForm";
import { formType } from "@/dtos/form.dto";
import { DetailLoading } from "@/components/loading/DetailLoading";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PurchaseOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { token, buCode } = useAuth();
  const { po, isLoading } = usePoIdQuery(token, buCode, id);

  if (isLoading) {
    return <DetailLoading />;
  }

  return <PoForm poData={po} mode={formType.VIEW} />;
}
