"use client";

import { useAuth } from "@/context/AuthContext";
import { usePriceListById } from "@/hooks/usePriceList";
import { useParams } from "next/navigation";
import DetailPriceList from "../_components/DetailPriceList";

export default function PriceListDetailPage() {
    const { token, buCode } = useAuth();
    const { id } = useParams();

    const { data: priceListDetail, isLoading, error, isUnauthorized } = usePriceListById(token, buCode, id as string);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (isUnauthorized) {
        return <div>Unauthorized</div>;
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <DetailPriceList priceList={priceListDetail.data} />
}
