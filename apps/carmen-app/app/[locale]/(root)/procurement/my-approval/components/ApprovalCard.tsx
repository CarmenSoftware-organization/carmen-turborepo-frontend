import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlaggedDto, PendingApprovalDto } from "@/dtos/procurement.dto";
import { User } from "lucide-react";

interface ApprovalCardProps {
    readonly approval: PendingApprovalDto | FlaggedDto;
    readonly type?: 'pending' | 'flagged';
    readonly onApprove?: () => void;
    readonly onReject?: () => void;
}

export default function ApprovalCard({ approval, type = 'pending', onApprove, onReject }: ApprovalCardProps) {
    const isFlagged = type === 'flagged';
    const flaggedDto = approval as FlaggedDto;
    return (
        <Card className="p-4 mb-2 space-y-1">
            <div className="flex justify-between items-center">
                <p>{approval.title}</p>
                <Badge>{approval.status}</Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{approval.no_unit} units,</span>
                <span>${approval.price}</span>
                <span>- Requested by {approval.requestor}</span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {approval.department}
                    </Badge>

                    {isFlagged && flaggedDto.flagged_reason && (
                        <Badge variant="outline">{flaggedDto.flagged_reason}</Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onApprove}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={onReject}
                    >
                        Reject
                    </Button>
                </div>
            </div>
        </Card>
    )
}