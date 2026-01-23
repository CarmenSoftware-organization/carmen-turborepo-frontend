"use client";

import { formType } from "@/dtos/form.dto";
import FormProduct from "../_components/form/FormProduct";
import { useAuth } from "@/context/AuthContext";

export default function ProductNew() {
  const { token, buCode } = useAuth();

  return <FormProduct mode={formType.ADD} token={token} buCode={buCode} />;
}