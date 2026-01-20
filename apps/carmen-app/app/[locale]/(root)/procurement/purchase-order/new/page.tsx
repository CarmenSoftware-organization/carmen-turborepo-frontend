"use client";

import { formType } from "@/dtos/form.dto";
import PoForm from "../_components/form/PoForm";

export default function NewPurchaseOrderPage() {
  return <PoForm mode={formType.ADD} />;
}
