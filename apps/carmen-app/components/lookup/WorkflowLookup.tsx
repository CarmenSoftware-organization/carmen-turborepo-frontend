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
import { useTranslations } from "next-intl";

interface WorkflowDto {
  id: string;
  name: string;
}

interface PropsWorkflowLookup {
  readonly value?: string;
  readonly onValueChange: (value: string) => void;
  readonly disabled?: boolean;
  readonly type: enum_workflow_type;
}

export default function WorkflowLookup({
  value,
  onValueChange,
  disabled = false,
  type,
}: Readonly<PropsWorkflowLookup>) {
  const { token, buCode } = useAuth();
  const { workflows, isLoading } = useWorkflowQuery(token, buCode, type);
  const t = useTranslations("Workflow");
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
    selectContent = workflows.map((workflow: WorkflowDto) => (
      <SelectItem key={workflow.id} value={workflow.id}>
        {workflow.name}
      </SelectItem>
    ));
  }

  return (
    <Select value={value || ""} onValueChange={onValueChange} disabled={disabled || isLoading}>
      <SelectTrigger className="w-full text-sm">
        <SelectValue placeholder={t("select_workflow")} />
      </SelectTrigger>
      <SelectContent>{selectContent}</SelectContent>
    </Select>
  );
}
