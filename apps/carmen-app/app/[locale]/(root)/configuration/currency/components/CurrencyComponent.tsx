"use client";
import { useURL } from "@/hooks/useURL";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FileDown, Plus, Printer } from "lucide-react";
import SearchInput from "@/components/ui-custom/SearchInput";
import StatusSearchDropdown from "@/components/ui-custom/StatusSearchDropdown";
import { statusOptions } from "@/constants/options";
import SortComponent from "@/components/ui-custom/SortComponent";
import DataDisplayTemplate from "@/components/templates/DataDisplayTemplate";
import { CurrencyDto } from "@/dtos/config.dto";
import { useAuth } from "@/context/AuthContext";
import { createCurrency, getCurrenciesService, updateCurrency, toggleCurrencyStatus } from "@/services/currency.service";
import CurrencyList from "./CurrencyList";
import { formType } from "@/dtos/form.dto";
import CurrencyDialog from "./CurrencyDialog";
import DeleteConfirmDialog from "@/components/ui-custom/DeleteConfirmDialog";
import { z } from "zod";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import SignInDialog from "@/components/SignInDialog";

export default function CurrencyComponent() {
    const { token, tenantId } = useAuth();
    const tCurrency = useTranslations('Currency');
    const tCommon = useTranslations('Common');
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDto | undefined>();
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            if (!token) return;
            try {
                setIsLoading(true);
                const data = await getCurrenciesService(token, tenantId, {
                    search,
                    page: currentPage.toString(),
                    perPage: '10',
                });
                if (data.statusCode === 401) {
                    setLoginDialogOpen(true);
                    return;
                }
                setCurrencies(data.data);
                setTotalPages(data.paginate.pages);
                setCurrentPage(data.paginate.page);
            } catch (error) {
                console.error('Error fetching currencies:', error);
                toastError({ message: 'Error fetching currencies' });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCurrencies();
    }, [search, token, currentPage, tenantId]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'is_active', label: 'Status' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    const handleAdd = () => {
        setSelectedCurrency(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (currency: CurrencyDto) => {
        setSelectedCurrency(currency);
        setDialogOpen(true);
    };

    const handleToggleStatus = async (currency: CurrencyDto) => {
        if (!currency.id) {
            toastError({ message: 'Invalid currency ID' });
            return;
        }

        if (currency.is_active) {
            // If active, show confirmation dialog before deactivating
            setSelectedCurrency(currency);
            setConfirmDialogOpen(true);
        } else {
            // If inactive, directly activate
            await performToggleStatus(currency);
        }
    };

    const performToggleStatus = async (currency: CurrencyDto) => {
        try {
            setIsSubmitting(true);
            const result = await toggleCurrencyStatus(token, tenantId, currency.id!, currency.is_active);
            if (result) {
                setCurrencies(prevCurrencies =>
                    prevCurrencies.map(c =>
                        c.id === currency.id
                            ? { ...c, is_active: !c.is_active }
                            : c
                    )
                );
                toastSuccess({ message: `Currency ${!currency.is_active ? 'activated' : 'deactivated'} successfully` });
            } else {
                toastError({ message: 'Error toggling currency status' });
            }
        } catch (error) {
            console.error('Error toggling currency status:', error);
            toastError({ message: 'Error toggling currency status' });
        } finally {
            setIsSubmitting(false);
            setConfirmDialogOpen(false);
            setSelectedCurrency(undefined);
        }
    };

    const handleConfirmToggle = async () => {
        if (selectedCurrency) {
            await performToggleStatus(selectedCurrency);
        }
    };

    const handleSubmit = async (data: CurrencyDto) => {
        try {
            setIsSubmitting(true);
            if (selectedCurrency) {
                // Edit mode
                const updatedCurrency = { ...data, id: selectedCurrency.id };
                const result = await updateCurrency(token, tenantId, updatedCurrency);
                if (result) {
                    setCurrencies(prevCurrencies =>
                        prevCurrencies.map(currency =>
                            currency.id === selectedCurrency.id
                                ? updatedCurrency
                                : currency
                        )
                    );
                    toastSuccess({ message: 'Currency updated successfully' });
                } else {
                    console.error('Error updating currency:', result);
                    toastError({ message: 'Error updating currency' });
                }
            } else {
                // Add mode
                const result = await createCurrency(token, tenantId, data);
                const newCurrency: CurrencyDto = {
                    ...data,
                    id: result.id,
                };
                setCurrencies(prevCurrencies => [...prevCurrencies, newCurrency]);
                toastSuccess({ message: 'Currency created successfully' });
            }
            setDialogOpen(false);
            setSelectedCurrency(undefined);
        } catch (error) {
            console.error('Error handling currency submission:', error);
            if (error instanceof z.ZodError) {
                console.error('Zod Validation Errors:', error.errors);
            }
            toastError({ message: 'Error handling currency submission' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

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
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
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
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
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

