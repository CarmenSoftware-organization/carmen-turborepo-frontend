import { Switch } from "@/components/ui/switch";
import { TransferItem } from "@/dtos/transfer.dto";
import { Crown, User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";

interface Props {
  item: TransferItem;
  hodStates: Record<string, boolean>;
  onHodChange: (key: string, checked: boolean) => void;
  isViewMode: boolean;
}

export default function UserItem({ item, hodStates, onHodChange, isViewMode }: Props) {
  const tDepartment = useTranslations("Department");
  const isHod = hodStates[item.key.toString()] || false;
  const switchId = `hod-switch-${item.key}`;

  return (
    <div
      className={cn(
        "flex items-center justify-between w-full gap-3 py-1.5 px-2 -mx-2 rounded-md transition-colors",
        isHod && "bg-primary/5"
      )}
      role="listitem"
      aria-label={`${item.title}${isHod ? ` - ${tDepartment("head_of_department")}` : ""}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          className={cn(
            "flex items-center justify-center h-7 w-7 rounded-full shrink-0 transition-colors",
            isHod ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
          )}
          aria-hidden="true"
        >
          {isHod ? (
            <Crown className="h-3.5 w-3.5" />
          ) : (
            <User className="h-3.5 w-3.5" />
          )}
        </div>
        <span
          className={cn(
            "text-sm truncate transition-colors",
            isHod && "font-medium text-primary"
          )}
          title={item.title?.toString()}
        >
          {item.title}
        </span>
      </div>

      {/* HOD Toggle */}
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 shrink-0">
              <Label
                htmlFor={switchId}
                className={cn(
                  "text-xs cursor-pointer select-none transition-colors",
                  isHod ? "text-primary font-medium" : "text-muted-foreground",
                  isViewMode && "cursor-not-allowed opacity-50"
                )}
              >
                HOD
              </Label>
              <Switch
                id={switchId}
                checked={isHod}
                onCheckedChange={(checked) => onHodChange(item.key.toString(), checked)}
                disabled={isViewMode}
                aria-label={`${tDepartment("set_as_hod")} ${item.title}`}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="text-xs">
            <p>{tDepartment("hod_tooltip")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
