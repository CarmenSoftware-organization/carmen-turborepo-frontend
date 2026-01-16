import { formType } from "@/dtos/form.dto";
import PrtForm from "../_components/form/PrtForm";

export default function PurchaseRequestTemplateDetailPage() {
  return <PrtForm mode={formType.VIEW} prtData={mockDetail} />;
}
