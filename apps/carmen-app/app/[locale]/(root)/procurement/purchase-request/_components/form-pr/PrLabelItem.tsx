import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { formatAmountNaN } from "@/utils/format/number";

interface Props {
  readonly label: string;
  readonly value: string | number | null;
  readonly position?: "text-left" | "text-right";
  readonly sub_value?: string | number | null;
}
export default function PrLabelItem({ label, value, position = "text-left", sub_value }: Props) {
  const hasSubValue = sub_value !== null && sub_value !== undefined;
  return (
    <div className={cn(position)}>
      <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
      <p className="font-bold text-sm text-muted-foreground">{formatAmountNaN(value)}</p>
      {hasSubValue && <p className="text-xs text-muted-foreground">{formatAmountNaN(sub_value)}</p>}
    </div>
  );
}
