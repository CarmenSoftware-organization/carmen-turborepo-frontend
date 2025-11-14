"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCampaigns } from "@/hooks/campaign";
import { useURL } from "@/hooks/useURL";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/navigation";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SignInDialog from "@/components/SignInDialog";
import CampaignList from "./CampaignList";

const sortFields = [{ key: "name", label: "Name" }];

export default function Campaign() {
  const { token, buCode } = useAuth();
  const tCommon = useTranslations("Common");
  const tAction = useTranslations("Action");

  const router = useRouter();

  const [search, setSearch] = useURL("search");
  const [sort, setSort] = useURL("sort");
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);

  const { data, isLoading, isUnauthorized } = useCampaigns(token, buCode);

  useEffect(() => {
    if (isUnauthorized) {
      setLoginDialogOpen(true);
    }
  }, [isUnauthorized]);

  const title = "Campaign";

  const actionButtons = (
    <div className="action-btn-container" data-id="campaign-action-buttons">
      <Button
        size={"sm"}
        onClick={() => {
          router.push("/vendor-management/campaign/new");
        }}
      >
        <Plus className="h-4 w-4" />
        {/* {tVendor("add_vendor")} */}
      </Button>
      <Button
        variant="outlinePrimary"
        className="group"
        size={"sm"}
        data-id="campaign-list-export-button"
      >
        <FileDown className="h-4 w-4" />
        {/* {tCommon("export")} */}
      </Button>
      <Button variant="outlinePrimary" size={"sm"} data-id="campaign-list-print-button">
        <Printer className="h-4 w-4" />
        {/* {tCommon("print")} */}
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="vendor-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="vendor-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="vendor-list-status-search-dropdown"
        />
        <SortComponent
          fieldConfigs={sortFields}
          sort={sort}
          setSort={setSort}
          data-id="vendor-list-sort-dropdown"
        />
        <Button size={"sm"}>{tAction("filter")}</Button>
      </div>
    </div>
  );

  const content = <CampaignList campaigns={data ?? []} isLoading={isLoading} />;

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
