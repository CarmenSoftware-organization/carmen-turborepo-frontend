"use client";

import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useGrnByIdQuery } from "@/hooks/use-grn";
import { useParams } from "next/navigation";
import FormGrn from "../_components/form/FormGrn";
import { formType } from "@/dtos/form.dto";

export default function GoodsReceivedNoteIdPage() {
    const { token, buCode } = useAuth();
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, error } = useGrnByIdQuery(token, buCode, id);

    const grnData = data?.data;

    if (isLoading) {
        return <DetailLoading />;
    }

    if (error) {
        return <div>Error loading data</div>;
    }
    return <FormGrn mode={formType.VIEW} initialValues={grnData} />
}