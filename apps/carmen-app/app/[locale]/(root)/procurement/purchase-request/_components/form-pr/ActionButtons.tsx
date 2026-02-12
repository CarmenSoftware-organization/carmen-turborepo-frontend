import { X, ArrowLeftIcon, Eye, CheckCircleIcon, ShoppingCart, SendIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PR_STATUS } from "../../_constants/pr-status";

interface ItemsStatusSummary {
  approved: number;
  review: number;
  rejected: number;
  pending: number;
  newItems: number;
  total: number;
}

interface ActionButtonsProps {
  readonly prStatus: string;
  readonly isNewPr: boolean;
  readonly isDraft: boolean;
  readonly isDisabled: boolean;
  readonly isPending: boolean;
  readonly isSubmitDisabled?: boolean;
  readonly isApproveDisabled?: boolean;
  readonly itemsStatusSummary?: ItemsStatusSummary;

  readonly onReject: () => void;
  readonly onSendBack: () => void;
  readonly onReview: () => void;
  readonly onApprove: () => void;
  readonly onPurchaseApprove: () => void;
  readonly onSubmitPr: () => void;
  readonly onSave?: () => void;
}

const stopEvent = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export default function ActionButtons({
  prStatus,
  isNewPr,
  isDraft,
  isPending,
  isDisabled,
  isSubmitDisabled = false,
  isApproveDisabled = false,
  itemsStatusSummary,
  onReject,
  onSendBack,
  onReview,
  onApprove,
  onPurchaseApprove,
  onSubmitPr,
  onSave,
}: ActionButtonsProps) {
  const tAction = useTranslations("Action");

  const hasPending = itemsStatusSummary ? itemsStatusSummary.pending > 0 : false;

  const hasOnlyRejected = itemsStatusSummary
    ? itemsStatusSummary.approved === 0 &&
      itemsStatusSummary.review === 0 &&
      itemsStatusSummary.rejected > 0 &&
      itemsStatusSummary.pending === 0 &&
      itemsStatusSummary.newItems === 0
    : false;

  const hasReview = itemsStatusSummary ? itemsStatusSummary.review > 0 : false;

  const hasOnlyApproved = itemsStatusSummary
    ? itemsStatusSummary.approved > 0 &&
      itemsStatusSummary.review === 0 &&
      itemsStatusSummary.rejected === 0 &&
      itemsStatusSummary.pending === 0 &&
      itemsStatusSummary.newItems === 0
    : false;

  if (hasPending && !isDraft) {
    return null;
  }

  const showSubmit = prStatus !== PR_STATUS.IN_PROGRESS;

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-end gap-2 bg-background/95 backdrop-blur-sm shadow-[0_-1px_3px_0_hsl(220_15%_20%/0.08)] border border-border rounded-md p-2">
      {isNewPr ? (
        <Button onClick={onSave} disabled={isDisabled} size="sm" type="button">
          <Save className="w-4 h-4" />
          {tAction("save")}
        </Button>
      ) : (
        <>
          {!isDraft && (
            <>
              {hasReview && (
                <Button
                  size="sm"
                  type="button"
                  variant="info"
                  onClick={(e) => { stopEvent(e); onReview(); }}
                  disabled={isPending}
                >
                  <Eye className="w-4 h-4" />
                  {tAction("review")}
                </Button>
              )}

              {!hasReview && hasOnlyApproved && (
                <Button
                  size="sm"
                  type="button"
                  variant="success"
                  onClick={(e) => { stopEvent(e); onApprove(); }}
                  disabled={isPending}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {tAction("approve")}
                </Button>
              )}

              {!hasReview && !hasOnlyApproved && hasOnlyRejected && (
                <Button
                  size="sm"
                  type="button"
                  variant="destructive"
                  onClick={(e) => { stopEvent(e); onReject(); }}
                  disabled={isPending}
                >
                  <X className="w-4 h-4" />
                  {tAction("reject")}
                </Button>
              )}

              {!hasReview && !hasOnlyApproved && !hasOnlyRejected && (
                <>
                  <Button
                    size="sm"
                    type="button"
                    variant="destructive"
                    onClick={(e) => { stopEvent(e); onReject(); }}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4" />
                    {tAction("reject")}
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="warning"
                    onClick={(e) => { stopEvent(e); onSendBack(); }}
                    disabled={isPending}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {tAction("send_back")}
                  </Button>

                  <div className="w-px h-5 bg-border" />

                  <Button
                    size="sm"
                    type="button"
                    variant="info"
                    onClick={(e) => { stopEvent(e); onReview(); }}
                    disabled={isPending}
                  >
                    <Eye className="w-4 h-4" />
                    {tAction("review")}
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="success"
                    onClick={(e) => { stopEvent(e); onApprove(); }}
                    disabled={isPending}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {tAction("approve")}
                  </Button>
                  <Button
                    size="sm"
                    type="button"
                    variant="default"
                    onClick={(e) => { stopEvent(e); onPurchaseApprove(); }}
                    disabled={isPending || isApproveDisabled}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {tAction("purchase_approve")}
                  </Button>
                </>
              )}
            </>
          )}

          {showSubmit && (
            <>
              {!isDraft && <div className="w-px h-5 bg-border" />}
              <Button
                size="sm"
                type="button"
                variant="success"
                onClick={(e) => { stopEvent(e); onSubmitPr(); }}
                disabled={isPending || isSubmitDisabled}
              >
                <SendIcon className="w-4 h-4" />
                {tAction("submit")}
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
