"use client";

import { useAuth } from "@/context/AuthContext";
import { useCreditTermQuery } from "@/hooks/useCreditTerm";
import CreditTermList from "./CreditTermList";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useState } from "react";
import { useURL } from "@/hooks/useURL";
import { statusOptions } from "@/constants/options";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";

const sortFields = [
    { key: 'code', label: 'Code' },
    { key: 'name', label: 'Name' },
    { key: 'symbol', label: 'Symbol' },
    { key: 'is_active', label: 'Status' },
    { key: 'exchange_rate', label: 'Exchange Rate' },
];


export default function CreditTermComponent() {
    const { token, tenantId } = useAuth();
    const { creditTerms, isLoading } = useCreditTermQuery(token, tenantId);
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');

    const title = "Credit Term";

    const actionButtons = (
        <div className="action-btn-container" data-id="credit-term-action-buttons">
            <Button size={'sm'}>
                <Plus className="h-4 w-4" />
                New Credit Term
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="credit-term-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="credit-term-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );


    const filters = (
        <div className="filter-container" data-id="credit-term-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="credit-term-list-search-input"
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
            </div>
        </div>
    );

    const content = <CreditTermList creditTerms={creditTerms ?? []} isLoading={isLoading} />

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
        />
    );
};
