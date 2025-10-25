import FormPcm from "../_components/FormPcm";
import { formType } from "@/dtos/form.dto";

export default function NewPhysicalCountManagementPage() {
    return <FormPcm mode={formType.ADD} />
}
