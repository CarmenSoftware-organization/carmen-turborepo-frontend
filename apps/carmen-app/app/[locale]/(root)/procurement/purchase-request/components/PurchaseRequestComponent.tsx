"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import PurchaseRequestList from "./PurchaseRequestList";
import { mockPurchaseRequests } from "@/mock-data/procurement";
import DialogNewPr from "./DialogNewPr";

export default function PurchaseRequestComponent() {
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const title = "Purchase Request";

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    const actionButtons = (
        <div className="action-btn-container" data-id="purchase-request-action-buttons">
            <Button size={'sm'} onClick={handleOpenDialog}>
                <Plus className="h-4 w-4" />
                {tCommon('add')} Purchase Request
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="pr-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="pr-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="pr-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="pr-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="pr-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="pr-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    <Filter className="h-4 w-4" />
                    Filter
                </Button>
            </div>

        </div>
    );

    const content = <PurchaseRequestList purchaseRequests={mockPurchaseRequests} />

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <DialogNewPr open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    )
}
