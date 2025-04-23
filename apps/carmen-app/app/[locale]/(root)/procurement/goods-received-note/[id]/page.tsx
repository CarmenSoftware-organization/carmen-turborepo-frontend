import { formType } from "@/dtos/form.dto";
import FormGrn from "../components/form/FormGrn";

export default function GoodsReceivedNoteIdPage() {
    return <FormGrn mode={formType.VIEW} />;
}

