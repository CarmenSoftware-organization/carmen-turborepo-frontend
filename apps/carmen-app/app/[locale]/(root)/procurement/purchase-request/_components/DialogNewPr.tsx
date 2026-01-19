"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "@/lib/navigation";
import { Building2, FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import DialogPrtList from "./DialogPrtList";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function DialogNewPr({ open, onOpenChange }: Props) {
  const router = useRouter();
  const tPr = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");
  const [prtListOpen, setPrtListOpen] = useState(false);

  const handleSelectTemplate = () => {
    onOpenChange(false);
    setPrtListOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{tPr("create_new_pr")}</DialogTitle>
            <DialogDescription>{tPr("create_new_pr_desc")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Card
              className="cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-in-out"
              onClick={() => router.push("/procurement/purchase-request/new?type=blank")}
            >
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {tPr("blank_pr")}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{tPr("blank_pr_desc")}</p>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:bg-accent/50 transition-all duration-300 ease-in-out"
              onClick={handleSelectTemplate}
            >
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    {tPr("template_pr")}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">{tPr("blank_pr_desc")}</p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogPrtList open={prtListOpen} onOpenChange={setPrtListOpen} />
    </>
  );
}
