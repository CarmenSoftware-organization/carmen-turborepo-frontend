"use client";

import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePoIdQuery } from "@/hooks/use-po";
import PoForm from "../_components/form/PoForm";
import { formType } from "@/dtos/form.dto";
import { Loader2 } from "lucide-react";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { ErrorBoundary } from "@sentry/nextjs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PurchaseOrderDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const { token, buCode } = useAuth();
  const { po, isLoading, error } = usePoIdQuery(token, buCode, id);

  if (isLoading) {
    return <DetailLoading />;
  }

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center min-h-[400px]">
  //       <p className="text-destructive">Failed to load purchase order</p>
  //     </div>
  //   );
  // }

  return <PoForm poData={po} mode={formType.VIEW} />;
}
