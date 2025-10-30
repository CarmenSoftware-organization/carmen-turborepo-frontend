import { StatusBadge } from "@/components/ui-custom/StatusBadge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { formType } from "@/dtos/form.dto";
import { Link, useRouter } from "@/lib/navigation";
import { formatDate } from "@/utils/format/date";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionFieldsProps {
  readonly currentMode: formType;
  readonly setCurrentMode: (mode: formType) => void;
  readonly isCreatePending: boolean;
  readonly isUpdatePending: boolean;
  readonly grnNo: string;
  readonly createdAt: string;
  readonly docStatus: string;
}

export default function ActionFields({
  currentMode,
  setCurrentMode,
  isCreatePending,
  isUpdatePending,
  grnNo,
  createdAt,
  docStatus,
}: ActionFieldsProps) {
  const router = useRouter();
  const { dateFormat } = useAuth();
  const tStatus = useTranslations("Status");
  const tCommon = useTranslations("Common");

  const convertStatus = (status: string) => {
    if (status === "submit") {
      return tStatus("submit");
    }
    if (status === "draft") {
      return tStatus("draft");
    }
    if (status === "Completed") {
      return tStatus("completed");
    }

    if (status === "in_progress") {
      return tStatus("in_progress");
    }
    if (status === "approved") {
      return tStatus("approved");
    }
    if (status === "rejected") {
      return tStatus("rejected");
    }
    if (status === "voided") {
      return tStatus("voided");
    }
    return "";
  };

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/procurement/goods-received-note">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("back")}</p>
            </TooltipContent>
          </Tooltip>
          <div className="flex items-start gap-2">
            {currentMode === formType.ADD ? (
              <p className="text-xl font-bold">Goods Received Note</p>
            ) : (
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">{grnNo}</p>
                <p className="text-sm font-medium text-muted-foreground">
                  Created at: {formatDate(createdAt, dateFormat || "yyyy/MM/dd")}
                </p>
              </div>
            )}
            {docStatus && <StatusBadge status={docStatus}>{convertStatus(docStatus)}</StatusBadge>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size={"sm"}
                  className="px-2 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentMode(formType.EDIT);
                  }}
                >
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
                  <Button
                    variant="outline"
                    size={"sm"}
                    className="px-2 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (currentMode === formType.ADD) {
                        router.push("/procurement/goods-received-note");
                      } else {
                        setCurrentMode(formType.VIEW);
                      }
                    }}
                  >
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
                    className="px-2 text-xs"
                    type="submit"
                    disabled={isCreatePending || isUpdatePending}
                  >
                    <Save />
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
              <Button variant="outline" size={"sm"} className="px-2 text-xs">
                <Printer />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("print")}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"sm"} className="px-2 text-xs">
                <FileDown />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("export")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"sm"} className="px-2 text-xs">
                <Share />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("share")}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
