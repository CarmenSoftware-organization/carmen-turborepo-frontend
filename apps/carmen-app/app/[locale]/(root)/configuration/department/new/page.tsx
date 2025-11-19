import MainForm from "../_components/form/MainForm";
import { formType } from "@/dtos/form.dto";

export default function DepartmentNewPage() {
  return <MainForm mode={formType.ADD} />;
}