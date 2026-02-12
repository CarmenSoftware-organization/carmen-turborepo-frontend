import { formType } from "@/dtos/form.dto";
import PrtForm from "../_components/form/PrtForm";

export default function PurchaseRequestTemplateNewPage() {
  return <PrtForm mode={formType.ADD} />;
}
