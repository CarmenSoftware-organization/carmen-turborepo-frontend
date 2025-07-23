import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { PurchaseRequestByIdDto } from "@/dtos/purchase-request.dto";
import { Link, useRouter } from "@/lib/navigation";
import { convertPrStatus } from "@/utils/helper";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";

interface ActionFieldsProps {
    readonly mode: formType;
    readonly currentMode: formType;
    readonly initValues?: PurchaseRequestByIdDto;
    readonly onModeChange: (mode: formType) => void;
}
export default function ActionFields({ mode, currentMode, initValues, onModeChange }: ActionFieldsProps) {
    const router = useRouter();
    const tCommon = useTranslations("Common");

    const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onModeChange(formType.EDIT);
    };

    const onCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (currentMode === formType.ADD) {
            router.push("/procurement/purchase-request");
        } else {
            onModeChange(formType.VIEW);
        }
    };

    return (
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Link href="/procurement/purchase-request">
                    <ChevronLeft className="h-4 w-4" />
                </Link>

                <div className="flex items-start gap-2">
                    {mode === formType.ADD ? (
                        <p className="text-xl font-bold">Purchase Request</p>
                    ) : (
                        <p className="text-xl font-bold">
                            {initValues?.pr_no}
                        </p>
                    )}
                    {initValues?.pr_status && (
                        <Badge variant={initValues?.pr_status}>
                            {convertPrStatus(initValues?.pr_status)}
                        </Badge>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {currentMode === formType.VIEW ? (
                    <Button
                        variant="default"
                        size={"sm"}
                        className="px-2 text-xs"
                        onClick={onEdit}
                    >
                        <Pencil /> {tCommon("edit")}
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size={"sm"}
                            className="px-2 text-xs"
                            onClick={onCancel}
                        >
                            <X /> {tCommon("cancel")}
                        </Button>
                        <Button
                            variant="default"
                            size={"sm"}
                            className="px-2 text-xs"
                            type="submit"
                        >
                            <Save />
                            {tCommon("save")}
                        </Button>
                    </>
                )}
                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <Printer />
                    {tCommon("print")}
                </Button>

                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <FileDown />
                    {tCommon("export")}
                </Button>
                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <Share />
                    {tCommon("share")}
                </Button>
            </div>
        </div>
    )
}