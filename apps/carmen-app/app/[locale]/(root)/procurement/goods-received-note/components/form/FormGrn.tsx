"use client";

import { formType } from "@/dtos/form.dto";
import { GrnFormPayloadDto } from "./grn_payload";

interface FormGrnProps {
  readonly mode: formType;
  readonly initialValues?: GrnFormPayloadDto;
}

export default function FormGrn({ mode, initialValues }: FormGrnProps) {
  

  return (
    <div>
      {/* Form implementation goes here */}
      <h1>{mode === formType.ADD? "Create GRN" : "Edit GRN"}</h1>
      {/* Use initialValues to pre-populate form fields if available */}
      {initialValues && (
        <pre>{JSON.stringify(initialValues, null, 2)}</pre>
      )}
    </div>
  );
}
