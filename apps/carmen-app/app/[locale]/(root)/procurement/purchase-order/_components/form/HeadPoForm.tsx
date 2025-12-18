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
import { cn } from "@/lib/utils";

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
          icon={<Hash className="h-4 w-4 text-muted-foreground" />}
          value={poData.po_number}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("vendor")}
          icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          value={poData.vendor}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("po_date")}
          icon={<CalendarIcon className="h-4 w-4 text-muted-foreground" />}
          value={poData.date_created}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("requestor")}
          icon={<User className="h-4 w-4 text-muted-foreground" />}
          value={poData.requestor}
          mode={mode}
        />

        {/* Row 2: Terms & Logistics */}
        <RenderPoHead
          label={tPurchaseOrder("delivery_date")}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
          value={poData.delivery_date}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("credit_term")}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          value={poData.credit_term}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("currency")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={poData.currency}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("exchange_rate")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={poData.exchange_rate}
          mode={mode}
        />

        {/* Row 3: Financial Summary */}
        <RenderPoHead
          label={tPurchaseOrder("net_amount")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={poData.net_amount}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("tax_amount")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={poData.tax_amount}
          mode={mode}
        />
        <RenderPoHead
          label={tPurchaseOrder("amount")}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={poData.amount}
          mode={mode}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/50">
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="h-4 w-4 text-muted-foreground" />
            {tPurchaseOrder("description")}
          </Label>
          <Textarea
            defaultValue={poData.description}
            className={cn("min-h-[100px]", mode !== formType.EDIT && "bg-muted")}
            disabled={mode !== formType.EDIT}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1.5 text-muted-foreground">
            <NotebookPen className="h-4 w-4 text-muted-foreground" />
            {tPurchaseOrder("note")}
          </Label>
          <Textarea
            defaultValue={poData.note}
            className={cn("min-h-[100px]", mode !== formType.EDIT && "bg-muted")}
            disabled={mode !== formType.EDIT}
          />
        </div>
      </div>
    </div>
  );
}

const RenderPoHead = ({ label, icon, value, mode }: RenderPoHeadProps) => {
  return (
    <div className="col-span-1 space-y-2">
      <Label className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        {label}
      </Label>
      <Input
        defaultValue={value}
        className={cn("h-9", mode !== formType.EDIT && "bg-muted")}
        disabled={mode !== formType.EDIT}
      />
    </div>
  );
};
