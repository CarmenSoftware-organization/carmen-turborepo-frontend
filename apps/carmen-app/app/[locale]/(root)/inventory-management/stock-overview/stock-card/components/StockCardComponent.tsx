"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { mockStockCardData } from "@/mock-data/inventory-management";
import StockCardList from "./StockCardList";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function StockCardComponent() {
    const t = useTranslations("InventoryManagement");
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' }
    ];

    const title = t("StockCard.title");

    const actionButtons = (
        <div className="action-btn-container" data-id="stock-card-action-buttons">
            <Button size={'sm'}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="stock-card-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="stock-card-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="stock-card-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="stock-card-list-search-input"
            />
            <div className="fxr-c gap-2">
                <StatusSearchDropdown
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="stock-card-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="stock-card-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    Add Filter
                </Button>
            </div>
        </div>
    );

    const content = <StockCardList stockCardData={mockStockCardData} />

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />
    )
}
