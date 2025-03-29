import { PhysicalCountDto } from "@/dtos/inventory-management.dto";
import { formType } from "@/dtos/form.dto";

interface FormPcmProps {
    readonly mode: formType;
    readonly initialValues?: PhysicalCountDto;
}

export default function FormPcm({ mode, initialValues }: FormPcmProps) {
    return (
        <div>
            <h1>{mode === formType.ADD ? "New Physical Count" : "Edit Physical Count"}</h1>
            {initialValues && (
                <div>
                    <h2>Physical Count Details</h2>
                    <p>ID: {initialValues.id}</p>
                    <p>Department: {initialValues.department}</p>
                </div>
            )}
        </div>
    )
}
