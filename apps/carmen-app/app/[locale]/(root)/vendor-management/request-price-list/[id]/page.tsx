"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { useRfpById } from "@/hooks/use-rfp";
import RfpMainForm from "../_components/form/RfpMainForm";

export default function RfpEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { token, buCode } = useAuth();
  const { data: rfp, isLoading } = useRfpById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return <RfpMainForm mode={formType.VIEW} rfpData={rfp} />;
}
