"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useCampaignById } from "@/hooks/use-campaign";
import { useParams } from "next/navigation";
import MainForm from "../_components/form/MainForm";
import { formType } from "@/dtos/form.dto";

export default function IdCampaignPage() {
  const { token, buCode } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading } = useCampaignById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return <MainForm campaignData={data} mode={formType.VIEW} />;
}
