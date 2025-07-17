"use client";

import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useVendorDetail } from "@/hooks/useVendorDetail";
import VendorDetail from "../components/VendorDetail";

export default function VendorPage() {
    const params = useParams();
    const id = params.id as string;

    const {
        vendor,
        loading,
        loginDialogOpen,
        setLoginDialogOpen
    } = useVendorDetail(id);

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
