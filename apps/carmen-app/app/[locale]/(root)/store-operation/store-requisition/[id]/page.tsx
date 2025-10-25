import { formType } from "@/dtos/form.dto";
import FormStoreRequisition from "../_components/form/FormStoreRequisition";
import { mockStoreRequisitionId } from "@/mock-data/store-operation";
export default function StoreRequisitionIdPage() {
    return <FormStoreRequisition mode={formType.VIEW} initData={mockStoreRequisitionId} />
}

