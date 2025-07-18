import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

interface StatusPrInfoProps {
  readonly statusInfo?: {
    create_date?: string;
    status?: string;
    workflow_status?: string;
  };
}

export default function StatusPrInfo({ statusInfo }: StatusPrInfoProps) {
  return (
    <Card className="col-span-2 p-4">
      <div className="space-y-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold">Status Information</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Current Stage</span>
            <Badge variant="outline" className="text-xs">
              Requestor
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Document Status
            </span>
            <Badge variant={statusInfo?.status} className="text-xs">
              {statusInfo?.status ?? "-"}
            </Badge>
          </div>

          <Separator className="my-2" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              {statusInfo?.create_date
                ? format(new Date(statusInfo.create_date), "PPP")
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}