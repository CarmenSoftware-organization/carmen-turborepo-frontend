import { formType } from "@/dtos/form.dto";
import MainForm from "../_components/form/MainForm";

export default function NewPriceListTemplatePage() {
  return <MainForm mode={formType.ADD} />;
}
