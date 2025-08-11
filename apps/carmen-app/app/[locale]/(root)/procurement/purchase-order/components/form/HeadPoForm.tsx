import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, CalendarIcon, Clock, DollarSign, FileText, Hash, MapPin, NotebookPen, User } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
    readonly poData: any;
}


interface RenderPoHeadProps {
    readonly label: string;
    readonly icon: React.ReactNode;
    readonly value: string;
}

export default function HeadPoForm({ poData }: Props) {
    const tPurchaseOrder = useTranslations("PurchaseOrder");

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2">
                <RenderPoHead label={tPurchaseOrder("po_number")}
                    icon={<Hash className="h-3 w-3" />}
                    value={poData.po_number}
                />
                <RenderPoHead
                    label={tPurchaseOrder("po_date")}
                    icon={<CalendarIcon className="h-3 w-3" />}
                    value={poData.date_created}
                />
                <RenderPoHead
                    label={tPurchaseOrder("vendor")}
                    icon={<Building2 className="h-3 w-3" />}
                    value={poData.vendor}
                />
                <RenderPoHead
                    label={tPurchaseOrder("delivery_date")}
                    icon={<MapPin className="h-3 w-3" />}
                    value={poData.delivery_date}
                />
                <RenderPoHead
                    label={tPurchaseOrder("currency")}
                    icon={<DollarSign className="h-3 w-3" />}
                    value={poData.currency}
                />
                <RenderPoHead
                    label={tPurchaseOrder("net_amount")}
                    icon={<DollarSign className="h-3 w-3" />}
                    value={poData.net_amount}
                />
                <RenderPoHead
                    label={tPurchaseOrder("tax_amount")}
                    icon={<DollarSign className="h-3 w-3" />}
                    value={poData.tax_amount}
                />
                <RenderPoHead
                    label={tPurchaseOrder("amount")}
                    icon={<DollarSign className="h-3 w-3" />}
                    value={poData.amount}
                />
                <RenderPoHead
                    label={tPurchaseOrder("exchange_rate")}
                    icon={<DollarSign className="h-3 w-3" />}
                    value={poData.exchange_rate}
                />
                <RenderPoHead
                    label={tPurchaseOrder("credit_term")}
                    icon={<Clock className="h-3 w-3" />}
                    value={poData.credit_term}
                />
                <RenderPoHead
                    label={tPurchaseOrder("requestor")}
                    icon={<User className="h-3 w-3" />}
                    value={poData.requestor}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                    <Label className="text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {tPurchaseOrder("description")}
                        </div>
                    </Label>
                    <Textarea value={poData.description} disabled />
                </div>
                <div>
                    <Label className="text-xs font-medium">
                        <div className="flex items-center gap-1">
                            <NotebookPen className="h-3 w-3" />
                            {tPurchaseOrder("note")}
                        </div>
                    </Label>
                    <Textarea value={poData.note} disabled />
                </div>
            </div>
        </div>
    )
}


const RenderPoHead = ({ label, icon, value }: RenderPoHeadProps) => {
    return (
        <div className="col-span-1">
            <Label className="text-xs font-medium">
                <div className="flex items-center gap-1">
                    {icon}
                    {label}
                </div>
            </Label>
            <Input value={value} disabled className="mt-2 text-xs bg-muted" />
        </div>
    )
}
