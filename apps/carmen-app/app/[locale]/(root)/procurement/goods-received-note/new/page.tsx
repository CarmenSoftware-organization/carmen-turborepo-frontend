import { formType } from "@/dtos/form.dto";
import FormGrn from "../components/form/FormGrn";

export default function GoodsReceivedNoteNewPage() {
    return <FormGrn mode={formType.ADD} />
}