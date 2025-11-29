import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  CalendarIcon,
  Clock,
  DollarSign,
  FileText,
  Hash,
  MapPin,
  NotebookPen,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { PurchaseOrderDetailDto } from "@/dtos/procurement.dto";
import { formType } from "@/dtos/form.dto";

interface Props {
  readonly poData: PurchaseOrderDetailDto;
  readonly mode: formType;
}

interface RenderPoHeadProps {
  readonly label: string;
  readonly icon: React.ReactNode;
  readonly value: string | number;
  readonly mode: formType;
}

export default function HeadPoForm({ poData, mode }: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Row 1: General Information */}
        <RenderPoHead
          label={tPurchaseOrder("po_number")}
          icon={<Hash className="h-3.5 w-3.5" />}
          value={poData.po_number}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("vendor")}
          icon={<Building2 className="h-3.5 w-3.5" />}
          value={poData.vendor}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("po_date")}
          icon={<CalendarIcon className="h-3.5 w-3.5" />}
          value={poData.date_created}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("requestor")}
          icon={<User className="h-3.5 w-3.5" />}
          value={poData.requestor}
          mode={mode}
        />

        {/* Row 2: Terms & Logistics */}
        <RenderPoHead
          label={tPurchaseOrder("delivery_date")}
          icon={<MapPin className="h-3.5 w-3.5" />}
          value={poData.delivery_date}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("credit_term")}
          icon={<Clock className="h-3.5 w-3.5" />}
          value={poData.credit_term}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("currency")}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          value={poData.currency}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("exchange_rate")}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          value={poData.exchange_rate}
          mode={mode}
        />

        {/* Row 3: Financial Summary */}
        <RenderPoHead
          label={tPurchaseOrder("net_amount")}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          value={poData.net_amount}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("tax_amount")}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          value={poData.tax_amount}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("amount")}
          icon={<DollarSign className="h-3.5 w-3.5" />}
          value={poData.amount}
          mode={mode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" />
            {tPurchaseOrder("description")}
          </Label>
          {mode === formType.EDIT ? (
            <Textarea defaultValue={poData.description} className="min-h-[100px]" />
          ) : (
            <p className="text-sm text-foreground leading-relaxed">{poData.description || "-"}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <NotebookPen className="h-3.5 w-3.5" />
            {tPurchaseOrder("note")}
          </Label>
          {mode === formType.EDIT ? (
            <Textarea defaultValue={poData.note} className="min-h-[100px]" />
          ) : (
            <p className="text-sm text-foreground leading-relaxed">{poData.note || "-"}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const RenderPoHead = ({ label, icon, value, mode }: RenderPoHeadProps) => {
  return (
    <div className="col-span-1 space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        {icon}
        {label}
      </Label>
      {mode === formType.EDIT ? (
        <Input defaultValue={value} className="h-9" />
      ) : (
        <p className="text-sm font-medium text-foreground">{value || "-"}</p>
      )}
    </div>
  );
};
