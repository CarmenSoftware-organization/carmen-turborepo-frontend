"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import GoodsReceivedNoteList from "./GoodsReceivedNoteList";
import GoodsReceivedNoteDialog from "./GoodsReceivedNoteDialog";
import { useGrn } from "@/hooks/useGrn";
import SignInDialog from "@/components/SignInDialog";

const grnStatusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Received', value: 'received' },
    { label: 'Partial', value: 'partial' },
    { label: 'Voided', value: 'voided' },
    { label: 'Cancelled', value: 'cancelled' },
]
export default function GoodsReceivedNoteComponent() {
    const tCommon = useTranslations('Common');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const {
        grns,
        isLoading,
        search, setSearch,
        sort, setSort,
        loginDialogOpen, setLoginDialogOpen,
        dialogOpen, setDialogOpen,
        handlePageChange
    } = useGrn();


    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const title = "Goods Received Note";

    const actionButtons = (
        <div className="action-btn-container" data-id="grn-action-buttons">
            <Button
                size={'sm'}
                onClick={() => setDialogOpen(true)}
                data-id="grn-new-button"
            >
                <Plus className="h-4 w-4" />
                New Goods Received Note
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="grn-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="grn-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="grn-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="grn-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={grnStatusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="grn-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="grn-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    <Filter className="h-4 w-4" />
                    Add Filter
                </Button>
            </div>
        </div>
    );

    const content = <GoodsReceivedNoteList
        goodsReceivedNotes={grns.data}
        currentPage={grns.currentPage}
        totalPages={grns.totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
    />

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <GoodsReceivedNoteDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    )
} 