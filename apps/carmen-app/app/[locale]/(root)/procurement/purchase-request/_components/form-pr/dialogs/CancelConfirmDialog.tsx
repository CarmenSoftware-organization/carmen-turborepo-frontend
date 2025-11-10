import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function CancelConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: CancelConfirmDialogProps) {
  const tPR = useTranslations("PurchaseRequest");
  const tAction = useTranslations("Action");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tPR("confirm_cancel")}</DialogTitle>
          <DialogDescription>{tPR("confirm_cancel_description")}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tAction("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
          >
            {tAction("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
