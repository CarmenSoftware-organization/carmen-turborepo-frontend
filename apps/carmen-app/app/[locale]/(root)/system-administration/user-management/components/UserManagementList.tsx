'use client';

import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import SearchInput from "@/components/ui-custom/SearchInput";
import { Button } from "@/components/ui/button";
import { useURL } from "@/hooks/useURL";
import { FileDown, Plus, Printer, Search } from "lucide-react";
import { useTranslations } from "next-intl";

export default function UserManagementList() {
    const t = useTranslations('UserManagement');
    const tCommon = useTranslations('Common');
    const title = t('title');
    const [search, setSearch] = useURL('search');

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
        />
    )
}
