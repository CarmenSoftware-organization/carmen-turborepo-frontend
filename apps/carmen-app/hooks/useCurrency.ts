import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useCallback, useEffect, useState } from "react";
import { CurrencyDto } from "@/dtos/config.dto";
import { createCurrency, getCurrenciesService, updateCurrency, toggleCurrencyStatus } from "@/services/currency.service";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";

export const useCurrency = () => {
    const { token, tenantId } = useAuth();
    const [search, setSearch] = useURL('search');
    const [filter, setFilter] = useURL('filter');
    const [statusOpen, setStatusOpen] = useState(false);
    const [sort, setSort] = useURL('sort');
    const [currencies, setCurrencies] = useState<CurrencyDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyDto | undefined>();
    const [totalPages, setTotalPages] = useState(1);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [page, setPage] = useURL("page");

    useEffect(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    const fetchCurrencies = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const data = await getCurrenciesService(token, tenantId, {
                search,
                page,
                sort,
                filter
            });
            if (data?.statusCode === 401) {
                setLoginDialogOpen(true);
                return;
            }
            setCurrencies(data?.data ?? []);
            setTotalPages(data?.paginate?.pages ?? 1);
        } catch (error) {
            console.error('Error fetching currencies:', error);
            toastError({ message: 'Error fetching currencies' });
            setCurrencies([]);
            setTotalPages(1);
        } finally {
            setIsLoading(false);
        }
    }, [token, tenantId, search, page, sort, filter]);

    useEffect(() => {
        fetchCurrencies();
    }, [fetchCurrencies]);

    const handleSetFilter = useCallback((filterValue: string) => {
        setFilter(filterValue);
        setPage('');
    }, [setFilter, setPage]);

    const sortFields = [
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'symbol', label: 'Symbol' },
        { key: 'exchange_rate', label: 'Exchange Rate' },
    ];

    // Just set the sort string directly without parsing
    const handleSetSort = useCallback((sortValue: string) => {
        setSort(sortValue);
    }, [setSort]);

    const handleAdd = useCallback(() => {
        setSelectedCurrency(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((currency: CurrencyDto) => {
        setSelectedCurrency(currency);
        setDialogOpen(true);
    }, []);

    const performToggleStatus = useCallback(async (currency: CurrencyDto) => {
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
    }, [token, tenantId]);

    const handleToggleStatus = useCallback(async (currency: CurrencyDto) => {
        if (!currency.id) {
            toastError({ message: 'Invalid currency ID' });
            return;
        }

        if (currency.is_active) {
            setSelectedCurrency(currency);
            setConfirmDialogOpen(true);
        } else {
            await performToggleStatus(currency);
        }
    }, [performToggleStatus]);

    const handleConfirmToggle = useCallback(async () => {
        if (selectedCurrency) {
            await performToggleStatus(selectedCurrency);
        }
    }, [selectedCurrency, performToggleStatus]);

    const handleSubmit = useCallback(async (data: CurrencyDto) => {
        try {
            setIsSubmitting(true);
            if (selectedCurrency) {
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
            toastError({ message: 'Error handling currency submission' });
        } finally {
            setIsSubmitting(false);
        }
    }, [token, tenantId, selectedCurrency]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    return {
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

        // Status helper
        handleSetFilter,

        // Sort helper
        handleSetSort,

        // Functions
        handlePageChange,
        sortFields,
        handleAdd,
        handleEdit,
        handleToggleStatus,
        handleConfirmToggle,
        handleSubmit,
        fetchCurrencies
    };
}; 