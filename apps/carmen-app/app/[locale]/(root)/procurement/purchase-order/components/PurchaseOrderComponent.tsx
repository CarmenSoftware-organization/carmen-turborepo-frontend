"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Filter, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useURL } from "@/hooks/useURL";
import { useCallback, useEffect, useState } from "react";
import PurchaseOrderList from "./PurchaseOrderList";
import { mockPurchaseOrders } from "@/mock-data/procurement";
import DialogNewPo from "./DialogNewPo";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { parseSortString } from "@/utils/table-sort";

export default function PurchaseOrderComponent() {
    const tCommon = useTranslations('Common');
    const tDataControls = useTranslations("DataControls");
    const tPurchaseOrder = useTranslations("PurchaseOrder");
    const [search, setSearch] = useURL('search');
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [page, setPage] = useURL("page");
    const [perpage, setPerpage] = useURL("perpage");

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

    const totalItems = mockPurchaseOrders.length;
    const totalPages = 1;

    useEffect(() => {
        if (search) {
            setPage("");
        }
    }, [search, setPage]);

    const handleSetPerpage = (newPerpage: number) => {
        setPerpage(newPerpage.toString());
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage.toString());
    };


    const title = tPurchaseOrder("title");

    const filters = (
        <div className="filter-container" data-id="po-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon("search")}
                data-id="po-list-search-input"
            />

            <div className="flex items-center gap-2">
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="po-list-sort-dropdown"
                />
                <Button size={"sm"}>
                    <Filter className="h-4 w-4" />
                    {tDataControls("filter")}
                </Button>
            </div>
        </div>
    );

    const actionButtons = (
        <div
            className="action-btn-container"
            data-id="po-action-buttons"
        >
            <Button size={"sm"} onClick={handleOpenDialog}>
                <Plus />
                {tCommon("add")} {title}
            </Button>
            <Button
                variant="outlinePrimary"
                className="group"
                size={"sm"}
                data-id="po-list-export-button"
            >
                <FileDown />
                {tCommon("export")}
            </Button>
            <Button variant="outlinePrimary" size={"sm"} data-id="pr-list-print-button">
                <Printer />
                {tCommon("print")}
            </Button>
        </div>
    );

    const content = (
        <PurchaseOrderList
            purchaseOrders={mockPurchaseOrders}
            currentPage={page ? parseInt(page) : 1}
            totalPages={totalPages}
            totalItems={totalItems}
            perpage={perpage ? parseInt(perpage) : 10}
            onPageChange={handlePageChange}
            isLoading={false}
            sort={parseSortString(sort)}
            onSort={setSort}
            setPerpage={handleSetPerpage}
        />
    )

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <DialogNewPo open={dialogOpen} onOpenChange={setDialogOpen} />
        </>
    );
}
