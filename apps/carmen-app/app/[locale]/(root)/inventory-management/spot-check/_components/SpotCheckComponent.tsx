"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Building, Grid, List, Plus } from "lucide-react";
import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mockDepartments, mockSpotCheckData } from "@/mock-data/inventory-management";
import SpotCheckList from "./SpotCheckList";
import { Link } from "@/lib/navigation";
import SpotCheckGrid from "./SpotCheckGrid";
import { VIEW } from "@/constants/enum";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
export default function SpotCheckComponent() {
  const t = useTranslations("InventoryManagement");
  const tCommon = useTranslations("Common");
  const { search, setSearch } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.LIST);
  const title = t("SpotCheck.title");

  const actionButtons = (
    <div className="flex flex-col md:flex-row gap-2" data-id="spot-check-list-action-buttons">
      <Button variant={"default"} size={"sm"} data-id="spot-check-list-print-button" asChild>
        <Link href={"/inventory-management/spot-check/new"}>
          <Plus className="h-4 w-4" />
          New Spot Check
        </Link>
      </Button>
    </div>
  );

  const filters = (
    <div className="flex flex-col md:flex-row gap-4 justify-between" data-id="spot-check-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="spot-check-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="spot-check-list-status-search-dropdown"
        />
        <Select>
          <SelectTrigger className="w-full h-8">
            <SelectValue
              placeholder="All Departments"
              data-id="spot-check-list-department-search-dropdown"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {mockDepartments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button size={"sm"}>
          <Building className="h-4 w-4" />
        </Button>
        <Button
          variant={view === VIEW.LIST ? "default" : "outline"}
          size={"sm"}
          onClick={() => setView(VIEW.LIST)}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={view === VIEW.GRID ? "default" : "outline"}
          size={"sm"}
          onClick={() => setView(VIEW.GRID)}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const content = (
    <div>
      {view === VIEW.LIST && <SpotCheckList spotCheckData={mockSpotCheckData} />}
      {view === VIEW.GRID && <SpotCheckGrid spotCheckData={mockSpotCheckData} />}
    </div>
  );

  return (
    <DataDisplayTemplate
      title={title}
      actionButtons={actionButtons}
      filters={filters}
      content={content}
    />
  );
}
