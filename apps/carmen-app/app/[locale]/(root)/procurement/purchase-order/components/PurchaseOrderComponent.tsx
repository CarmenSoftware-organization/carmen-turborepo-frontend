"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useState } from "react";
import PurchaseOrderList from "./PurchaseOrderList";
import { mockPurchaseOrders } from "@/mock-data/procurement";
import DialogNewPo from "./DialogNewPo";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function PurchaseOrderComponent() {
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

    const handleOpenDialog = () => {
        setDialogOpen(true);
    };

    return (
        <div className="space-y-4 flex w-full flex-col justify-center transition-all duration-300 ease-in-out">
            <div className="md:flex justify-between items-start">
                <h1 className="text-2xl font-semibold">Purchase Order</h1>
                <div className="action-btn-container" data-id="purchase-order-action-buttons">
                    <Button size={'sm'} onClick={handleOpenDialog}>
                        <Plus className="h-4 w-4" />
                        New Purchase Order
                    </Button>
                    <Button
                        variant="outlinePrimary"
                        className="group"
                        size={'sm'}
                        data-id="po-list-export-button"
                    >
                        <FileDown className="h-4 w-4" />
                        {tCommon('export')}
                    </Button>
                    <Button
                        variant="outlinePrimary"
                        size={'sm'}
                        data-id="po-list-print-button"
                    >
                        <Printer className="h-4 w-4" />
                        {tCommon('print')}
                    </Button>
                </div>
            </div>
            <div className="filter-container" data-id="po-list-filters">
                <SearchInput
                    defaultValue={search}
                    onSearch={setSearch}
                    placeholder={tCommon('search')}
                    data-id="po-list-search-input"
                />
                <div className="flex items-center gap-2">
                    <StatusSearchDropdown
                        value={status}
                        onChange={setStatus}
                        open={statusOpen}
                        onOpenChange={setStatusOpen}
                        data-id="po-list-status-search-dropdown"
                    />
                    <SortComponent
                        fieldConfigs={sortFields}
                        sort={sort}
                        setSort={setSort}
                        data-id="po-list-sort-dropdown"
                    />
                    <Button size={'sm'}>
                        <Filter className="h-4 w-4" />
                        Add Filter
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-background rounded-lg">
                <PurchaseOrderList purchaseOrders={mockPurchaseOrders} />
            </div>

            <DialogNewPo open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
}
