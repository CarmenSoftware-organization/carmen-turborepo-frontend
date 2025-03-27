import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentApprovalDto } from "@/dtos/procurement.dto";
import { mockRecentApprovals } from "@/mock-data/procurement";
import { formatDistanceToNow } from "date-fns";
import { Clock, UserRound } from "lucide-react";
export default function RecentApproval() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Approvals</CardTitle>
                <CardDescription>
                    Log of your recent approval actions
                </CardDescription>
            </CardHeader>
            <ScrollArea className="h-[220px]">
                {mockRecentApprovals.map((approval: RecentApprovalDto) => (
                    <div key={approval.id} className="p-4 space-y-2 border-b">
                        <div className="flex justify-between items-center">
                            <Badge>{approval.status}</Badge>
                            <Badge className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(approval.date_approved), { addSuffix: true })}
                                </span>
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs font-medium">{approval.title}</p>
                            <p className="text-xs font-medium">- {approval.no_unit} units</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                <UserRound className="w-3 h-3" />
                                {approval.department}
                            </Badge>
                            <p className="text-xs text-muted-foreground">{approval.requestor}</p>
                            <p className="text-xs text-muted-foreground">${approval.price}</p>
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </Card>
    );
}
