"use client";

import { useParams, notFound } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { getOnHandOnOrderService } from "@/services/on-hand-on-order.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";
import MainForm from "../../_components/form-pr/MainForm";
import { usePurchaseRequestById } from "@/hooks/use-purchase-request";
import { useEffect } from "react";
import ErrorBoundary from "../../_components/ErrorBoundary";

export default function PurchaseRequestIdPage() {
  const { id, bu_code } = useParams();
  const { token } = useAuth();

  const currentBuCode = bu_code as string;

  const {
    purchaseRequest,
    isLoading: isPrLoading,
    error,
  } = usePurchaseRequestById(token, currentBuCode, id as string);

  useEffect(() => {
    if (!isPrLoading && error) {
      notFound();
    }
  }, [isPrLoading, error]);

  const { data: prDataWithInventory, isLoading: isInventoryLoading } = useQuery({
    queryKey: ["purchaseRequestWithInventory", id, purchaseRequest?.data],
    queryFn: async (): Promise<PurchaseRequestByIdDto> => {
      if (!purchaseRequest?.data?.purchase_request_detail) {
        throw new Error("No purchase request data available");
      }

      const detailsWithInventory = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        purchaseRequest.data.purchase_request_detail.map(async (detail: any) => {
          const inventoryData = await getOnHandOnOrderService(
            token,
            currentBuCode,
            detail.location_id,
            detail.product_id
          );
          return {
            ...detail,
            ...inventoryData,
          };
        })
      );
      return {
        ...purchaseRequest.data,
        purchase_request_detail: detailsWithInventory,
      };
    },
    enabled: !!purchaseRequest?.data?.purchase_request_detail && !!token && !!currentBuCode,
  });

  if (isPrLoading || isInventoryLoading) return <DetailLoading />;

  if (!prDataWithInventory) return <DetailLoading />;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (
    <ErrorBoundary>
      <MainForm
        mode={formType.VIEW}
        initValues={prDataWithInventory as any}
        bu_code={currentBuCode}
      />
    </ErrorBoundary>
  );
}
