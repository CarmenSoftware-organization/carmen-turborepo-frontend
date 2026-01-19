import { useTranslations } from "next-intl";
import {
  ChevronLeft,
  FileDown,
  Loader,
  Pencil,
  Printer,
  Save,
  Share,
  Trash2,
  X,
} from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";

interface Props {
  readonly currentMode: formType;
  readonly setCurrentMode: (mode: formType) => void;
  readonly title: string;
  readonly isPending?: boolean;
  readonly canSubmit?: boolean;
  readonly onDelete?: () => void;
  readonly isDeleting?: boolean;
}

export default function ActionFields({
  currentMode,
  setCurrentMode,
  title,
  isPending = false,
  canSubmit = true,
  onDelete,
  isDeleting = false,
}: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="hover:bg-transparent w-8 h-8"
          onClick={(e) => {
            e.preventDefault();
            router.push("/procurement/purchase-request-template");
          }}
        >
          <ChevronLeft />
        </Button>
        {currentMode === formType.ADD ? (
          <p className="text-xl font-bold">{tPurchaseRequest("template")}</p>
        ) : (
          <p className="text-xl font-bold">{title}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {currentMode === formType.VIEW ? (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.back();
              }}
            >
              <ChevronLeft /> {tCommon("back")}
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              className="px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentMode(formType.EDIT);
              }}
            >
              <Pencil /> {tCommon("edit")}
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                currentMode === formType.ADD ? router.back() : setCurrentMode(formType.VIEW);
              }}
            >
              <X /> {tCommon("cancel")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-2 text-xs"
              type="submit"
              disabled={isPending || !canSubmit}
            >
              {isPending ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save /> {tCommon("save")}
                </>
              )}
            </Button>
          </>
        )}
        <Button type="button" variant="outline" size="sm" className="px-2 text-xs">
          <Printer /> {tCommon("print")}
        </Button>
        <Button type="button" variant="outline" size="sm" className="px-2 text-xs">
          <FileDown /> {tCommon("export")}
        </Button>
        <Button type="button" variant="outline" size="sm" className="px-2 text-xs">
          <Share /> {tCommon("share")}
        </Button>
        {onDelete && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="text-xs"
            disabled={isDeleting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
          >
            {isDeleting ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Trash2 /> {tCommon("delete")}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
