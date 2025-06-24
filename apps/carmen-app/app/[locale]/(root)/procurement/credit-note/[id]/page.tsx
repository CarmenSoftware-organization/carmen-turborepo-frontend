"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useCreditNoteByIdQuery } from "@/hooks/useCreditNote";
import { useParams } from "next/navigation";
import CnForm from "../components/form/CnForm";
import { formType } from "@/dtos/form.dto";


export default function CreditNoteDetailPage() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, error } = useCreditNoteByIdQuery(token, tenantId, id);

    if (isLoading) return <DetailLoading />;

    if (error) return <div>Error loading data</div>;

  return <CnForm mode={formType.VIEW} initialValues={data?.data} />;
}