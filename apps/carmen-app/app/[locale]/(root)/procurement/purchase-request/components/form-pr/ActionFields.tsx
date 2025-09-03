import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";
import { useRouter } from "@/lib/navigation";
import { ChevronLeft, FileDown, Loader2, Pencil, Printer, Save, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionFieldsProps {
    readonly mode: formType;
    readonly currentMode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
    readonly onModeChange: (mode: formType) => void;
    readonly onCancel: (e: React.MouseEvent<HTMLButtonElement>, type: 'back' | 'cancel') => void;
    readonly hasFormChanges: () => boolean;
    readonly isCreatingPr: boolean;
    readonly prStatus: string;
}

export default function ActionFields({
    mode,
    currentMode,
    initValues,
    onModeChange,
    onCancel,
    hasFormChanges,
    isCreatingPr,
    prStatus
}: ActionFieldsProps) {
    const tCommon = useTranslations("Common");
    const router = useRouter();
    const tStatus = useTranslations("Status");
    const convertStatus = (status: string) => {
        if (status === 'submit') {
            return tStatus("submit")
        }
        if (status === 'draft') {
            return tStatus("draft")
        }
        if (status === 'Completed') {
            return tStatus("completed")
        }

        if (status === 'in_progress') {
            return tStatus("in_progress")
        }
        if (status === 'approved') {
            return tStatus("approved")
        }
        if (status === 'rejected') {
            return tStatus("rejected")
        }
        if (status === 'voided') {
            return tStatus("voided")
        }
        return ''
    }

    const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onModeChange(formType.EDIT);
    };

    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (currentMode === formType.EDIT) {
            if (hasFormChanges()) {
                onCancel(e, 'back');
            } else {
                router.push("/procurement/purchase-request");
            }
        } else {
            router.push("/procurement/purchase-request");
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="hover:bg-transparent"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-start gap-2">
                    {mode === formType.ADD ? (
                        <p className="text-xl font-bold">Purchase Request</p>
                    ) : (
                        <p className="text-xl font-bold">
                            {initValues?.pr_no}
                        </p>
                    )}
                    {initValues?.pr_status && (
                        <StatusBadge
                            status={initValues?.pr_status}
                        >
                            {convertStatus(initValues?.pr_status)}
                        </StatusBadge>
                    )}
                </div>
            </div>
            {prStatus !== 'voided' && (
                <div className="flex items-center gap-2">
                    {currentMode === formType.VIEW ? (
                        <Button
                            variant="default"
                            size={"sm"}
                            className="text-xs"
                            onClick={onEdit}
                        >
                            <Pencil />
                            {/* {tCommon("edit")} */}
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                size={"sm"}
                                onClick={(e) => onCancel(e, 'cancel')}
                            >
                                <X />
                                {/* {tCommon("cancel")} */}
                            </Button>
                            <Button
                                variant="default"
                                size={"sm"}
                                type="submit"
                                disabled={isCreatingPr}
                            >
                                {isCreatingPr ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save />}
                                {/* {tCommon("save")} */}
                            </Button>
                        </>
                    )}
                    <Button
                        variant="outline"
                        size={"sm"}
                    >
                        <Printer />
                        {/* {tCommon("print")} */}
                    </Button>

                    <Button
                        variant="outline"
                        size={"sm"}
                    >
                        <FileDown />
                        {/* {tCommon("export")} */}
                    </Button>
                    <Button
                        variant="outline"
                        size={"sm"}
                    >
                        <Share />
                        {/* {tCommon("share")} */}
                    </Button>
                </div>
            )}
        </div>
    )
}