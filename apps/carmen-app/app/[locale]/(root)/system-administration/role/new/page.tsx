import { formType } from "@/dtos/form.dto";
import RoleForm from "../_components/form/RoleForm";

export default function RoleNewPage() {
  return <RoleForm mode={formType.ADD} />;
}
