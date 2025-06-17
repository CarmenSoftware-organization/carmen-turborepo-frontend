"use client";

import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { useLocationByIdQuery } from "@/hooks/useLocation";
import { useParams } from "next/navigation";
import LocationView from "../components/form/LocationView";
import LocationSkeleton from "@/components/loading/LocationSkeleton";

export default function StoreLocationByIdPage() {
    const { id } = useParams();
    const { token, tenantId } = useAuth();

    const { data, isLoading } = useLocationByIdQuery({
        token: token,
        tenantId: tenantId,
        id: id as string
    });

    if (isLoading) {
        return <LocationSkeleton />;
    }

    return <LocationView initialData={data} mode={formType.VIEW} />
}

