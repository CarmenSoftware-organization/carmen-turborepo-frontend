"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListPriceList from "./ListPriceList";
import { useAuth } from "@/context/AuthContext";
import { usePriceLists } from "../_hooks/use-price-list";
import SignInDialog from "@/components/SignInDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "@/lib/navigation";

export default function PriceListComponent() {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const { data: priceLists, isLoading, isUnauthorized } = usePriceLists(token, buCode);

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const actionButtons = (
    <TooltipProvider>
      <div className="action-btn-container" data-id="price-list-action-buttons">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              onClick={() => {
                router.push("/vendor-management/price-list/new");
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tPriceList("add_price_list")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outlinePrimary"
              className="group"
              size={"sm"}
              data-id="price-list-list-export-button"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("export")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outlinePrimary" size={"sm"} data-id="price-list-list-print-button">
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("print")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const content = <ListPriceList priceLists={priceLists} isLoading={isLoading} />;

  return (
    <>
      <DataDisplayTemplate
        content={content}
        title={tPriceList("title")}
        actionButtons={actionButtons}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
