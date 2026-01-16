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
import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { useWorkflowTypeQuery } from "@/hooks/use-workflow";

interface WorkflowDto {
  id: string;
  name: string;
}

interface PropsWorkflowLookup {
  readonly value?: string;
  readonly onValueChange: (value: string) => void;
  readonly onSelectObject?: (workflow: WorkflowDto | null) => void;
  readonly disabled?: boolean;
  readonly type: enum_workflow_type;
  readonly bu_code: string;
}

export default function LookupWorkflow({
  value,
  onValueChange,
  onSelectObject,
  disabled = false,
  type,
  bu_code,
}: Readonly<PropsWorkflowLookup>) {
  const { token, buCode } = useAuth();
  const currentBuCode = bu_code ?? buCode;
  const { workflows, isLoading } = useWorkflowTypeQuery(token, currentBuCode, type);
  const t = useTranslations("Workflow");

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    if (onSelectObject && workflows?.data) {
      const selectedWorkflow = workflows.data.find((w: WorkflowDto) => w.id === newValue) || null;
      onSelectObject(selectedWorkflow);
    }
  };

  let selectContent;

  if (isLoading) {
    selectContent = (
      <SelectItem value="loading" disabled>
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </SelectItem>
    );
  } else if (!workflows || workflows.length === 0) {
    selectContent = (
      <SelectItem value="empty" disabled>
        {t("no_workflow_history")}
      </SelectItem>
    );
  } else {
    selectContent = workflows?.data.map((workflow: WorkflowDto) => (
      <SelectItem key={workflow.id} value={workflow.id}>
        {workflow.name}
      </SelectItem>
    ));
  }

  return (
    <Select value={value || ""} onValueChange={handleValueChange} disabled={disabled || isLoading}>
      <SelectTrigger
        className={cn("w-full text-sm", disabled ? "bg-muted cursor-not-allowed" : "")}
      >
        <SelectValue placeholder={t("select_workflow")} />
      </SelectTrigger>
      <SelectContent>{selectContent}</SelectContent>
    </Select>
  );
}
