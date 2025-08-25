import { Timeline, TimelineDescription, TimelineHeader, TimelineItem, TimelineTime, TimelineTitle } from "@/components/ui-custom/Timeline";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns } from "@/utils/config-system";
import { ArrowRightIcon } from "lucide-react";

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
    const { dateFormat } = useAuth();

    if (!workflow_history || workflow_history.length === 0) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-6">Workflow History</h1>
                <div className="text-center py-12">
                    <p>No workflow history available</p>
                </div>
            </div>
        );
    };

    return (
        <Timeline className="p-4">
            {workflow_history?.map((item) => (
                <TimelineItem key={`${item.datetime}-${item.user.id}-${item.action}`}>
                    <TimelineHeader>
                        <TimelineTime variant="outline" className="bg-transparent">
                            {formatDateFns(item.datetime, dateFormat || 'yyyy-MM-dd')}
                        </TimelineTime>
                        <TimelineTitle className="text-foreground">
                            {item.action}
                        </TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>
                        <div className="mb-2 text-sm">
                            By: <span className="font-medium">{item.user.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">
                                {item.current_stage}
                            </Badge>
                            {item.next_stage !== "-" && (
                                <>
                                    <ArrowRightIcon className="w-4 h-4" />
                                    <Badge variant="outline">
                                        {item.next_stage}
                                    </Badge>
                                </>
                            )}
                        </div>
                    </TimelineDescription>
                </TimelineItem>
            ))}
        </Timeline>
    );
}