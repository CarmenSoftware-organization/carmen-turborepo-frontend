import PrForm from "../components/PrForm";
import { formType } from "@/dtos/form.dto";

export default function PurchaseRequestNewPage() {
    return <PrForm mode={formType.ADD} />
}
