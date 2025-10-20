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
    const { token, buCode } = useAuth();
    const { workflows, isLoading } = useWorkflowQuery(token, buCode, type);

    let selectContent;

    if (isLoading) {
        selectContent = (
            <SelectItem value="loading" disabled>
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                </div>
            </SelectItem>
        );
    } else if (!workflows || workflows.length === 0) {
        selectContent = (
            <SelectItem value="empty" disabled>
                No workflows found
            </SelectItem>
        );
    } else {
        selectContent = workflows.map((workflow: WorkflowDto) => (
            <SelectItem
                key={workflow.id}
                value={workflow.id}
            >
                {workflow.name}
            </SelectItem>
        ));
    }

    return (
        <Select
            value={value || undefined}
            onValueChange={onValueChange}
            disabled={disabled || isLoading}
        >
            <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {selectContent}
            </SelectContent>
        </Select>
    );
}