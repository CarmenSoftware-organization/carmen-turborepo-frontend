import { Switch } from "@/components/ui/switch";
import { TransferItem } from "@/dtos/transfer.dto";

interface Props {
  item: TransferItem;
  hodStates: Record<string, boolean>;
  onHodChange: (key: string, checked: boolean) => void;
  isViewMode: boolean;
}

export default function UserItem({ item, hodStates, onHodChange, isViewMode }: Props) {
  return (
    <div className="fxb-c w-full gap-4">
      <span>{item.title}</span>
      <div className="fxr-c gap-2">
        <span className="text-muted-foreground">HOD</span>
        <Switch
          checked={hodStates[item.key.toString()] || false}
          onCheckedChange={(checked) => onHodChange(item.key.toString(), checked)}
          disabled={isViewMode}
        />
      </div>
    </div>
  );
}
