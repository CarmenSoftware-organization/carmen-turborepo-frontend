"use client";

import { useParams } from "next/navigation";
import { formType } from "@/dtos/form.dto";
import { getPrById } from "@/services/pr.service";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import MainPrForm from "../components/form/MainPrForm";

export default function PurchaseRequestIdPage() {
    const { id } = useParams();
    const { token, tenantId } = useAuth();

    const { data: purchaseRequest, isLoading } = useQuery({
        queryKey: ['purchaseRequest', id],
        queryFn: () => getPrById(token, tenantId, id as string)
    });

    if (isLoading) return <div>Loading...</div>;

    return <MainPrForm mode={formType.VIEW} initValues={purchaseRequest} />
}
