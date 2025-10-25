import { ScrollArea } from "@/components/ui/scroll-area";
import { FlaggedDto, PendingApprovalDto } from "@/dtos/procurement.dto";
import ApprovalCard from "./ApprovalCard";

interface ApprovalListProps {
    readonly approvals: (PendingApprovalDto | FlaggedDto)[];
    readonly type?: 'pending' | 'flagged';
}
export default function ApprovalList({ approvals, type = 'pending' }: ApprovalListProps) {
    return (
        <ScrollArea className="h-[500px]">
            {approvals.map((approval) => (
                <ApprovalCard
                    key={approval.id}
                    approval={approval}
                    type={type}
                />
            ))}
        </ScrollArea>
    )
}
