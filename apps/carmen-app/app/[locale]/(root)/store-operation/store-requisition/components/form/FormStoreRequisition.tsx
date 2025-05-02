import { formType } from "@/dtos/form.dto";
import { StoreRequisitionDto } from "@/dtos/store-operation.dto";

interface FormStoreRequisitionProps {
    readonly initData?: StoreRequisitionDto;
    readonly mode: formType;
}

export default function FormStoreRequisition({ initData, mode }: FormStoreRequisitionProps) {
    return (
        <div>
            <h1>Mode: {mode}</h1>

            {initData && (
                <div>
                    <pre>{JSON.stringify(initData, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}




