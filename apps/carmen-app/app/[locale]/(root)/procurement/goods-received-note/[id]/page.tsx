"use client";

import { formType } from "@/dtos/form.dto";
import FormGrn from "../components/form/FormGrn";
import { getGrnById } from "@/services/grn.service";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DetailLoading } from "@/components/loading/DetailLoading";

export default function GoodsReceivedNoteIdPage() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, error } = useQuery({
        queryKey: ["grn", id],
        queryFn: async () => {
            return getGrnById(token, tenantId, id);
        },
    });

    if (isLoading) {
        return <DetailLoading />;
    }

    if (error) {
        return <div>Error loading data</div>;
    }

    // Log initial data
    console.log("=== GRN Data from API ===");
    console.log("API Data:", data);

    return (
        <div>
            <FormGrn mode={formType.VIEW} initialValues={data} />
        </div>
    )
}

