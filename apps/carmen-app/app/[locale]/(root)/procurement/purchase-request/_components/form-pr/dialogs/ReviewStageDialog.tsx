import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface ReviewStageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStage: string;
  onStageChange: (stage: string) => void;
  stages: string[] | undefined;
  isLoading: boolean;
  onConfirm: () => void;
}

export default function ReviewStageDialog({
  open,
  onOpenChange,
  selectedStage,
  onStageChange,
  stages,
  isLoading,
  onConfirm,
}: ReviewStageDialogProps) {
  const tPR = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");

  const handleCancel = () => {
    onStageChange("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tPR("select_stage_for_review")}</DialogTitle>
          <DialogDescription>
            {tPR("select_stage_for_review_description")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <RadioGroup value={selectedStage} onValueChange={onStageChange}>
              {stages?.map((stage: string) => (
                <div key={stage} className="flex items-center space-x-2">
                  <RadioGroupItem value={stage} id={`stage-${stage}`} />
                  <Label htmlFor={`stage-${stage}`} className="cursor-pointer">
                    {stage}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !selectedStage}
            className="bg-[hsl(var(--azure-primary))] hover:bg-[hsl(var(--azure-primary)/0.8)] disabled:opacity-50"
          >
            {tCommon("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
