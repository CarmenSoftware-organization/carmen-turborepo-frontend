import { X, ArrowLeftIcon, Eye, CheckCircleIcon, ShoppingCart, SendIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/framer-motion/MotionWrapper";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

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

  readonly isPending: boolean;
  readonly isSubmitDisabled?: boolean;
  readonly itemsStatusSummary?: ItemsStatusSummary;

  readonly onReject: () => void;
  readonly onSendBack: () => void;
  readonly onReview: () => void;
  readonly onApprove: () => void;
  readonly onPurchaseApprove: () => void;
  readonly onSubmitPr: () => void;
  readonly onSave?: () => void; // Optional for new PR
}

export default function ActionButtons({
  prStatus,
  isNewPr,
  isDraft,
  isPending,
  isSubmitDisabled = false,
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

  // Log items status summary เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    if (itemsStatusSummary) {
      console.log("Summary:", itemsStatusSummary);
    }
  }, [itemsStatusSummary]);

  // ตรวจสอบสถานะของ items
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

  // ถ้ามี pending และไม่ใช่ draft ให้ return null ไม่ต้องแสดง
  if (hasPending && !isDraft) {
    return null;
  }

  return (
    <MotionDiv
      className={`fixed bottom-8 right-20 w-fit flex items-center justify-end gap-2 bg-background shadow-lg border border-border rounded-md p-2`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      {isNewPr ? (
        <Button onClick={onSave} size="sm">
          <Save />
          {tAction("save")}
        </Button>
      ) : (
        <>
          {!isDraft && (
            <>
              {/* ถ้ามี review ให้แสดงเฉพาะปุ่ม review */}
              {hasReview && (
                <Button
                  size="sm"
                  className="bg-[hsl(var(--azure-primary))] hover:bg-[hsl(var(--azure-primary)/0.8)] h-7"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onReview();
                  }}
                  disabled={isPending}
                >
                  <Eye className="w-4 h-4" />
                  {tAction("review")}
                </Button>
              )}

              {/* ถ้ามีแต่ approved และไม่มี review ให้แสดงเฉพาะปุ่ม approve */}
              {!hasReview && hasOnlyApproved && (
                <Button
                  size="sm"
                  className="bg-[hsl(var(--emerald-primary))] hover:bg-[hsl(var(--emerald-primary)/0.8)] h-7"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onApprove();
                  }}
                  disabled={isPending}
                >
                  <CheckCircleIcon className="w-4 h-4" />
                  {tAction("approve")}
                </Button>
              )}

              {/* ถ้ามีแต่ rejected ให้แสดงเฉพาะปุ่ม reject */}
              {!hasReview && !hasOnlyApproved && hasOnlyRejected && (
                <Button
                  size="sm"
                  className="bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.8)] h-7"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onReject();
                  }}
                  disabled={isPending}
                >
                  <X className="w-4 h-4" />
                  {tAction("reject")}
                </Button>
              )}

              {/* แสดงปุ่มทั้งหมด */}
              {!hasReview && !hasOnlyApproved && !hasOnlyRejected && (
                <>
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.8)] h-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onReject();
                    }}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4" />
                    {tAction("reject")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--inactive))] hover:bg-[hsl(var(--inactive)/0.8)] h-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSendBack();
                    }}
                    disabled={isPending}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    {tAction("send_back")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--azure-primary))] hover:bg-[hsl(var(--azure-primary)/0.8)] h-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onReview();
                    }}
                    disabled={isPending}
                  >
                    <Eye className="w-4 h-4" />
                    {tAction("review")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--emerald-primary))] hover:bg-[hsl(var(--emerald-primary)/0.8)] h-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onApprove();
                    }}
                    disabled={isPending}
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    {tAction("approve")}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--teal-primary))] hover:bg-[hsl(var(--teal-primary)/0.8)] h-7"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onPurchaseApprove();
                    }}
                    disabled={isPending}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {tAction("purchase_approve")}
                  </Button>
                </>
              )}
            </>
          )}

          {(prStatus === "draft" || prStatus !== "in_progress") && (
            <Button
              size="sm"
              className="bg-[hsl(var(--active))] hover:bg-[hsl(var(--active)/0.8)] h-7"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSubmitPr();
              }}
              disabled={isPending || isSubmitDisabled}
            >
              <SendIcon className="w-4 h-4" />
              {tAction("submit")}
            </Button>
          )}
        </>
      )}
    </MotionDiv>
  );
}
