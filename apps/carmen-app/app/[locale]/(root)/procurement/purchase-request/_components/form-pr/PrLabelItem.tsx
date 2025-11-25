import { Label } from "@/components/ui/label";
import { cn } from "@/utils";

interface Props {
  readonly label: string;
  readonly value: string | number | null;
  readonly position?: "text-left" | "text-right";
  readonly sub_value?: string | number | null;
}

export default function PrLabelItem({ label, value, position = "text-left", sub_value }: Props) {
  return (
    <div className={cn(position, "space-y-1")}>
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <p className="font-bold text-sm text-muted-foreground">{value}</p>
      {sub_value && <p className="text-xs text-muted-foreground">{sub_value}</p>}
    </div>
  );
}
