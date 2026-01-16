import ButtonLink from "@/components/ButtonLink";
import { useTranslations } from "next-intl";
import { ChevronLeft, FileDown, Pencil, Printer, Save, Share, X } from "lucide-react";
import { formType } from "@/dtos/form.dto";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/lib/navigation";

interface Props {
  readonly currentMode: formType;
  readonly setCurrentMode: (mode: formType) => void;
  readonly title: string;
}

export default function ActionFields({ currentMode, setCurrentMode, title }: Props) {
  const tPurchaseRequest = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hover:bg-transparent w-8 h-8" asChild>
          <Link href="/procurement/purchase-request-template">
            <ChevronLeft />
          </Link>
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
              variant="outline"
              size="sm"
              className="px-2 text-xs"
              onClick={() => router.back()}
            >
              <ChevronLeft /> {tCommon("back")}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="px-2 text-xs"
              onClick={() => setCurrentMode(formType.EDIT)}
            >
              <Pencil /> {tCommon("edit")}
            </Button>
          </>
        ) : (
          <>
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
            <Button variant="default" size="sm" className="px-2 text-xs" type="submit">
              <Save /> {tCommon("save")}
            </Button>
          </>
        )}
        <Button variant="outline" size="sm" className="px-2 text-xs">
          <Printer /> {tCommon("print")}
        </Button>
        <Button variant="outline" size="sm" className="px-2 text-xs">
          <FileDown /> {tCommon("export")}
        </Button>
        <Button variant="outline" size="sm" className="px-2 text-xs">
          <Share /> {tCommon("share")}
        </Button>
      </div>
    </div>
  );
}
