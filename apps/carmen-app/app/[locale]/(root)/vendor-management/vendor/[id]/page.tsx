"use client";

import { useAuth } from "@/context/AuthContext";
import { getVendorIdService } from "@/services/vendor.service";
import { notFound, useParams } from "next/navigation";
import VendorForm from "../components/VendorForm";
import { useEffect, useState } from "react";
import { VendorFormDto } from "@/dtos/vendor-management";

export default function EditVendor() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const [vendor, setVendor] = useState<VendorFormDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const data = await getVendorIdService(token, tenantId, params.id as string);
                setVendor(data);
            } catch (error) {
                console.error('Error fetching vendor:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [token, tenantId, params.id]);

    if (loading) return <div>Loading...</div>;
    if (!vendor) return notFound();

    return <VendorForm initialValues={vendor} />
}
