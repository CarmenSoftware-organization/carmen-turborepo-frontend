import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { Link, useRouter } from "@/lib/navigation";
import { formatDateFns } from "@/utils/config-system";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";

interface ActionFieldsProps {
    readonly currentMode: formType;
    readonly setCurrentMode: (mode: formType) => void;
    readonly isCreatePending: boolean;
    readonly isUpdatePending: boolean;
    readonly grnNo: string;
    readonly createdAt: string;
    readonly docStatus: string;
}

export default function ActionFields({
    currentMode,
    setCurrentMode,
    isCreatePending,
    isUpdatePending,
    grnNo,
    createdAt,
    docStatus
}: ActionFieldsProps) {

    const router = useRouter();
    const { dateFormat } = useAuth();

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Link href="/procurement/goods-received-note">
                    <ChevronLeft className="h-4 w-4" />
                </Link>
                <div className="flex items-start gap-2">
                    {currentMode === formType.ADD ? (
                        <p className="text-base  font-bold">
                            Goods Received Note
                        </p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            <p className="text-base font-bold">
                                {grnNo}
                            </p>
                            <p className="text-sm font-medium">{formatDateFns(createdAt, dateFormat || 'yyyy/MM/dd')}</p>
                        </div>
                    )}
                    {docStatus && (
                        <Badge
                            variant={docStatus}
                            className="rounded-full text-xs"
                        >
                            {docStatus}
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setCurrentMode(formType.EDIT);
                        }}
                    >
                        <Pencil />
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            size={"sm"}
                            className="px-2 text-xs"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (currentMode === formType.ADD) {
                                    router.push("/procurement/goods-received-note");
                                } else {
                                    setCurrentMode(formType.VIEW);
                                }
                            }}
                        >
                            <X />
                        </Button>
                        <Button
                            variant="default"
                            size={"sm"}
                            className="px-2 text-xs"
                            type="submit"
                            disabled={isCreatePending || isUpdatePending}
                        >
                            <Save />
                        </Button>
                    </>
                )}
                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <Printer />
                </Button>

                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <FileDown />
                </Button>
                <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                >
                    <Share />
                </Button>
            </div>
        </div>
    )
}