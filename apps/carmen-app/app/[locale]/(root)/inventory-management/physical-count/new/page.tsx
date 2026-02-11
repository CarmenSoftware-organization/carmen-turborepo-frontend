import FormPcm from "../_components/FormPcm";
import { formType } from "@/dtos/form.dto";

export default function NewPhysicalCountPage() {
  return <FormPcm mode={formType.ADD} />;
}
