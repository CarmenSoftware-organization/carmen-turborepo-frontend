import { formType } from "@/dtos/form.dto";
import RfpMainForm from "../_components/form/RfpMainForm";
import { createMetadata } from "@/utils/metadata";

export const generateMetadata = createMetadata("RFP", "new_rfp_meta");

export default function RfpNewPage() {
  return <RfpMainForm mode={formType.ADD} />;
}
