"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Printer } from "lucide-react";
import { useURL } from "@/hooks/useURL";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import SortComponent from "@/components/ui-custom/SortComponent";
import { boolFilterOptions } from "@/constants/options";
import { useEffect, useState } from "react";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import ListPriceList from "./ListPriceList";
import { useAuth } from "@/context/AuthContext";
import { usePriceList } from "@/hooks/usePriceList";
import SignInDialog from "@/components/SignInDialog";
import FormDialogPriceList from "./FormDialogPriceList";

const sortFields = [
    { key: 'name', label: 'Name' },
    { key: 'is_active', label: 'Status' }
];

export default function PriceListComponent() {
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [sort, setSort] = useURL('sort');
    const [statusOpen, setStatusOpen] = useState(false);
    const { token, tenantId } = useAuth();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const { data: response, isLoading, isUnauthorized } = usePriceList(token, tenantId, {
        search,
        filter,
        sort
    });

    const priceLists = response?.data ?? [];

    useEffect(() => {
        if (isUnauthorized) {
            setLoginDialogOpen(true);
        }
    }, [isUnauthorized]);

    const actionButtons = (
        <div className="action-btn-container" data-id="price-list-list-action-buttons">
            <FormDialogPriceList
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
            />
            <Button
                variant="outline"
                size={'sm'}
                data-id="price-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
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
                    options={boolFilterOptions}
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

    const content = <ListPriceList priceLists={priceLists} isLoading={isLoading} />

    return (
        <>
            <DataDisplayTemplate
                content={content}
                title="Price List"
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
