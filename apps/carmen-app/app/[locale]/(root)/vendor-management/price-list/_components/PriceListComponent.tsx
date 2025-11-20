"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListPriceList from "./ListPriceList";
import { useAuth } from "@/context/AuthContext";
import { usePriceLists } from "../_hooks/use-price-list";
import SignInDialog from "@/components/SignInDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useRouter } from "@/lib/navigation";
import { useURL } from "@/hooks/useURL";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { VIEW } from "@/constants/enum";
import PriceListGrid from "./PriceListGrid";

const sortFields = [{ key: "name", label: "Name" }];

export default function PriceListComponent() {
  const router = useRouter();
  const tCommon = useTranslations("Common");
  const tPriceList = useTranslations("PriceList");
  const { token, buCode } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [view, setView] = useState<VIEW>(VIEW.LIST);

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

  const filters = (
    <div className="filter-container" data-id="price-list-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="price-list-list-search-input"
      />
      <TooltipProvider>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <SortComponent
                  fieldConfigs={sortFields}
                  sort={sort}
                  setSort={setSort}
                  data-id="price-list-list-sort-dropdown"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tCommon("sort")}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size={"sm"}>
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{tCommon("filter")}</TooltipContent>
          </Tooltip>
          <div className="hidden lg:block">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === VIEW.LIST ? "default" : "outlinePrimary"}
                  size={"sm"}
                  onClick={() => setView(VIEW.LIST)}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("list_view")}</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={view === VIEW.GRID ? "default" : "outlinePrimary"}
                  size={"sm"}
                  onClick={() => setView(VIEW.GRID)}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tCommon("grid_view")}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );

  const content = (
    <>
      <div className="block lg:hidden">
        <PriceListGrid priceLists={priceLists ?? []} isLoading={isLoading} />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <ListPriceList priceLists={priceLists ?? []} isLoading={isLoading} />
        ) : (
          <PriceListGrid priceLists={priceLists ?? []} isLoading={isLoading} />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        content={content}
        title={tPriceList("title")}
        filters={filters}
        actionButtons={actionButtons}
      />
      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
