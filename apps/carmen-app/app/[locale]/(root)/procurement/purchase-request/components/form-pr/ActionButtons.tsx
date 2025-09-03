import { X, ArrowLeftIcon, Eye, CheckCircleIcon, ShoppingCart, SendIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MotionDiv } from "@/components/framer-motion/MotionWrapper";

interface ActionButtonsProps {
    readonly prStatus: string;
    readonly isNewPr: boolean;
    readonly isDraft: boolean;

    readonly isPending: boolean;

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
    onReject,
    onSendBack,
    onReview,
    onApprove,
    onPurchaseApprove,
    onSubmitPr,
    onSave,
}: ActionButtonsProps) {
    return (
        <MotionDiv
            className={`flex items-center justify-end gap-2 bg-background shadow-lg border border-border rounded-md p-2`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
        >
            {isNewPr ? (
                <Button onClick={onSave} size="sm">
                    <Save />
                    Save
                </Button>
            ) : (
                <>
                    {!isDraft && (
                        <>
                            <Button
                                size="sm"
                                className="bg-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.8)]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onReject();
                                }}
                                disabled={isPending}
                            >
                                <X className="w-4 h-4" />
                                Reject
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[hsl(var(--inactive))] hover:bg-[hsl(var(--inactive)/0.8)]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSendBack();
                                }}
                                disabled={isPending}
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Send Back
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[hsl(var(--azure-primary))] hover:bg-[hsl(var(--azure-primary)/0.8)]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onReview();
                                }}
                                disabled={isPending}
                            >
                                <Eye className="w-4 h-4" />
                                Review
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[hsl(var(--emerald-primary))] hover:bg-[hsl(var(--emerald-primary)/0.8)]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onApprove();
                                }}
                                disabled={isPending}
                            >
                                <CheckCircleIcon className="w-4 h-4" />
                                Approve
                            </Button>
                            <Button
                                size="sm"
                                className="bg-[hsl(var(--teal-primary))] hover:bg-[hsl(var(--teal-primary)/0.8)]"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onPurchaseApprove();
                                }}
                                disabled={isPending}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Approve Purchase
                            </Button>
                        </>
                    )}

                    {prStatus !== 'in_progress' && (
                        <Button
                            size="sm"
                            className="bg-[hsl(var(--active))] hover:bg-[hsl(var(--active)/0.8)]"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onSubmitPr();
                            }}
                            disabled={isPending}
                        >
                            <SendIcon className="w-4 h-4" />
                            Submit
                        </Button>
                    )}
                </>
            )}
        </MotionDiv>
    )
}