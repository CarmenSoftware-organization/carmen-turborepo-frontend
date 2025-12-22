"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { useRfpById } from "@/hooks/use-rfp";
import RfpMainForm from "../_components/form/RfpMainForm";

export default function RfpEditPage({ params }: { params: { id: string } }) {
  const { token, buCode } = useAuth();
  const { data: rfp, isLoading } = useRfpById(token, buCode, params.id);

  if (isLoading) return <div>Loading...</div>;

  return <RfpMainForm mode={formType.VIEW} rfpData={rfp} />;
}
