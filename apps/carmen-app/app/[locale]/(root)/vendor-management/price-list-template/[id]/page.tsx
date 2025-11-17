"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { usePriceListTemplateById } from "@/hooks/use-price-list-template";
import { useParams } from "next/navigation";
import MainForm from "../_components/form/MainForm";
import { formType } from "@/dtos/form.dto";

export default function IdPriceListTemplatePage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = usePriceListTemplateById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return <MainForm templateData={data} mode={formType.VIEW} />;
}
