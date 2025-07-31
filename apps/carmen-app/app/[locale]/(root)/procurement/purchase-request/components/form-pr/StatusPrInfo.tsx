import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"

interface StatusPrInfoProps {
  readonly create_date?: string;
  readonly status?: string;
  readonly requestor_name?: string;
  readonly department_name?: string;
}

export default function StatusPrInfo({
  create_date,
  status,
  requestor_name,
  department_name,
}: StatusPrInfoProps) {
  return (
    <Card className="p-4 col-span-2">
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
            <span className="text-muted-foreground">Requestor</span>
            <p>{requestor_name}</p>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Department</span>
            <p>{department_name}</p>
          </div>

          {status && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Document Status
              </span>
              <Badge variant={status} className="text-xs">
                {status ?? "-"}
              </Badge>
            </div>
          )}
          <Separator className="my-2" />

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Created</span>
            <span className="font-medium">
              {create_date
                ? format(new Date(create_date), "PPP")
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}