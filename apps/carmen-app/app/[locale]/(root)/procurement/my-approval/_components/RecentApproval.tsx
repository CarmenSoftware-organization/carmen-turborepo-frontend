import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentApprovalDto } from "@/dtos/procurement.dto";
import { mockRecentApprovals } from "@/mock-data/procurement";
import { formatDistanceToNow } from "date-fns";
import { Clock, UserRound, CheckCircle, AlertCircle } from "lucide-react";

const statusRecentApprovalColor = (status: string) => {
  if (status === "Approved") {
    return {
      icon: <CheckCircle className="w-3 h-3" />,
      className: "bg-green-100 text-green-800",
    };
  } else if (status === "Rejected") {
    return {
      icon: <AlertCircle className="w-3 h-3" />,
      className: "bg-red-100 text-red-800",
    };
  } else if (status === "Pending") {
    return {
      icon: <Clock className="w-3 h-3" />,
      className: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    icon: <Clock className="w-3 h-3" />,
    className: "bg-gray-100 text-gray-800",
  };
};
export default function RecentApproval() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Recent Approvals
        </CardTitle>
        <CardDescription className="text-xs">Log of your recent approval actions</CardDescription>
      </CardHeader>
      <ScrollArea className="h-[220px]">
        {mockRecentApprovals.map((approval: RecentApprovalDto) => (
          <div key={approval.id} className="p-4 space-y-2 border-b">
            <div className="flex justify-between items-center">
              <Badge
                variant="outline"
                className={`${statusRecentApprovalColor(approval.status).className} flex items-center gap-1 py-1 px-2`}
              >
                {statusRecentApprovalColor(approval.status).icon}
                <span className="text-xs font-medium">{approval.status}</span>
              </Badge>
              <Badge className="flex items-center gap-1" variant="outline">
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
