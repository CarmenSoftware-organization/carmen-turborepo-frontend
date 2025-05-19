"use client";

import { formType } from "@/dtos/form.dto";
import { useSearchParams } from "next/navigation";
import MainPrForm from "../components/form/MainPrForm";

export default function PurchaseRequestNewPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    return <MainPrForm mode={formType.ADD} docType={type ?? ''} />
}
