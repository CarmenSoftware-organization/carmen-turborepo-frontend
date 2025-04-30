"use client";

import { useAuth } from "@/context/AuthContext";
import { getVendorIdService } from "@/services/vendor.service";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { VendorFormValues } from "@/dtos/vendor.dto";
import { formType } from "@/dtos/form.dto";
import VendorDetail from "../components/vendor-detail";
import VendorForm from "../components/vendor-form";

export default function VendorPage() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const isEditMode = mode === 'edit';

    const [vendor, setVendor] = useState<VendorFormValues | null>(null);
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

    if (isEditMode) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-screen-xl mx-auto">
                    <h1 className="text-lg font-medium text-gray-800 mb-4">Edit Vendor</h1>
                    <VendorForm mode={formType.EDIT} initData={vendor} />
                </div>
            </div>
        );
    }

    return (
        <VendorDetail vendor={vendor} />
    );
}
