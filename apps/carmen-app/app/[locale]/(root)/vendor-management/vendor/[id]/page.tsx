"use client";

import SignInDialog from "@/components/SignInDialog";
import { useAuth } from "@/context/AuthContext";
import { VendorFormDto } from "@/dtos/vendor-management";
import { getVendorIdService } from "@/services/vendor.service";
import { useParams, notFound } from "next/navigation";
import { useEffect, useState } from "react";
import VendorDetail from "../components/VendorDetail";
import VendorForm from "../components/VendorForm";
import { getVendorByIdService } from "@/services/vendor.service";

interface EditVendorProps {
    params: {
        id: string;
    };
}

export default async function EditVendor({ params }: EditVendorProps) {
    const { token, tenantId } = useAuth();
    const vendor = await getVendorIdService(token, tenantId, params.id);

    if (!vendor) {
        notFound();
    }

    return (
        <div className="container mx-auto py-6">
            <VendorForm initialValues={vendor} />
        </div>
    );
}
