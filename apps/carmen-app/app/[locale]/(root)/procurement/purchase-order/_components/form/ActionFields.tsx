import ButtonLink from "@/components/ButtonLink";
import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  FileDown,
  Loader2,
  Pencil,
  Printer,
  Save,
  Share,
  Trash2,
  X,
} from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "@/lib/navigation";

interface Props {
  readonly currentMode: formType;
  readonly setCurrentMode: (mode: formType) => void;
  readonly title: string;
  readonly isPending?: boolean;
  readonly canSubmit?: boolean;
  readonly onDelete?: () => void;
}

export default function ActionFields({
  currentMode,
  setCurrentMode,
  title,
  isPending = false,
  canSubmit = true,
  onDelete,
}: Props) {
  const tPurchaseOrder = useTranslations("PurchaseOrder");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <ButtonLink href="/procurement/purchase-order">
                <ChevronLeft className="h-4 w-4" />
              </ButtonLink>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("back")}</p>
            </TooltipContent>
          </Tooltip>
          {currentMode === formType.ADD ? (
            <p className="text-xl font-bold">{tPurchaseOrder("title")}</p>
          ) : (
            <p className="text-xl font-bold">{title}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {currentMode === formType.VIEW ? (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 text-xs"
                    onClick={() => router.back()}
                  >
                    <ChevronLeft /> {tCommon("back")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCommon("back")}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="px-2 text-xs"
                    onClick={() => setCurrentMode(formType.EDIT)}
                  >
                    <Pencil /> {tCommon("edit")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tCommon("edit")}</p>
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="px-2 text-xs"
                    onClick={() =>
                      currentMode === formType.ADD ? router.back() : setCurrentMode(formType.VIEW)
                    }
                  >
                    <X /> {tCommon("cancel")}
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
                    size="sm"
                    className="px-2 text-xs"
                    type="submit"
                    disabled={isPending || !canSubmit}
                  >
                    {isPending ? <Loader2 className="animate-spin" /> : <Save />} {tCommon("save")}
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
              <Button variant="outline" size="sm" className="px-2 text-xs">
                <Printer /> {tCommon("print")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("print")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="px-2 text-xs">
                <FileDown /> {tCommon("export")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("export")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="px-2 text-xs">
                <Share /> {tCommon("share")}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("share")}</p>
            </TooltipContent>
          </Tooltip>
          {currentMode === formType.VIEW && onDelete && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  <Trash2 /> {tCommon("delete")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("delete")}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
