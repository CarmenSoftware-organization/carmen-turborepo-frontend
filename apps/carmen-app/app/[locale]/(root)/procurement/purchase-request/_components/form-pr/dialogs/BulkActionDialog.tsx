import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PR_ITEM_BULK_ACTION } from "@/app/[locale]/(root)/procurement/purchase-request/_hooks/use-purchase-item-table";
import { useTranslations } from "next-intl";

interface BulkActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bulkActionType: PR_ITEM_BULK_ACTION | null;
  bulkActionMessage: string;
  onMessageChange: (message: string) => void;
  onConfirm: () => void;
}

export default function BulkActionDialog({
  open,
  onOpenChange,
  bulkActionType,
  bulkActionMessage,
  onMessageChange,
  onConfirm,
}: BulkActionDialogProps) {
  const tPr = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {bulkActionType === PR_ITEM_BULK_ACTION.REVIEW
              ? tPr("review_reason")
              : tPr("reject_reason")}
          </DialogTitle>
          <DialogDescription>
            {bulkActionType === PR_ITEM_BULK_ACTION.REVIEW
              ? "กรุณาระบุเหตุผลในการส่ง Review"
              : "กรุณาระบุเหตุผลในการ Reject"}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="ระบุเหตุผล..."
            value={bulkActionMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
            }}
          >
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            variant={bulkActionType === PR_ITEM_BULK_ACTION.REJECTED ? "destructive" : "default"}
          >
            {tCommon("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
