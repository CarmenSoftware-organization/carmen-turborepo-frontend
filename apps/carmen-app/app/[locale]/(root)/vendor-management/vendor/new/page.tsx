import { formType } from "@/dtos/form.dto";
import { Metadata } from "next";
import FormVendor from "../_components/form/FormVendor";

export const metadata: Metadata = {
  title: "New Vendor",
};

export default function NewVendor() {
  return <FormVendor mode={formType.ADD} />;
}
