import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, FileText, Hash } from "lucide-react";
import { useTranslations } from "next-intl";
import StatusPrInfo from "./StatusPrInfo";
import { Textarea } from "@/components/ui/textarea";

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly prtData: any;
}

export default function HeadPrtForm({ prtData }: Props) {
    const tPurchaseRequest = useTranslations("PurchaseRequest");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <RenderPrtHead
                        label={tPurchaseRequest("pr_no")}
                        icon={<Hash className="h-3 w-3" />}
                        value={prtData.pr_no}
                    />
                    <RenderPrtHead
                        label={tPurchaseRequest("pr_date")}
                        icon={<CalendarIcon className="h-3 w-3" />}
                        value={prtData.pr_date}
                    />
                    <RenderPrtHead
                        label={tPurchaseRequest("pr_type")}
                        icon={<FileText className="h-3 w-3" />}
                        value={prtData.workflow_name}
                    />
                    <div className="col-span-2">
                        <Label className="text-xs font-medium">
                            <div className="fxr-c gap-1">
                                <FileText className="h-3 w-3" />
                                {tPurchaseRequest("description")}
                            </div>
                        </Label>
                        <Textarea value={prtData.description} disabled />
                    </div>
                </div>
                <div className="col-span-1">
                    <StatusPrInfo
                        create_date={prtData.create_date}
                        status={prtData.pr_status}
                        requestor_name={prtData.requestor_name}
                        department_name={prtData.department_name}
                    />
                </div>
            </div>
        </div>
    )
}

interface RenderPrtHeadProps {
    readonly label: string;
    readonly icon: React.ReactNode;
    readonly value: string;
}

const RenderPrtHead = ({ label, icon, value }: RenderPrtHeadProps) => {
    return (
        <div className="col-span-1">
            <Label className="text-xs font-medium">
                <div className="fxr-c gap-1">
                    {icon}
                    {label}
                </div>
            </Label>
            <Input value={value} disabled className="mt-2 text-xs bg-muted" />
        </div>
    )
}
