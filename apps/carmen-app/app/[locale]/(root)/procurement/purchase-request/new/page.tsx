"use client";

import { formType } from "@/dtos/form.dto";
import { useSearchParams } from "next/navigation";
import MainForm from "../components/form-pr/MainForm";

export default function PurchaseRequestNewPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type');

    return <MainForm mode={formType.ADD} />
}
