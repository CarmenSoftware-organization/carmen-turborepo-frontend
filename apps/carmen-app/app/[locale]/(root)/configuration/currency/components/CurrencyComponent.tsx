"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { formType } from "@/dtos/form.dto";
import CurrencyList from "./CurrencyList";
import CurrencyDialog from "./CurrencyDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import SignInDialog from "@/components/SignInDialog";
import { useCallback, useMemo, useState } from "react";
import { SortConfig, SortDirection } from "@/utils/table-sort";
import { useAuth } from "@/context/AuthContext";
import { useCurrenciesQuery, useCurrencyMutation, useCurrencyUpdateMutation, useCurrencyDeleteMutation } from "@/hooks/useCurrencie";
import { useURL } from "@/hooks/useURL";
import { CurrencyGetDto, CurrencyCreateDto, CurrencyUpdateDto } from "@/dtos/currency.dto";
import { useQueryClient } from "@tanstack/react-query";
import { toastSuccess, toastError } from "@/components/ui-custom/Toast";
import StatusSearchDropdown from "@/components/form-custom/StatusSearchDropdown";

export default function CurrencyComponent() {
    const { token, tenantId } = useAuth();
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyGetDto | undefined>();
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [page, setPage] = useURL("page");
    const [perpage, setPerpage] = useURL("perpage");
    const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
    const tCurrency = useTranslations('Currency');
    const tCommon = useTranslations('Common');
    const tHeader = useTranslations('TableHeader');
    const queryClient = useQueryClient();

    const { currencies: data, isLoading } = useCurrenciesQuery(token, tenantId, {
        search: search || undefined,
        page: page || 1,
        filter: filter || undefined,
        sort: sort || undefined,
        perpage: perpage || 10
    });

    const currenciesData = data?.data ?? [];
    const currencies = Array.isArray(data) ? data : currenciesData;
    const totalPages = data?.paginate?.pages ?? 1;
    const totalItems = data?.paginate?.total ?? 0;

    const handleAdd = useCallback(() => {
        setSelectedCurrency(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((currency: CurrencyGetDto) => {
        setSelectedCurrency(currency);
        setDialogOpen(true);
    }, []);

    const deleteStatusMutation = useCurrencyDeleteMutation(token, tenantId);

    const handleToggleStatus = useCallback(async (currency: CurrencyUpdateDto) => {
        if (!currency.id) {
            toastError({ message: tCurrency("invalid_id") });
            return;
        }

        if (currency.is_active) {
            setSelectedCurrency(currency);
            setConfirmDialogOpen(true);
        } else {
            toastSuccess({ message: tCurrency("activate_success") });
        }
    }, []);

    const handleConfirmToggle = useCallback(() => {
        if (selectedCurrency?.id) {
            deleteStatusMutation.mutate(selectedCurrency.id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['currencies'] });
                    toastSuccess({ message: tCurrency("deactivate_success") });
                    setConfirmDialogOpen(false);
                    setSelectedCurrency(undefined);
                },
                onError: (error: unknown) => {
                    console.error('Error deactivating currency:', error);
                    toastError({ message: tCurrency("deactivate_error") });
                }
            });
        }
    }, [selectedCurrency, deleteStatusMutation, queryClient]);

    const createCurrencyMutation = useCurrencyMutation(token, tenantId);

    const updateCurrencyMutation = useCurrencyUpdateMutation(token, tenantId, selectedCurrency?.id || '');

    const handleSubmit = useCallback(async (data: CurrencyCreateDto) => {
        if (selectedCurrency) {
            updateCurrencyMutation.mutate({ ...data, id: selectedCurrency.id }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['currencies'] });
                    toastSuccess({ message: tCurrency("update_success") });
                    setDialogOpen(false);
                    setSelectedCurrency(undefined);
                },
                onError: (error: unknown) => {
                    console.error('Error updating currency:', error);
                    toastError({ message: tCurrency("update_error") });
                }
            });
        } else {
            createCurrencyMutation.mutate(data, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['currencies'] });
                    toastSuccess({ message: tCurrency("create_success") });
                    setDialogOpen(false);
                    setSelectedCurrency(undefined);
                },
                onError: (error: unknown) => {
                    console.error('Error creating currency:', error);
                    toastError({ message: tCurrency("create_error") });
                }
            });
        }
    }, [selectedCurrency, updateCurrencyMutation, createCurrencyMutation, queryClient]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    const isSubmitting = createCurrencyMutation.isPending ||
        updateCurrencyMutation.isPending ||
        deleteStatusMutation.isPending;


    const sortFields = [
        {
            key: "name",
            label: tHeader("name"),
        },
        {
            key: "is_active",
            label: tHeader("status"),
        },
        {
            key: "exchange_rate",
            label: tHeader("exchangeRate")
        }
    ];

    const handleSelectAll = useCallback((checked: boolean) => {
        if (checked) {
            setSelectedCurrencies(currencies.map((c: CurrencyGetDto) => c.id));
        } else {
            setSelectedCurrencies([]);
        }
    }, [currencies]);

    const handleSelect = useCallback((currencyId: string) => {
        setSelectedCurrencies(prev =>
            prev.includes(currencyId)
                ? prev.filter(id => id !== currencyId)
                : [...prev, currencyId]
        );
    }, []);

    const parsedSort = useMemo((): SortConfig | undefined => {
        if (!sort) return undefined;

        const parts = sort.split(':');
        if (parts.length !== 2) return undefined;

        return {
            field: parts[0],
            direction: parts[1] as SortDirection
        };
    }, [sort]);

    const handleSetPerpage = (newPerpage: number) => {
        setPerpage(newPerpage.toString());
    };

    const title = tCurrency('title');

    const actionButtons = (
        <div className="action-btn-container" data-id="currency-list-action-buttons">
            <Button size={'sm'} onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                {tCommon('add')}
            </Button>
            <Button
                variant="outlinePrimary"
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
            <div className="fxr-c gap-2">
                <StatusSearchDropdown
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
            totalItems={totalItems}
            onPageChange={handlePageChange}
            sort={parsedSort}
            onSort={(field) => {
                const direction = parsedSort?.field === field && parsedSort.direction === 'asc' ? 'desc' : 'asc';
                setSort(`${field}:${direction}`);
            }}
            selectedCurrencies={selectedCurrencies}
            onSelectAll={handleSelectAll}
            onSelect={handleSelect}
            perpage={data?.paginate?.perpage}
            setPerpage={handleSetPerpage}
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
                title={tCurrency('deactivate_currency')}
                description={tCurrency('deactivate_currency_description')}
            />
            <SignInDialog
                open={loginDialogOpen}
                onOpenChange={setLoginDialogOpen}
            />
        </div>
    );
}

