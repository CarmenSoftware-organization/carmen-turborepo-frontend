import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

interface Props {
  readonly label: string;
  readonly value: string | number | null;
  readonly position?: "text-left" | "text-right";
  readonly sub_value?: string | number | null;
}
const formatValue = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined) return "-";
  const numVal = typeof val === "string" ? Number(val) : val;
  if (Number.isNaN(numVal)) return "-";
  return String(val);
};

export default function PrLabelItem({ label, value, position = "text-left", sub_value }: Props) {
  const hasSubValue = sub_value !== null && sub_value !== undefined;
  return (
    <div className={cn(position)}>
      <Label className="text-muted-foreground text-xs font-medium">{label}</Label>
      <p className="font-bold text-sm text-muted-foreground">{formatValue(value)}</p>
      {hasSubValue && <p className="text-xs text-muted-foreground">{formatValue(sub_value)}</p>}
    </div>
  );
}
