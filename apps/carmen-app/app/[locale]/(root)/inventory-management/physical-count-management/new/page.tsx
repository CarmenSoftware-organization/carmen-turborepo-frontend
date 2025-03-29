import FormPcm from "../components/FormPcm";
import { formType } from "@/dtos/form.dto";

export default function NewPhysicalCountManagementPage() {
    return <FormPcm mode={formType.ADD} />
}
