import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";
import { Table } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

interface SelectAllDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectMode: "all" | "pending";
  onSelectModeChange: (mode: "all" | "pending") => void;
  items: PurchaseRequestDetail[];
  table: Table<PurchaseRequestDetail>;
  getItemValue: (item: PurchaseRequestDetail, fieldName: string) => unknown;
  getCurrentStatus: (stageStatus: string | undefined) => string;
}

export default function SelectAllDialog({
  open,
  onOpenChange,
  selectMode,
  onSelectModeChange,
  items,
  table,
  getItemValue,
  getCurrentStatus,
}: SelectAllDialogProps) {
  const tPr = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");

  const pendingItemsCount = items.filter((item) => {
    const currentStageStatus =
      (getItemValue(item, "current_stage_status") as string) || item.current_stage_status;
    return getCurrentStatus(currentStageStatus) === "pending";
  }).length;

  const handleConfirm = () => {
    if (selectMode === "all") {
      table.toggleAllRowsSelected(true);
    } else {
      // Select only pending items
      for (const row of table.getRowModel().rows) {
        const item = row.original;
        const currentStageStatus =
          (getItemValue(item, "current_stage_status") as string) || item.current_stage_status;
        const currentStatus = getCurrentStatus(currentStageStatus);

        if (currentStatus === "pending") {
          row.toggleSelected(true);
        }
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tPr("select_pr_item")}</DialogTitle>
          <DialogDescription>{tPr("select_pr_items_desc")}</DialogDescription>
        </DialogHeader>
        <RadioGroup
          value={selectMode}
          onValueChange={(value: "all" | "pending") => onSelectModeChange(value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <Label htmlFor="all" className="cursor-pointer">
              {tPr("select_all_pr_items")} ({items.length} {tCommon("items")})
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pending" id="pending" />
            <Label htmlFor="pending" className="cursor-pointer">
              {tPr("select_only_pending_status")} ({pendingItemsCount} {tCommon("items")})
            </Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleConfirm}>{tCommon("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
