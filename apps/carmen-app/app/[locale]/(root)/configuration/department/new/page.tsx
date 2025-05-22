import DepartmentDetail from "../components/DepartmentDetail";
import { formType } from "@/dtos/form.dto";

export default function DepartmentNewPage() {
    return <DepartmentDetail mode={formType.ADD} />
}