import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";
import { useRouter } from "@/lib/navigation";
import { ChevronLeft, FileDown, Loader2, Pencil, Printer, Save, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

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
    const tPr = useTranslations("PurchaseRequest");
    const router = useRouter();
    const tStatus = useTranslations("Status");
    const tCommon = useTranslations("Common");

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
        <TooltipProvider>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleBack}
                                className="hover:bg-transparent w-8 h-8"
                            >
                                <ChevronLeft />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tCommon("back")}</p>
                        </TooltipContent>
                    </Tooltip>

                    <div className="flex items-center gap-2">
                        {mode === formType.ADD ? (
                            <p className="text-xl font-bold">{tPr("title")}</p>
                        ) : (
                            <p className="text-xl font-bold">
                                {initValues?.pr_no}
                            </p>
                        )}
                        {initValues?.pr_status && (
                            <Badge variant={initValues?.pr_status}>
                                {convertStatus(initValues?.pr_status)}
                            </Badge>
                        )}
                    </div>
                </div>
                {prStatus !== 'voided' && (
                    <div className="flex items-center gap-2">
                        {currentMode === formType.VIEW ? (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="default"
                                        size={"sm"}
                                        className="text-xs"
                                        onClick={onEdit}
                                    >
                                        <Pencil />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{tCommon("edit")}</p>
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size={"sm"}
                                            onClick={(e) => onCancel(e, 'cancel')}
                                        >
                                            <X />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tCommon("cancel")}</p>
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="default"
                                            size={"sm"}
                                            type="submit"
                                            disabled={isCreatingPr}
                                        >
                                            {isCreatingPr ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save />}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tCommon("save")}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </>
                        )}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                >
                                    <Printer />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tCommon("print")}</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                >
                                    <FileDown />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tCommon("export")}</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size={"sm"}
                                >
                                    <Share />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tCommon("share")}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>
        </TooltipProvider>
    )
}