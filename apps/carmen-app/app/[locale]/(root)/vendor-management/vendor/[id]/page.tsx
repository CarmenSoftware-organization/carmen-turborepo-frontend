"use client";

import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";
import { DetailLoading } from "@/components/loading/DetailLoading";
import VendorDetail from "../components/VendorDetail";
import { useAuth } from "@/context/AuthContext";
import { useVendorById } from "@/hooks/useVendor";
import { useState } from "react";

export default function VendorPage() {
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { vendor, isLoading } = useVendorById(token, buCode, id);

  if (isLoading) return <DetailLoading />;

  return (
    <>
      {vendor && <VendorDetail vendor={vendor} />}
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
