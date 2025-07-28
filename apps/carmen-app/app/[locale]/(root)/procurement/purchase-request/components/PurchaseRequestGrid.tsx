import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { MobileView } from "./MobileView";
import { ActionButtons, prStatusColor } from "./SharePrComponent";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import PaginationComponent from "@/components/PaginationComponent";
import { GetAllPrDto } from "@/dtos/pr.dto";
import CardLoading from "@/components/loading/CardLoading";
import { useRouter } from "@/lib/navigation";

interface PurchaseRequestGridProps {
  readonly purchaseRequests: GetAllPrDto[];
  readonly currentPage?: number;
  readonly totalPages?: number;
  readonly onPageChange?: (page: number) => void;
  readonly isLoading?: boolean;
}

export default function PurchaseRequestGrid({
  purchaseRequests = [],
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => { },
  isLoading = false,
}: PurchaseRequestGridProps) {
  const t = useTranslations("TableHeader");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const router = useRouter();

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === purchaseRequests.length) {
      setSelectedItems([]);
    } else {
      const allIds = purchaseRequests.map((pr) => pr.id ?? "").filter(Boolean);
      setSelectedItems(allIds);
    }
  };

  const isAllSelected =
    purchaseRequests.length > 0 &&
    selectedItems.length === purchaseRequests.length;

  const renderGridContent = () => {
    if (isLoading) {
      return <CardLoading />;
    }

    if (purchaseRequests.length === 0) {
      return (
        <div className="col-span-full flex justify-center items-center h-40">
          <div className="text-center">
            <p className="text-muted-foreground">No purchase requests found</p>
          </div>
        </div>
      );
    }

    return purchaseRequests.map((pr: GetAllPrDto) => (
      <Card
        key={pr.id}
        className="transition-all duration-200 hover:shadow-lg hover:border-primary/50"
        onClick={() => router.push(`/procurement/purchase-request/${pr.id}`)}
      >
        <CardHeader className="p-2 border-t bg-muted rounded-t-md">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`grid-checkbox-${pr.id}`}
                checked={selectedItems.includes(pr.id ?? "")}
                onCheckedChange={() => handleSelectItem(pr.id ?? "")}
                aria-label={`Select PR ${pr.pr_no}`}
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
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">
                {t("description")}
              </p>
              <p className="text-xs font-medium line-clamp-2">
                {pr.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="text-xs font-medium">{pr.workflow_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {t("department")}
                </p>
                <p className="text-xs font-medium">{pr.department_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {t("requestor")}
                </p>
                <p className="text-xs font-medium">{pr.requestor_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  Current Workflow
                </p>
                {pr.workflow_current_stage ? (
                  <Badge>{pr.workflow_current_stage}</Badge>
                ) : (
                  <p className="text-xs font-medium">-</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">{t("amount")}</p>
                <p className="text-xs font-medium">{pr.total_amount}</p>
              </div>
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
    <div className="space-y-4">
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div className="col-span-full flex items-center justify-between mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
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
        {renderGridContent()}
      </div>

      <MobileView
        purchaseRequests={purchaseRequests || []}
        selectedItems={selectedItems}
        onSelectItem={handleSelectItem}
        onSelectAll={handleSelectAll}
        isAllSelected={isAllSelected}
        isLoading={isLoading}
      />

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
