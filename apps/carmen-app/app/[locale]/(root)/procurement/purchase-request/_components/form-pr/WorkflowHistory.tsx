import {
  Timeline,
  TimelineDescription,
  TimelineHeader,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui-custom/timeline";
import { Badge } from "@/components/ui/badge";
import { useBuConfig } from "@/context/BuConfigContext";
import { formatDate } from "@/utils/format/date";
import { ArrowRightIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface WorkflowHistoryItem {
  action: string;
  datetime: string;
  user: {
    id: string;
    name: string;
  };
  current_stage: string;
  next_stage: string;
}

interface Props {
  readonly workflow_history?: WorkflowHistoryItem[];
}

export default function WorkflowHistory({ workflow_history }: Props) {
  const { dateFormat } = useBuConfig();
  const tWorkflow = useTranslations("Workflow");

  if (!workflow_history || workflow_history.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-base font-semibold tracking-tight mb-3">{tWorkflow("workflow")}</h3>
        <div className="text-center py-6">
          <p className="text-xs text-muted-foreground">{tWorkflow("no_workflow_history")}</p>
        </div>
      </div>
    );
  }

  return (
    <Timeline className="p-4">
      {workflow_history?.map((item) => (
        <TimelineItem key={`${item.datetime}-${item.user.id}-${item.action}`}>
          <TimelineHeader>
            <TimelineTime variant="outline" className="bg-transparent">
              {formatDate(item.datetime, dateFormat || "yyyy-MM-dd")}
            </TimelineTime>
            <TimelineTitle className="text-primary">{item.action.toUpperCase()}</TimelineTitle>
          </TimelineHeader>
          <TimelineDescription>
            <div className="mb-1 text-xs">
              {tWorkflow("by")}: <span className="font-medium">{item.user.name}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Badge variant="outline">{item.current_stage}</Badge>
              {item.next_stage !== "-" && (
                <>
                  <ArrowRightIcon className="w-4 h-4" />
                  <Badge variant="outline">{item.next_stage}</Badge>
                </>
              )}
            </div>
          </TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
