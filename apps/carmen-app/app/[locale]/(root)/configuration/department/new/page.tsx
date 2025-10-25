import DepartmentDetail from "../_components/DepartmentDetail";
import { formType } from "@/dtos/form.dto";

export default function DepartmentNewPage() {
    return <DepartmentDetail mode={formType.ADD} />
}