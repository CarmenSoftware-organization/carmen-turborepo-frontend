"use client";

import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { getPrByIdService } from "@/services/pr.service";
import { getOnHandOnOrderService } from "@/services/on-hand-on-order.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";
import MainForm from "../components/pr-form/MainForm";
import { PurchaseRequestByIdDto } from "@/dtos/pr.dto";

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

            // Get inventory data for each detail
            const detailsWithInventory = await Promise.all(
                purchaseRequest.data.purchase_request_detail.map(async (detail: any) => {
                    const inventoryData = await getOnHandOnOrderService(
                        token,
                        tenantId,
                        detail.location_id,
                        detail.product_id
                    );

                    // Merge inventory data directly into the detail
                    return {
                        ...detail,
                        ...inventoryData
                    };
                })
            );

            // Create merged PR data
            return {
                ...purchaseRequest.data,
                purchase_request_detail: detailsWithInventory
            };
        },
        enabled: !!purchaseRequest?.data?.purchase_request_detail && !!token && !!tenantId,
    });

    if (isPrLoading || isInventoryLoading) return <DetailLoading />

    if (!prDataWithInventory) return <DetailLoading />

    console.log('prDataWithInventory', prDataWithInventory);

    return <MainForm mode={formType.VIEW} initValues={prDataWithInventory} />
}
