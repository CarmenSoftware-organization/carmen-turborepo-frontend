import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { useWorkflowStageQuery } from "../../_hooks/use-workflow-stage";

interface Props {
  token: string;
  buCode: string;
  onSetStage: (stage: string) => void;
  value?: string;
}

export default function SelectWorkflowStage({ token, buCode, onSetStage, value }: Props) {
  const tDataControls = useTranslations("DataControls");

  const { data: workflowData } = useWorkflowStageQuery(token, buCode);

  return (
    <Select value={value} onValueChange={onSetStage}>
      <SelectTrigger className="w-[120px] h-8 bg-muted">
        <SelectValue placeholder={tDataControls("allStage")} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{tDataControls("allStage")}</SelectItem>
        {workflowData?.map((stage: string) => (
          <SelectItem key={stage} value={stage}>
            {stage}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
