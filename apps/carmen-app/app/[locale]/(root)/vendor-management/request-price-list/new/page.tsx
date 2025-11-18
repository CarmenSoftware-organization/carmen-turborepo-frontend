import { formType } from "@/dtos/form.dto";
import MainForm from "../_components/form/MainForm";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("RFP", "new_rfp_meta");

export default function NewRfpPage() {
  return <MainForm mode={formType.ADD} />;
}
