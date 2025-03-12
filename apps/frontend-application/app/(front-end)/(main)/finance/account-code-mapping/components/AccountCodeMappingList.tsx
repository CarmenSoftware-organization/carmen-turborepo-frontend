"use client";

import React, { useCallback, useEffect, useState } from 'react'
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import DisplayComponent from '@/components/templates/DisplayComponent';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import SearchForm from '@/components/ui-custom/SearchForm';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { Button } from '@/components/ui/button';
import { useURL } from '@/hooks/useURL';
import { statusOptions } from '@/lib/statusOptions';
import { FieldConfig } from '@/lib/util/uiConfig';
import { export_text, print_text, Search } from '@/paraglide/messages';
import { FileDown, Printer } from 'lucide-react';

enum AccountCodeMappingField {
    Store = 'store',
    Category = 'category',
    SubCategory = 'subCategory',
    ItemGroup = 'itemGroup',
    Department = 'department',
    AccountCode = 'accountCode',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortFields: FieldConfig<any>[] = [
    { key: AccountCodeMappingField.Store, label: 'Store', className: 'w-20' },
    { key: AccountCodeMappingField.Category, label: 'Category', className: 'w-20' },
    { key: AccountCodeMappingField.SubCategory, label: 'Sub Category', className: 'w-20' },
    { key: AccountCodeMappingField.ItemGroup, label: 'Item Group', className: 'w-20' },
    { key: AccountCodeMappingField.Department, label: 'Department', className: 'w-20' },
    { key: AccountCodeMappingField.AccountCode, label: 'Account Code', className: 'w-20' },
]

const AccountCodeMappingList = () => {
    const [accountCodeMapping, setAccountCodeMapping] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [statusOpen, setStatusOpen] = useState(false);
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [page, setPage] = useURL('page');
    const [pages, setPages] = useURL('pages');

    const fetchAccountCodeMapping = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/finance/account-code-mapping');
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch account code mapping');
            }

            setAccountCodeMapping(result.data);
            setPage('1');
            setPages('10');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAccountCodeMapping();
    }, []);

    const handleSuccess = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (values: any) => {
            console.log('values', values);
        },
        [setAccountCodeMapping]
    );

    const handleDelete = useCallback(
        async (id: string) => {
            console.log('id', id);
        },
        [setAccountCodeMapping]
    );

    const title = 'Account Code Mapping';


    const actionButtons = (
        <div
            className="action-btn-container"
            data-id="account-code-mapping-action-btn-container"
        >
            <Button
                variant="outline"
                size={'sm'}
                data-id="account-code-mapping-refresh-button"
            >
                Add Account Code Mapping
            </Button>
            <Button
                variant="outline"
                className="group"
                size={'sm'}
                data-id="account-code-mapping-export-button"
            >
                <FileDown className="h-4 w-4" />
                {export_text()}
            </Button>
            <Button variant="outline" size={'sm'} data-id="account-code-mapping-print-button">
                <Printer className="h-4 w-4" />
                {print_text()}
            </Button>
        </div>
    );


    const filter = (
        <div className="filter-container" data-id="account-code-mapping-filter-container">
            <SearchForm
                defaultValue={search}
                onSearch={setSearch}
                placeholder={`${Search()}...`}
                data-id="account-code-mapping-search-form"
            />
            <div className="all-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="account-code-mapping-status-search-dropdown"
                />
                <SortDropDown
                    fieldConfigs={sortFields}
                    items={accountCodeMapping}
                    onSort={setAccountCodeMapping}
                />
            </div>
        </div>
    );

    const content = error ? (
        <ErrorCard message={error} data-id="account-code-mapping-error-card" />
    ) : (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <DisplayComponent<any>
            items={accountCodeMapping}
            fields={sortFields}
            idField="id"
            onSuccess={handleSuccess}
            onDelete={handleDelete}
            page={+page}
            totalPage={+pages}
            setPage={setPage}
            data-id="account-code-mapping-display-component"
        />
    );

    return (
        <DataDisplayTemplate
            title={title}
            actionButtons={actionButtons}
            filters={filter}
            content={content}
            isLoading={isLoading}
            data-id="accout-code-mapping-data-display-template"
        />
    )
}

export default AccountCodeMappingList