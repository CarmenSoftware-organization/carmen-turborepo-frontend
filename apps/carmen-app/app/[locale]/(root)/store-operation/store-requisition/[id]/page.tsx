import { formType } from "@/dtos/form.dto";
import FormStoreRequisition from "../components/form/FormStoreRequisition";

export default function StoreRequisitionIdPage() {
    return <FormStoreRequisition mode={formType.EDIT} />
}

