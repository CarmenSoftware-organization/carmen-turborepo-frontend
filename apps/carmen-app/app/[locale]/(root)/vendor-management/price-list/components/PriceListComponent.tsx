"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { useURL } from "@/hooks/useURL";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import { useCallback, useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListPriceList from "./ListPriceList";
import { useAuth } from "@/context/AuthContext";
import { usePriceList } from "@/hooks/usePriceList";
import SignInDialog from "@/components/SignInDialog";
import FormDialogPriceList from "./FormDialogPriceList";
import { SortConfig } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

const sortFields = [
    { key: 'name', label: 'Name' },
    { key: 'is_active', label: 'Status' }
];

const parseSortString = (sortString: string | null): SortConfig => {
    if (!sortString) return { field: '', direction: 'asc' };
    const [field, direction] = sortString.split(':');
    return { field: field || '', direction: (direction as 'asc' | 'desc') || 'asc' };
};

export default function PriceListComponent() {
    const tCommon = useTranslations('Common');
    const tPriceList = useTranslations('PriceList');
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [sort, setSort] = useURL('sort');
    const [statusOpen, setStatusOpen] = useState(false);
    const { token, buCode } = useAuth();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [page, setPage] = useURL('page');
    const [perpage, setPerpage] = useURL('perpage');

    const { data: response, isLoading, isUnauthorized } = usePriceList(token, buCode, {
        page,
        search,
        filter,
        sort,
        perpage: perpage ? Number(perpage) : 10,
    });

    const priceLists = response?.data ?? [];
    const totalItems = response?.paginate?.total ?? 0;
    const totalPages = response?.paginate?.pages ?? 1;
    const currentPage = response?.paginate?.page ?? 1;
    const currentPerpage = response?.paginate?.perpage ?? 10;

    useEffect(() => {
        if (isUnauthorized) {
            setLoginDialogOpen(true);
        }
    }, [isUnauthorized]);

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage.toString());
        },
        [setPage]
    );

    const handleSetPerpage = (newPerpage: number) => {
        setPerpage(newPerpage.toString());
    }


    const actionButtons = (
        <div className="action-btn-container" data-id="price-list-list-action-buttons">
            <FormDialogPriceList
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
            />
            <Button
                variant="outlinePrimary"
                size={'sm'}
                data-id="price-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outlinePrimary"
                size={'sm'}
                data-id="price-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="price-list-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="price-list-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="price-list-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="price-list-list-sort-dropdown"
                />
            </div>
        </div>
    )

    const content = (
        <ListPriceList
            priceLists={priceLists}
            isLoading={isLoading}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={currentPage}
            perpage={currentPerpage}
            onPageChange={handlePageChange}
            sort={parseSortString(sort)}
            onSort={setSort}
            setPerpage={handleSetPerpage}
        />
    )

    return (
        <>
            <DataDisplayTemplate
                content={content}
                title={tPriceList("title")}
                actionButtons={actionButtons}
                filters={filters}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    )
}


