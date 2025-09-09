"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import VendorList from "./VendorList";
import SignInDialog from "@/components/SignInDialog";
import { useVendor } from "@/hooks/useVendor";
import { Link } from "@/lib/navigation";
import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useCallback, useEffect, useState } from "react";
import { parseSortString } from "@/utils/table-sort";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

const sortFields = [{ key: "name", label: "Name" }];

export default function VendorComponent() {
    const { token, buCode } = useAuth();

    const tCommon = useTranslations('Common');
    const tVendor = useTranslations('Vendor');
    const tAction = useTranslations('Action');
    const [search, setSearch] = useURL("search");
    const [status, setStatus] = useURL("status");
    const [statusOpen, setStatusOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [sort, setSort] = useURL("sort");
    const [page, setPage] = useURL("page");
    const [perpage, setPerpage] = useURL("perpage");

    const { vendors, isLoading, isUnauthorized } = useVendor(token, buCode, {
        search,
        sort,
        page: page ? parseInt(page) : 1,
        perpage: perpage ? parseInt(perpage) : 10,
    });

    const handlePageChange = useCallback(
        (newPage: number) => {
            setPage(newPage.toString());
        },
        [setPage]
    );

    useEffect(() => {
        if (isUnauthorized) {
            setLoginDialogOpen(true);
        }
    }, [isUnauthorized]);

    const handleSort = useCallback((field: string) => {
        if (!sort) {
            setSort(`${field}:asc`);
        } else {
            const [currentField, currentDirection] = sort.split(':') as [string, string];

            if (currentField === field) {
                const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';
                setSort(`${field}:${newDirection}`);
            } else {
                setSort(`${field}:asc`);
            }
            setPage("1");
        }
    }, [setSort, sort, setPage]);

    const handleSetPerpage = (newPerpage: number) => {
        setPerpage(newPerpage.toString());
    }

    const title = tVendor('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="vendor-action-buttons">
            <Button size={'sm'} asChild>
                <Link href={'/vendor-management/vendor/new'}>
                    <Plus className="h-4 w-4" />
                    {tVendor('add_vendor')}
                </Link>
            </Button>
            <Button
                variant="outlinePrimary"
                className="group"
                size={'sm'}
                data-id="vendor-list-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outlinePrimary"
                size={'sm'}
                data-id="vendor-list-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="vendor-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="vendor-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="vendor-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="vendor-list-sort-dropdown"
                />
                <Button size={'sm'}>
                    {tAction('filter')}
                </Button>
            </div>
        </div>
    );

    const content = (
        <VendorList
            vendors={vendors?.data}
            isLoading={isLoading}
            currentPage={parseInt(page || '1')}
            totalPages={vendors?.paginate.pages ?? 1}
            onPageChange={handlePageChange}
            sort={parseSortString(sort) ?? { field: '', direction: 'asc' }}
            onSort={handleSort}
            totalItems={vendors?.paginate.total ?? 0}
            perpage={vendors?.paginate.perpage ?? 10}
            setPerpage={handleSetPerpage}
        />
    );

    return (
        <>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />

            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </>
    )
} 