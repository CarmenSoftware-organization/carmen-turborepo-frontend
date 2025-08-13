"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FlaggedDto, PendingApprovalDto } from "@/dtos/procurement.dto";
import { Link } from "@/lib/navigation";
import { Eye, ThumbsUp, User } from "lucide-react";

interface ApprovalCardProps {
    readonly approval: PendingApprovalDto | FlaggedDto;
    readonly type?: 'pending' | 'flagged';
    readonly onApprove?: () => void;
}

const statusApprovalColor = (status: string) => {
    switch (status) {
        case 'High':
            return 'border-red-500 text-red-700';
        case 'Medium':
            return 'border-yellow-500 text-yellow-700';
        default:
            return 'border-green-500 text-green-700';
    }
}
export default function ApprovalCard({ approval, type = 'pending', onApprove }: ApprovalCardProps) {
    const isFlagged = type === 'flagged';
    const flaggedDto = approval as FlaggedDto;
    return (
        <Card className="p-4 mb-2 space-y-1">
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{approval.title}</p>
                <Badge variant={'outline'} className={statusApprovalColor(approval.status)}>{approval.status}</Badge>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{approval.no_unit} units,</span>
                <span>${approval.price}</span>
                <span>- Requested by {approval.requestor}</span>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Badge variant={'secondary'} className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {approval.department}
                    </Badge>

                    {isFlagged && flaggedDto.flagged_reason && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">{flaggedDto.flagged_reason}</Badge>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        // onClick={() => router.push(`/procurement/purchase-order/${approval.id}`)}
                        asChild
                    >
                        <Link href={`/procurement/purchase-request/${approval.id}`}>
                            <Eye className="w-4 h-4" />
                            Detail
                        </Link>
                    </Button>
                    <Button
                        size="sm"
                        onClick={onApprove}
                    >
                        <ThumbsUp className="w-4 h-4" />
                        Approve
                    </Button>

                </div>
            </div>
        </Card>
    )
}