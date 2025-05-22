import { DepartmentDetailDto } from "@/dtos/config.dto";
import { formType } from "@/dtos/form.dto";

interface DepartmentDetailProps {
    readonly department?: DepartmentDetailDto;
    readonly isLoading?: boolean;
    readonly mode: formType;
}

export default function DepartmentDetail({ department, isLoading, mode }: DepartmentDetailProps) {
    return (
        <div>
            <h1>Department Detail {mode}</h1>
            {isLoading && <p>Loading...</p>}
            {department && (
                <>
                    <p>{department.name}</p>
                    <p>{department.description}</p>
                    <p>{department.is_active ? "Active" : "Inactive"}</p>
                </>
            )}
        </div>
    )
}