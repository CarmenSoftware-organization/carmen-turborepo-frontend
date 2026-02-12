"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "@/lib/navigation";
import { FilePlus2, FileStack, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import DialogPrtList from "./DialogPrtList";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function DialogNewPr({ open, onOpenChange }: Props) {
  const router = useRouter();
  const tPr = useTranslations("PurchaseRequest");
  const [prtListOpen, setPrtListOpen] = useState(false);

  const handleSelectTemplate = () => {
    onOpenChange(false);
    setPrtListOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[420px] gap-0">
          <DialogHeader className="px-5 pt-5 pb-3">
            <DialogTitle className="text-sm">{tPr("create_new_pr")}</DialogTitle>
            <DialogDescription className="text-xs">{tPr("create_new_pr_desc")}</DialogDescription>
          </DialogHeader>

          <div className="border-t border-border">
            <button
              type="button"
              className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-muted/50 transition-colors cursor-pointer border-b border-border"
              onClick={() => router.push("/procurement/purchase-request/new?type=blank")}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 shrink-0">
                <FilePlus2 className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{tPr("blank_pr")}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{tPr("blank_pr_desc")}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>

            <button
              type="button"
              className="flex items-center gap-3 w-full px-5 py-3.5 text-left hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={handleSelectTemplate}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-violet-50 shrink-0">
                <FileStack className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium">{tPr("template_pr")}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {tPr("template_pr_desc")}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <DialogPrtList open={prtListOpen} onOpenChange={setPrtListOpen} />
    </>
  );
}
