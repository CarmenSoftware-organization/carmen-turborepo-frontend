import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/AuthContext";
import { convertPrStatus } from "@/utils/badge-status-color";
import { format } from "date-fns"
import { useTranslations } from "next-intl";

interface StatusPrInfoProps {
  readonly create_date?: string;
  readonly status?: string;
  readonly requestor_name?: string;
  readonly department_name?: string;
  readonly workflow_current_stage?: string;
}

export default function StatusPrInfo({
  create_date,
  status,
  requestor_name,
  department_name,
  workflow_current_stage
}: StatusPrInfoProps) {
  const { dateFormat } = useAuth();
  const tPurchaseRequest = useTranslations("PurchaseRequest");

  return (
    <Card className="p-4 col-span-2">
      <div className="space-y-4">
        <div className="fxr-c">
          <h3 className="text-lg font-semibold">{tPurchaseRequest("status_info")}</h3>
        </div>

        <div className="space-y-3">

          {workflow_current_stage && (
            <div className="fxr-c justify-between ">
              <span className="text-muted-foreground">{tPurchaseRequest("current_stage")}</span>
              <Badge variant="outline" className="">
                {workflow_current_stage}
              </Badge>
            </div>
          )}

          <div className="fxr-c justify-between ">
            <span className="text-muted-foreground">{tPurchaseRequest("requestor")}</span>
            <p>{requestor_name}</p>
          </div>

          <div className="fxr-c justify-between ">
            <span className="text-muted-foreground">{tPurchaseRequest("department")}</span>
            <p>{department_name}</p>
          </div>

          {status && (
            <div className="fxr-c justify-between ">
              <span className="text-muted-foreground">
                {tPurchaseRequest("doc_status")}
              </span>
              <StatusBadge
                status={status}
              >
                {convertPrStatus(status)}
              </StatusBadge>
            </div>
          )}
          {create_date && (
            <>
              <Separator className="my-2" />
              <div className="fxr-c justify-between ">
                <span className="text-muted-foreground">{tPurchaseRequest("create_date")}</span>
                <span className="font-medium">
                  {create_date
                    ? format(new Date(create_date), dateFormat || "dd/MM/yyyy")
                    : "-"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  )
}