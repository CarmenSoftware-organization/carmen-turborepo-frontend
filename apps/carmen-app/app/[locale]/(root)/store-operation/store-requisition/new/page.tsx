import { formType } from "@/dtos/form.dto";
import FormStoreRequisition from "../components/form/FormStoreRequisition";

export default function StoreRequisitionNewPage() {
    return <FormStoreRequisition mode={formType.ADD} />
}


