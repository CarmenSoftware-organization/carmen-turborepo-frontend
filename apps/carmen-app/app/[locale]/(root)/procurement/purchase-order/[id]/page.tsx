import { mockPoDetail } from "@/mock-data/procurement";
import PoForm from "../components/form/PoForm";
import { formType } from "@/dtos/form.dto";

export default function PurchaseOrderDetailPage() {
    return <PoForm poData={mockPoDetail} mode={formType.VIEW} />
}