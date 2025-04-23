import { formType } from "@/dtos/form.dto";
import FormGrn from "../components/form/FormGrn";
import { mockGrnDataById } from "../type.dto";

export default function GoodsReceivedNoteIdPage() {
    return <FormGrn mode={formType.VIEW} initialValues={mockGrnDataById} />;
}

