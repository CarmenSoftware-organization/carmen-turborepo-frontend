import { formType } from "@/dtos/form.dto";
import MainForm from "../_components/form/MainForm";

export default function NewCampaignPage() {
  return <MainForm mode={formType.ADD} />;
}
