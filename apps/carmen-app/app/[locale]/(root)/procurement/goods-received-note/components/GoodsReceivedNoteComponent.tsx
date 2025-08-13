"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import GoodsReceivedNoteList from "./GoodsReceivedNoteList";
import GoodsReceivedNoteDialog from "./GoodsReceivedNoteDialog";
import { useGrn } from "@/hooks/useGrn";
import SignInDialog from "@/components/SignInDialog";
import { parseSortString } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function GoodsReceivedNoteComponent() {
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const {
        grns,
        isLoading,
        search, setSearch,
        sort, setSort,
        loginDialogOpen, setLoginDialogOpen,
        dialogOpen, setDialogOpen,
        handlePageChange,
        handleSort
    } = useGrn();

    const totalItems = grns?.paginate?.total;
    const perpage = grns?.paginate?.perpage;

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const title = tHeader("title_goods_received_note")

    const actionButtons = (
        <div className="action-btn-container" data-id="grn-action-buttons">
            <Button
                size={'sm'}
                onClick={() => setDialogOpen(true)}
                data-id="grn-new-button"
            >
                <Plus className="h-4 w-4" />
                {tCommon("add")}
            </Button>
            <Button
                variant="outlinePrimary"
                className="group"
                size={'sm'}
                data-id="grn-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outlinePrimary"
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
            <div className="fxr-c gap-2">
                <StatusSearchDropdown
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
                    {tCommon("filter")}
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
        totalItems={totalItems}
        sort={parseSortString(sort) || { field: '', direction: 'asc' }}
        onSort={handleSort}
        perpage={perpage}
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