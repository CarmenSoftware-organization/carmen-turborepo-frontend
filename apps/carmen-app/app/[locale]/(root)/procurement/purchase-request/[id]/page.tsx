"use client";

import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { getPrByIdService } from "@/services/pr.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";
import MainForm from "../components/pr-form/MainForm";

export default function PurchaseRequestIdPage() {
    const { id } = useParams();
    const { token, tenantId } = useAuth();

    const { data: purchaseRequest, isLoading } = useQuery({
        queryKey: ['purchaseRequest', id],
        queryFn: () => getPrByIdService(token, tenantId, id as string)
    });

    const getLocationAndProductId = purchaseRequest?.data?.purchase_request_detail.map(
        (item: any) => ({
            location_id: item.location_id,
            product_id: item.product_id,
        })
    );

    console.log('getLocationAndProductId', getLocationAndProductId);



    if (isLoading) return <DetailLoading />

    return <MainForm mode={formType.VIEW} initValues={purchaseRequest?.data} />
}
