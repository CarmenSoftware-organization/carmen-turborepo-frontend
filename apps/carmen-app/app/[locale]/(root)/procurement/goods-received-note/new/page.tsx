import { formType } from "@/dtos/form.dto";
import FormGrn from "../_components/form/FormGrn";

export default function GoodsReceivedNoteNewPage() {
    return <FormGrn mode={formType.ADD} />
}