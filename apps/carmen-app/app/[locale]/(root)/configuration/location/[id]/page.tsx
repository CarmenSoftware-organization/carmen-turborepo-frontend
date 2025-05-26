"use client";

import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useLocationByIdQuery } from "@/hooks/useLocation";
import { useParams } from "next/navigation";
import MainLocation from "../components/form/MainLocation";

export default function StoreLocationByIdPage() {
    const { id } = useParams();
    const { token, tenantId } = useAuth();

    const { data, isLoading, error } = useLocationByIdQuery({
        token: token,
        tenantId: tenantId,
        id: id as string
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return <MainLocation initialData={data} mode={formType.EDIT} isLoading={isLoading} />
}
