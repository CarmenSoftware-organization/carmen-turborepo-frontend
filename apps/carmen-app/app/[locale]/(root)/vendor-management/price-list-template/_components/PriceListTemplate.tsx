"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePriceListTemplates } from "@/hooks/use-price-list-template";
import { useURL } from "@/hooks/useURL";
import { Button } from "@/components/ui/button";

import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SignInDialog from "@/components/SignInDialog";
import PriceListTemplateList from "./PriceListTemplateList";
import PriceListTemplateGrid from "./PriceListTemplateGrid";
import { VIEW } from "@/constants/enum";

const sortFields = [{ key: "name", label: "Name" }];

export default function PriceListTemplate() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tPlt = useTranslations("PriceListTemplate");
  const router = useRouter();
  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { data: templates, isLoading, isUnauthorized } = usePriceListTemplates(token, buCode);

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const title = tPlt("title");

  const actionButtons = (
    <div className="action-btn-container" data-id="price-list-template-action-buttons">
      <Button
        size={"sm"}
        onClick={() => {
          router.push("/vendor-management/price-list-template/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {tCommon("add")}
      </Button>

      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="price-list-template-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        <p>{tCommon("export")}</p>
      </Button>

      <Button variant="outlinePrimary" size={"sm"} data-id="price-list-template-list-print-button">
        <Printer className="h-4 w-4" />
        <p>{tCommon("print")}</p>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="price-list-template-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="price-list-template-list-search-input"
      />
      <div className="flex items-center gap-2">
        <div>
          <SortComponent
            fieldConfigs={sortFields}
            sort={sort}
            setSort={setSort}
            data-id="price-list-template-list-sort-dropdown"
          />
        </div>

        <Button size={"sm"}>
          <Filter className="h-4 w-4" />
          {tCommon("filter")}
        </Button>

        <div className="hidden lg:block">
          <div className="flex items-center gap-2">
            <Button
              variant={view === VIEW.LIST ? "default" : "outlinePrimary"}
              size={"sm"}
              onClick={() => setView(VIEW.LIST)}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === VIEW.GRID ? "default" : "outlinePrimary"}
              size={"sm"}
              onClick={() => setView(VIEW.GRID)}
              aria-label="Grid view"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const content = (
    <>
      <div className="block lg:hidden">
        <PriceListTemplateGrid templates={templates?.data ?? []} isLoading={isLoading} />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <PriceListTemplateList templates={templates?.data ?? []} isLoading={isLoading} />
        ) : (
          <PriceListTemplateGrid templates={templates?.data ?? []} isLoading={isLoading} />
        )}
      </div>
    </>
  );

  return (
    <>
      <DataDisplayTemplate
        title={title}
        actionButtons={actionButtons}
        filters={filters}
        content={content}
      />

      <SignInDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
}
