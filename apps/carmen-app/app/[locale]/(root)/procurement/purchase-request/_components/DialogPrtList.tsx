"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { usePrTemplateQuery } from "@/hooks/use-pr-tmpl";
import { PurchaseRequestTemplateDto } from "@/dtos/pr-template.dto";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import PrtTable from "./PrtTable";

interface Props {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export default function DialogPrtList({ open, onOpenChange }: Props) {
  const router = useRouter();
  const { token, buCode } = useAuth();
  const tPr = useTranslations("PurchaseRequest");
  const tCommon = useTranslations("Common");

  const [selectedTemplate, setSelectedTemplate] = useState<PurchaseRequestTemplateDto | null>(null);
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(10);

  const { prTmplData, paginate, isLoading } = usePrTemplateQuery(token, buCode, {
    page: page,
    perpage: perpage,
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePerPageChange = (newPerpage: number) => {
    setPerpage(newPerpage);
    setPage(1);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      router.push(
        `/procurement/purchase-request/new?type=template&template_id=${selectedTemplate.id}`
      );
    }
    onOpenChange(false);
    setSelectedTemplate(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{tPr("template_pr")}</DialogTitle>
          <DialogDescription>{tPr("select_template_desc")}</DialogDescription>
        </DialogHeader>
        <PrtTable
          prtDatas={prTmplData ?? []}
          paginate={paginate}
          isLoading={isLoading}
          currentPage={page}
          perpage={perpage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
          onSelectTemplate={setSelectedTemplate}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {tCommon("cancel")}
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedTemplate}>
            {tCommon("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
