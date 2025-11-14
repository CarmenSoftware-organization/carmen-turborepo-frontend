"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCampaigns } from "@/hooks/campaign";
import { useURL } from "@/hooks/useURL";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { FileDown, Filter, Grid, List, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SignInDialog from "@/components/SignInDialog";
import CampaignList from "./CampaignList";
import CampaignGrid from "./CampaignGrid";
import { VIEW } from "@/constants/enum";

const sortFields = [{ key: "name", label: "Name" }];

export default function Campaign() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const router = useRouter();

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const [view, setView] = useState<VIEW>(VIEW.LIST);

  const { data, isLoading, isUnauthorized } = useCampaigns(token, buCode);

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const title = "Campaign";

  const actionButtons = (
    <TooltipProvider>
      <div className="action-btn-container" data-id="campaign-action-buttons">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size={"sm"}
              onClick={() => {
                router.push("/vendor-management/campaign/new");
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add Campaign</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outlinePrimary"
              className="group"
              size={"sm"}
              data-id="campaign-list-export-button"
            >
              <FileDown className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("export")}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outlinePrimary" size={"sm"} data-id="campaign-list-print-button">
              <Printer className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{tCommon("print")}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );

  const filters = (
    <div className="filter-container" data-id="vendor-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="vendor-list-search-input"
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
                  data-id="pr-list-sort-dropdown"
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
            <div className="flex items-center gap-2">
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
        </div>
      </TooltipProvider>
    </div>
  );

  const content = (
    <>
      <div className="block lg:hidden">
        <CampaignGrid campaigns={data ?? []} isLoading={isLoading} />
      </div>

      <div className="hidden lg:block">
        {view === VIEW.LIST ? (
          <CampaignList campaigns={data ?? []} isLoading={isLoading} />
        ) : (
          <CampaignGrid campaigns={data ?? []} isLoading={isLoading} />
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
