"use client";

import { useAuth } from "@/context/AuthContext";
import { getVendorIdService } from "@/services/vendor.service";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import VendorDetail from "../components/vendor-detail";
import SignInDialog from "@/components/SignInDialog";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { VendorFormValues } from "@/dtos/vendor.dto";


export default function VendorPage() {
    const { token, tenantId } = useAuth();
    const params = useParams();
    const [vendor, setVendor] = useState<VendorFormValues>();
    const [loading, setLoading] = useState(true);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const id = params.id as string;

    useEffect(() => {
        const fetchVendor = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await getVendorIdService(token, tenantId, id);
                if (response && (response.status === 401 || response.statusCode === 401)) {
                    setLoginDialogOpen(true);
                    setLoading(false);
                    return;
                }
                if (response.error) {
                    setLoading(false);
                    return;
                }
                setVendor(response);
            } catch (error) {
                console.error('Error fetching vendor:', error);
                if (error instanceof Error && error.message.includes('401')) {
                    setLoginDialogOpen(true);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [token, tenantId, id]);

    if (loading) return <DetailLoading />

    return (
        <>
            {vendor && <VendorDetail vendor={vendor} />}
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    );
}
