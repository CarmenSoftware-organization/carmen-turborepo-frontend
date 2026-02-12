import { Button } from "@/components/ui/button";
import { formType } from "@/dtos/form.dto";
import { useRouter } from "@/lib/navigation";
import { ChevronLeft, FileDown, Loader2, Pencil, Printer, Save, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "next/navigation";
import { convertStatus } from "@/utils/status";
import { usePurchaseRequestContext } from "./PurchaseRequestContext";

interface ActionFieldsProps {
  isViewOnly?: boolean;
}

export default function ActionFields({ isViewOnly }: ActionFieldsProps) {
  const {
    currentMode,
    initValues,
    setCurrentMode: onModeChange,
    handleCancel: onCancel,
    isDirty: hasFormChanges,
    isCreatingPr,
    prStatus,
    isDisabled,
  } = usePurchaseRequestContext();
  const tPr = useTranslations("PurchaseRequest");
  const router = useRouter();
  const tStatus = useTranslations("Status");
  const tCommon = useTranslations("Common");
  const searchParams = useSearchParams();

  const getStatusLabel = (status: string) => convertStatus(status, tStatus);

  const onEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onModeChange(formType.EDIT);
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const returnUrl = searchParams.get("returnUrl");
    const backUrl = returnUrl || "/procurement/purchase-request";
    if (currentMode === formType.EDIT) {
      if (hasFormChanges) {
        onCancel(e, "back");
      } else {
        router.push(backUrl);
      }
    } else {
      router.push(backUrl);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="hover:bg-transparent w-7 h-7"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("back")}</p>
            </TooltipContent>
          </Tooltip>

          <div className="flex items-center gap-2">
            {currentMode === formType.ADD ? (
              <p className="text-lg font-semibold">{tPr("title")}</p>
            ) : (
              <p className="text-lg font-semibold">{initValues?.pr_no}</p>
            )}
            {initValues?.pr_status && (
              <Badge variant={initValues?.pr_status}>{getStatusLabel(initValues?.pr_status)}</Badge>
            )}
          </div>
        </div>
        {!isViewOnly && prStatus !== "voided" && (
          <div className="flex items-center gap-2">
            {currentMode === formType.VIEW ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="default" size={"sm"} className="text-xs" onClick={onEdit}>
                    <Pencil />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCommon("edit")}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size={"sm"} onClick={(e) => onCancel(e, "cancel")}>
                      <X />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tCommon("cancel")}</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="default"
                      size={"sm"}
                      type="submit"
                      disabled={isDisabled}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      {isCreatingPr ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{tCommon("save")}</p>
                  </TooltipContent>
                </Tooltip>
              </>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"sm"}>
                  <Printer />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("print")}</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"sm"}>
                  <FileDown />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("export")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size={"sm"}>
                  <Share />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("share")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
