"use client";

import { useListPageState } from "@/hooks/use-list-page-state";
import { useURL } from "@/hooks/useURL";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Building, Grid, List, Plus } from "lucide-react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { mockDepartments, mockPhysicalCountData } from "@/mock-data/inventory-management";
import PcmList from "./PcmList";
import PcmGrid from "./PcmGrid";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";
enum VIEW {
  List = "list",
  Grid = "grid",
}

export default function PhysicalCountManagementComponent() {
  const t = useTranslations("InventoryManagement");
  const tCommon = useTranslations("Common");
  const { search, setSearch } = useListPageState();
  const [status, setStatus] = useURL("status");
  const [statusOpen, setStatusOpen] = useState(false);
  const [view, setView] = useState<VIEW>(VIEW.List);
  const title = t("PhysicalCountManagement.title");

  const actionButtons = (
    <div className="action-btn-container" data-id="physical-count-list-action-buttons">
      <Button variant={"default"} size={"sm"} data-id="physical-count-list-print-button" asChild>
        <Link href={"/inventory-management/physical-count-management/new"}>
          <Plus className="h-4 w-4" />
          New Physical Count
        </Link>
      </Button>
    </div>
  );

  const filters = (
    <div className="filter-container" data-id="physical-count-list-filters">
      <SearchInput
        defaultValue={search}
        onSearch={setSearch}
        placeholder={tCommon("search")}
        data-id="physical-count-list-search-input"
      />
      <div className="flex items-center gap-2">
        <StatusSearchDropdown
          value={status}
          onChange={setStatus}
          open={statusOpen}
          onOpenChange={setStatusOpen}
          data-id="physical-count-list-status-search-dropdown"
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
          variant={view === VIEW.List ? "default" : "outline"}
          size={"sm"}
          onClick={() => setView(VIEW.List)}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={view === VIEW.Grid ? "default" : "outline"}
          size={"sm"}
          onClick={() => setView(VIEW.Grid)}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const content = (
    <div>
      {view === VIEW.List && <PcmList physicalCountData={mockPhysicalCountData} />}
      {view === VIEW.Grid && <PcmGrid physicalCountData={mockPhysicalCountData} />}
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
