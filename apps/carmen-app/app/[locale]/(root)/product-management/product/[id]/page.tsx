"use client";

import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import SignInDialog from "@/components/SignInDialog";
import FormProduct from "../components/form/FormProduct";
import { DetailLoading } from "@/components/loading/DetailLoading";
import { useProductDetail } from "@/hooks/useProductDetail";

export default function ProductEdit() {
  const { token, buCode, isLoading: authLoading } = useAuth();
  const params = useParams();
  const id = params.id as string;

  const { product, loading, loginDialogOpen, setLoginDialogOpen } =
    useProductDetail({
      token,
      buCode,
      id,
      authLoading,
    });

  if (authLoading || (loading && token && buCode)) {
    return <DetailLoading />;
  }

  return (
    <>
      <FormProduct mode={formType.VIEW} initialValues={product} />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
