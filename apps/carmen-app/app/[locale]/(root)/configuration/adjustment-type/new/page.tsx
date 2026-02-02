"use client";

import { formType } from "@/dtos/form.dto";
import FormAdjustmentType from "../_components/form-adjustment-type/FormAdjustmentType";

export default function AdjustmentTypeNewPage() {
  return <FormAdjustmentType mode={formType.ADD} />;
}
