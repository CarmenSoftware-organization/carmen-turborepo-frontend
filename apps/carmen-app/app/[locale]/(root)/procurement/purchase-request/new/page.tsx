"use client";

import { formType } from "@/dtos/form.dto";
import { useAuth } from "@/context/AuthContext";
import MainForm from "../_components/form-pr/MainForm";
import ErrorBoundary from "../_components/ErrorBoundary";

export default function PurchaseRequestNewPage() {
  const { buCode } = useAuth();

  return (
    <ErrorBoundary>
      <MainForm mode={formType.ADD} bu_code={buCode} />
    </ErrorBoundary>
  );
}
