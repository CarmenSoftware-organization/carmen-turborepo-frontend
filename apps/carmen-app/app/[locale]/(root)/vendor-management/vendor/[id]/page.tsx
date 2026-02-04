"use client";

import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import SignInDialog from "@/components/SignInDialog";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useAuth } from "@/context/AuthContext";
import { useVendorById } from "@/hooks/use-vendor";
import { formType } from "@/dtos/form.dto";
import { transformVendorData } from "@/dtos/vendor.dto";
import FormVendor from "../_components/form/FormVendor";

export default function VendorPage() {
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const params = useParams();
  const id = params.id as string;
  const { vendor, isLoading } = useVendorById(token, buCode, id);

  const formData = useMemo(() => {
    if (!vendor) return undefined;
    return transformVendorData(vendor);
  }, [vendor]);

  if (isLoading) return <DetailLoading />;

  return (
    <>
      {formData && <FormVendor mode={formType.VIEW} initData={formData} />}
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
