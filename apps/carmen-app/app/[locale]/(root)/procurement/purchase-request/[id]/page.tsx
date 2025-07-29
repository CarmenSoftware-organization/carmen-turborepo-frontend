"use client";

import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { getPrByIdService } from "@/services/pr.service";
import { getOnHandOnOrderService } from "@/services/on-hand-on-order.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";
import MainForm from "../components/form-pr/MainForm";

export default function PurchaseRequestIdPage() {
    const { id } = useParams();
    const { token, tenantId } = useAuth();

    const { data: purchaseRequest, isLoading: isPrLoading } = useQuery({
        queryKey: ['purchaseRequest', id],
        queryFn: () => getPrByIdService(token, tenantId, id as string)
    });

    const { data: prDataWithInventory, isLoading: isInventoryLoading } = useQuery({
        queryKey: ['purchaseRequestWithInventory', id, purchaseRequest?.data],
        queryFn: async (): Promise<PurchaseRequestByIdDto> => {
            if (!purchaseRequest?.data?.purchase_request_detail) {
                throw new Error('No purchase request data available');
            }

            const detailsWithInventory = await Promise.all(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                purchaseRequest.data.purchase_request_detail.map(async (detail: any) => {
                    const inventoryData = await getOnHandOnOrderService(
                        token,
                        tenantId,
                        detail.location_id,
                        detail.product_id
                    );
                    return {
                        ...detail,
                        ...inventoryData
                    };
                })
            );
            return {
                ...purchaseRequest.data,
                purchase_request_detail: detailsWithInventory
            };
        },
        enabled: !!purchaseRequest?.data?.purchase_request_detail && !!token && !!tenantId,
    });

    if (isPrLoading || isInventoryLoading) return <DetailLoading />

    if (!prDataWithInventory) return <DetailLoading />

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <MainForm mode={formType.VIEW} initValues={prDataWithInventory as any} />
}
