import { Timeline, TimelineDescription, TimelineHeader, TimelineItem, TimelineTime, TimelineTitle } from "@/components/ui-custom/Timeline";
import { useAuth } from "@/context/AuthContext";
import { formatDateFns } from "@/utils/config-system";

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
            {workflow_history.map((item) => (
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
                        <div className="mb-3 text-sm">
                            By: <span className="font-medium">{item.user.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                            <span className="px-3 py-1 rounded-full border font-medium">
                                {item.current_stage}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="px-3 py-1 rounded-full border font-medium">
                                {item.next_stage}
                            </span>
                        </div>
                    </TimelineDescription>
                </TimelineItem>
            ))}
        </Timeline>
    );
}