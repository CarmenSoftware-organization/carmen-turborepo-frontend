"use client";

import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import MainForm from "../_components/form-pr/MainForm";

export default function PurchaseRequestNewPage() {
  const { buCode } = useAuth();

  return <MainForm mode={formType.ADD} bu_code={buCode} />;
}
