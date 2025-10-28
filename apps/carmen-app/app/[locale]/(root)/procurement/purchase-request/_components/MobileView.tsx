import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslations } from "next-intl";
import {
  ActionButtons,
  prStatusColor,
  SelectionProps,
} from "./SharePrComponent";
import { format } from "date-fns";
import { PurchaseRequestListDto } from "@/dtos/purchase-request.dto";
import { formatCurrency } from "@/lib/utils";
interface MobileViewProps extends SelectionProps {
  readonly purchaseRequests: PurchaseRequestListDto[];
  readonly isLoading?: boolean;
}

export const MobileView = ({
  purchaseRequests,
  selectedItems,
  onSelectItem,
  onSelectAll,
  isAllSelected,
  isLoading = false,
}: MobileViewProps) => {
  const t = useTranslations("TableHeader");

  const renderMobileContent = () => {
    if (isLoading) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <Card key={`mobile-skeleton-${index}`} className="animate-pulse">
            <CardHeader className="p-2 border-b bg-muted">
              <div className="h-6 bg-muted-foreground/20 rounded"></div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              <div className="h-4 bg-muted-foreground/20 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-8 bg-muted-foreground/20 rounded"></div>
                <div className="h-8 bg-muted-foreground/20 rounded"></div>
                <div className="h-8 bg-muted-foreground/20 rounded"></div>
                <div className="h-8 bg-muted-foreground/20 rounded"></div>
              </div>
            </CardContent>
            <div className="p-2 border-t bg-muted">
              <div className="h-6 bg-muted-foreground/20 rounded w-24 ml-auto"></div>
            </div>
          </Card>
        ));
    }

    if (purchaseRequests.length === 0) {
      return (
        <Card className="p-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              No purchase requests found
            </p>
          </div>
        </Card>
      );
    }

    return purchaseRequests.map((pr) => (
      <Card
        key={pr.id}
        className="transition-all duration-200 hover:shadow-lg hover:border-primary/50"
      >
        <CardHeader className="p-2 border-b bg-muted">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`mobile-checkbox-${pr.id}`}
                checked={selectedItems.includes(pr.id ?? "")}
                onCheckedChange={() => onSelectItem(pr.id ?? "")}
                aria-label={`Select ${pr.pr_no}`}
                className="mt-1"
              />
              <div>
                <p className="text-sm font-semibold text-primary">{pr.pr_no}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(pr.pr_date), "dd MMM yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="mt-1">{prStatusColor(pr.pr_status ?? "")}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 col-span-2">
              <p className="text-xs text-muted-foreground">
                {t("description")}
              </p>
              <p className="text-xs font-medium line-clamp-2">
                {pr.description}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Workflow</p>
              <p className="text-xs font-medium">
                {pr.workflow_current_stage}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t("requestor")}</p>
              <p className="text-xs font-medium">{pr.requestor_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t("department")}</p>
              <p className="text-xs font-medium">{pr.department_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{t("amount")}</p>
              <p className="text-xs font-medium">
                {formatCurrency(
                  pr.purchase_request_detail?.reduce(
                    (sum: number, item) =>
                      sum + Number(String(item.total_price || "0")),
                    0
                  ) ?? 0,
                  "THB"
                )}
              </p>
            </div>
          </div>
        </CardContent>
        <div className="flex items-center justify-end p-2 border-t bg-muted">
          <ActionButtons prId={pr.id ?? ""} />
        </div>
      </Card>
    ));
  };

  return (
    <div className="grid gap-4 md:hidden">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onSelectAll}
          disabled={isLoading || purchaseRequests.length === 0}
        >
          {isAllSelected ? "Unselect All" : "Select All"}
        </Button>
        {selectedItems.length > 0 && (
          <span className="text-sm text-muted-foreground">
            {selectedItems.length} Items Selected
          </span>
        )}
      </div>
      {renderMobileContent()}
    </div>
  );
};
