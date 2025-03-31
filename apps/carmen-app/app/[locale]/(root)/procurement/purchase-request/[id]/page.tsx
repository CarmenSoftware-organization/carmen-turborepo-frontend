"use client";

import { mockPurchaseRequests } from "@/mock-data/procurement";
import { useParams } from "next/navigation";
import PrForm from "../components/PrForm";
import { formType } from "@/dtos/form.dto";

export default function PurchaseRequestIdPage() {
    const { id } = useParams();
    const purchaseRequest = mockPurchaseRequests.find(purchaseRequest => purchaseRequest.id === id);
    return <PrForm mode={formType.EDIT} initValues={purchaseRequest} />
}
