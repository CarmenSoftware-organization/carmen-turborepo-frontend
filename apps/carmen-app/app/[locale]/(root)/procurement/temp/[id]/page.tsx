"use client";

import { formType } from "@/dtos/form.dto";
import FormGrn from "../components/form/FormGrn";
import { getGrnById } from "@/services/grn.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useGrnByIdQuery } from "@/hooks/use-grn";

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

