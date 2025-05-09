"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { useBoolFilterOptions } from "@/constants/status-option";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { formType } from "@/dtos/form.dto";
import CurrencyList from "./CurrencyList";
import CurrencyDialog from "./CurrencyDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import SignInDialog from "@/components/SignInDialog";
import { useCurrency } from "@/hooks/useCurrency";
import { useMemo } from "react";
import { SortConfig, SortDirection } from "@/utils/table-sort";

export default function CurrencyComponent() {
    const tCurrency = useTranslations('Currency');
    const tCommon = useTranslations('Common');
    const boolFilterOptions = useBoolFilterOptions();

    const {
        // State
        search,
        setSearch,
        filter,
        setFilter,
        statusOpen,
        setStatusOpen,
        sort,
        setSort,
        currencies,
        isLoading,
        isSubmitting,
        dialogOpen,
        setDialogOpen,
        confirmDialogOpen,
        setConfirmDialogOpen,
        selectedCurrency,
        totalPages,
        loginDialogOpen,
        setLoginDialogOpen,
        page,

        // Functions
        handlePageChange,
        sortFields,
        handleAdd,
        handleEdit,
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit
    } = useCurrency();

    // Parse the sort string into field and direction
    const parsedSort = useMemo((): SortConfig | undefined => {
        if (!sort) return undefined;

        const parts = sort.split(':');
        if (parts.length !== 2) return undefined;

        return {
            field: parts[0],
            direction: parts[1] as SortDirection
        };
    }, [sort]);

    const title = tCurrency('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="currency-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                <Plus className="h-4 w-4" />
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
        <div className="filter-container" data-id="unit-list-filters">
            <SearchInput
                defaultValue={search}
                onSearch={setSearch}
                placeholder={tCommon('search')}
                data-id="unit-list-search-input"
            />
            <div className="flex items-center gap-2">
                <StatusSearchDropdown
                    options={boolFilterOptions}
                    value={filter}
                    onChange={setFilter}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                    data-id="product-list-status-search-dropdown"
                />
                <SortComponent
                    fieldConfigs={sortFields}
                    sort={sort}
                    setSort={setSort}
                    data-id="product-list-sort-dropdown"
                />
            </div>
        </div>
    );

    const content = (
        <CurrencyList
            isLoading={isLoading}
            currencies={currencies}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatus}
            currentPage={parseInt(page || '1')}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            sort={parsedSort}
            onSort={(field) => {
                const direction = parsedSort?.field === field && parsedSort.direction === 'asc' ? 'desc' : 'asc';
                setSort(`${field}:${direction}`);
            }}
        />
    );

    return (
        <div>
            <DataDisplayTemplate
                title={title}
                actionButtons={actionButtons}
                filters={filters}
                content={content}
            />
            <CurrencyDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                mode={selectedCurrency ? formType.EDIT : formType.ADD}
                currency={selectedCurrency}
                onSubmit={handleSubmit}
                isLoading={isSubmitting}
            />
            <DeleteConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                onConfirm={handleConfirmToggle}
                title="Deactivate Currency"
                description="Are you sure you want to deactivate this currency? This action can be reversed later."
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </div>
    );
}

