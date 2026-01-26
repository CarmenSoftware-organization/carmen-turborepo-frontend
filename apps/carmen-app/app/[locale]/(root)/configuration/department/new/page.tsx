import { formType } from "@/dtos/form.dto";
import FormDepartment from "../_components/dp-form/FormDepartment";

export default function DepartmentNewPage() {
  return <FormDepartment mode={formType.ADD} />;
}
