import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Check, ChevronRight } from "lucide-react";
import { usePurchaseRequestContext } from "./PurchaseRequestContext";

export default function WorkflowStep() {
  const { workflowStages } = usePurchaseRequestContext();

  if (!workflowStages || workflowStages.length === 0) return null;

  return (
    <Card className="p-2">
      <div className="flex items-center gap-1 flex-wrap">
        {workflowStages.map((step, index) => {
          const isLast = index === workflowStages.length - 1;
          const uniqueKey = `${step.title}-${index}`;
          return (
            <div key={uniqueKey} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
              )}
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0",
                    "bg-active text-white"
                  )}
                >
                  {isLast ? <Check className="h-3 w-3" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs whitespace-nowrap",
                    isLast ? "font-semibold text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
