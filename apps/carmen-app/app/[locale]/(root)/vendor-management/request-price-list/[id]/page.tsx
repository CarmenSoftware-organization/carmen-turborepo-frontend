"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useRfpById } from "@/hooks/use-rfp";
import { useParams } from "next/navigation";
import MainForm from "../_components/form/MainForm";
import { formType } from "@/dtos/form.dto";

export default function IdRfpPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useRfpById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return <MainForm rfpData={data} mode={formType.VIEW} />;
}
