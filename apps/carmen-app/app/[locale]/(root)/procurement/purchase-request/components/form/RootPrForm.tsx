import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";

interface RootPrFormProps {
    readonly mode: formType;
    readonly initValues: PurchaseRequestByIdDto;
}

export default function RootPrForm({
    mode,
    initValues }: RootPrFormProps) {
    return <div>RootPrForm</div>;
}