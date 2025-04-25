"use client";

import SignInDialog from "@/components/SignInDialog";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { VendorFormDto } from "@/dtos/vendor-management";
import { getVendorIdService } from "@/services/vendor.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import FormVendor from "../components/FormVendor";

export default function VendorIdPage() {

    const { token, tenantId, isLoading: authLoading } = useAuth();
    const params = useParams();
    const id = typeof params.id === 'string' ? params.id : params.id[0];
    const [vendor, setVendor] = useState<VendorFormDto>();
    const [loading, setLoading] = useState(true);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    useEffect(() => {
        if (!token || !tenantId || authLoading) {
            return;
        }
        const fetchVendor = async () => {
            try {
                const data = await getVendorIdService(token, tenantId, id);
                if (data.statusCode === 401) {
                    setLoginDialogOpen(true);
                    return;
                }
                console.log('data', data);
                setVendor(data);
            } catch (error) {
                console.error('Error fetching vendor:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchVendor();
    }, [token, tenantId, id, authLoading]);

    if (authLoading || loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <FormVendor mode={formType.VIEW} initialValues={vendor} />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    );
}
