"use client";

import { useBuById } from "@/app/hooks/useBu";
import { useParams } from "next/navigation";
import BuForm from "../_components/BuForm";

export default function BuDetail() {
  const { id } = useParams();
  const { data, isLoading, error } = useBuById(id as string);

  if (error instanceof Error) return <div>Error: {error.message}</div>;
  if (isLoading) return <div>Loading...</div>;

  return <BuForm businessData={data} mode="view" />;
}
