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
import CreditNoteList from "./CreditNoteList";
import { mockCreditNotes } from "@/mock-data/procurement";
import { VIEW } from "@/constants/enum";
import CreditNoteGrid from "./CreditNoteGrid";
import ToggleView from "@/components/ui-custom/ToggleView";

export const creditNoteStatusColor = (status: string) => {
    if (status === 'Pending') {
        return 'bg-yellow-100 text-yellow-800';
    } else if (status === 'Draft') {
        return 'bg-blue-100 text-blue-800';
    } else if (status === 'Rejected') {
        return 'bg-red-100 text-red-800';
    } else if (status === 'Approved') {
        return 'bg-green-100 text-green-800';
    }
}


export default function CreditNoteComponent() {
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [view, setView] = useState<VIEW>(VIEW.LIST);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const title = "Credit Note"

    const actionButtons = (
        <div className="action-btn-container" data-id="credit-note-action-buttons">
            <Button size={'sm'}>
                <Plus className="h-4 w-4" />
                New Credit Note
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="credit-note-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="credit-note-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="credit-note-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="credit-note-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="credit-note-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="credit-note-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    <Filter className="h-4 w-4" />
                    Add Filter
                </Button>
                <ToggleView view={view} setView={setView} />
            </div>
        </div>
    );

    const ViewComponent = view === VIEW.LIST ? CreditNoteList : CreditNoteGrid;

    const content = <ViewComponent creditNotes={mockCreditNotes} />

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />
    )
} 