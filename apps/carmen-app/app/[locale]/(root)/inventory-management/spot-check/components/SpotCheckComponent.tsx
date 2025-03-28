"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Building, Grid, List, Plus } from "lucide-react";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusSpotCheckOptions } from "@/constants/options";
import { Select, SelectValue, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";
import { mockDepartments, mockSpotCheckData } from "@/mock-data/inventory-management";
import SpotCheckList from "./SpotCheckList";
import SportCheckGrid from "./SportCheckGrid";

enum VIEW {
    List = 'list',
    Grid = 'grid',
}

export default function SpotCheckComponent() {
    const t = useTranslations("InventoryManagement");
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [view, setView] = useState<VIEW>(VIEW.List);
    const title = t("SpotCheck.title");

    const actionButtons = (
        <div className="action-btn-container" data-id="spot-check-list-action-buttons">
            <Button
                variant="outline"
                size={'sm'}
                data-id="spot-check-list-print-button"
            >
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="spot-check-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="spot-check-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusSpotCheckOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="spot-check-list-status-search-dropdown"
                />
                <Select >
                    <SelectTrigger className="w-full h-8">
                        <SelectValue placeholder="All Departments" data-id="spot-check-list-department-search-dropdown" />
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
                <Button
                    size={'sm'}
                >
                    <Building className="h-4 w-4" />
                </Button>
                <Button
                    variant={view === VIEW.List ? 'default' : 'outline'}
                    size={'sm'}
                    onClick={() => setView(VIEW.List)}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant={view === VIEW.Grid ? 'default' : 'outline'}
                    size={'sm'}
                    onClick={() => setView(VIEW.Grid)}
                >
                    <Grid className="h-4 w-4" />
                </Button>

            </div>
        </div>
    );

    const content = (
        <div>
            {view === VIEW.List && <SpotCheckList spotCheckData={mockSpotCheckData} />}
            {view === VIEW.Grid && <SportCheckGrid spotCheckData={mockSpotCheckData} />}
        </div>
    )


    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />

    )
}
