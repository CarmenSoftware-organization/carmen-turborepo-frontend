import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { enum_workflow_type } from "@/dtos/workflows.dto";
import { useWorkflowQuery } from "@/hooks/useWorkflowQuery";

interface WorkflowDto {
    id: string;
    name: string;
}

interface PropsWorkflowLookup {
    readonly value?: string;
    readonly onValueChange: (value: string) => void;
    readonly placeholder?: string;
    readonly disabled?: boolean;
    readonly type: enum_workflow_type;
}

export default function WorkflowLookup({
    value,
    onValueChange,
    placeholder = "Select workflow",
    disabled = false,
    type
}: Readonly<PropsWorkflowLookup>) {
    const { token, tenantId } = useAuth();
    const { workflows, isLoading } = useWorkflowQuery(token, tenantId, type);
    const selectedWorkflow = workflows?.find((w: WorkflowDto) => w.id === value);

    return (
        <Select
            value={value}
            onValueChange={onValueChange}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : selectedWorkflow?.name}
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                {workflows?.map((workflow: WorkflowDto) => (
                    <SelectItem
                        key={workflow.id}
                        value={workflow.id}
                    >
                        {workflow.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}