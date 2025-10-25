import { formType } from "@/dtos/form.dto";
import FormStoreRequisition from "../_components/form/FormStoreRequisition";

export default function StoreRequisitionNewPage() {
    return <FormStoreRequisition mode={formType.ADD} />
}


