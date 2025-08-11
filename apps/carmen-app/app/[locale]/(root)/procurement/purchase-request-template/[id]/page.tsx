import { formType } from "@/dtos/form.dto";
import PrtForm from "../components/form/PrtForm";
import { mockDetail } from "./mockDetail";


export default function PurchaseRequestTemplateDetailPage() {
    return <PrtForm mode={formType.VIEW} prtData={mockDetail} />
}