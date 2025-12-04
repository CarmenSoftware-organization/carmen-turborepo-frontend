"use client";

import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useVendorById } from "@/hooks/use-vendor";
import { useState } from "react";
import VendorForm from "../_components/form/VendorForm";
import { formType } from "@/dtos/form.dto";

export default function VendorPage() {
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { vendor, isLoading } = useVendorById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return (
    <>
      {vendor && <VendorForm mode={formType.VIEW} initData={vendor} />}
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
