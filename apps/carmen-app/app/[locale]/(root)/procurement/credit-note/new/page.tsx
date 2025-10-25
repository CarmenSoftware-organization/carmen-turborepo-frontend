import CnForm from "../_components/form/CnForm";
import { formType } from "@/dtos/form.dto";

export default function CreditNoteNewPage() {
  return <CnForm mode={formType.ADD} />;
}