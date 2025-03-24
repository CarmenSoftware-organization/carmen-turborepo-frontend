'use client';

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { Button } from "@/components/ui/button";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

const statusOptions = [
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
];

const sortFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
];

export default function UserManagementList() {
    const t = useTranslations('UserManagement');
    const tCommon = useTranslations('Common');
    const title = t('title');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');

    const actionButtons = (
        <div className="action-btn-container" data-id="user-management-list-action-buttons">
            <Button size={'sm'}>
                <Plus />
                {tCommon('add')}
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="delivery-point-export-button"
            >
                <FileDown className="h-4 w-4" />
                {tCommon('export')}
            </Button>
            <Button
                variant="outline"
                size={'sm'}
                data-id="delivery-point-print-button"
            >
                <Printer className="h-4 w-4" />
                {tCommon('print')}
            </Button>
        </div>
    );

    const filters = (
        <div className="filter-container" data-id="user-management-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="user-management-list-search-input"
            />
            <div className="flex items-center">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="delivery-point-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="delivery-point-sort-dropdown"
                />
            </div>
            <Button>
                <Search />
                {tCommon('search')}
            </Button>
        </div>
    )

    const content = (
        <div>
            <h1>User Management</h1>
        </div>
    )

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filters}
            content={content}
            data-id="user-management-list"
        />
    )
}
