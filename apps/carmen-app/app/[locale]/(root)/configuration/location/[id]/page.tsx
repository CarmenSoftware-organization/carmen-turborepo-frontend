"use client";

import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useLocationByIdQuery } from "@/hooks/use-locations";
import { useParams } from "next/navigation";
import LocationView from "../_components/form/LocationView";
import { DetailSkeleton } from "@/components/loading/DetailSkeleton";

export default function StoreLocationByIdPage() {
  const { id } = useParams();
  const { token, buCode } = useAuth();

  const { data, isLoading } = useLocationByIdQuery({
    token: token,
    buCode: buCode,
    id: id as string,
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  return <LocationView initialData={data.data} mode={formType.VIEW} />;
}
