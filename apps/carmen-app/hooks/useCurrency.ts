import { useAuth } from "@/context/AuthContext";
import { useURL } from "@/hooks/useURL";
import { useCallback, useState } from "react";
import { createCurrency, getCurrenciesService, updateCurrency, toggleCurrencyStatus } from "@/services/currency.service";
import { toastError, toastSuccess } from "@/components/ui-custom/Toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CurrencyCreateDto, CurrencyGetDto, CurrencyUpdateDto } from "@/dtos/currency.dto";

export const useCurrency = () => {
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

    const queryClient = useQueryClient();

    // When search changes, reset page and sort
    useCallback(() => {
        if (search) {
            setPage('');
            setSort('');
        }
    }, [search, setPage, setSort]);

    // Fetch currencies query
    const {
        data: currenciesData,
        isLoading,
        refetch: fetchCurrencies
    } = useQuery({
        queryKey: ['currencies', token, tenantId, search, page, sort, filter],
        queryFn: async () => {
            if (!token) return { data: [], paginate: { pages: 1 } };

            const data = await getCurrenciesService(token, tenantId, {
                search,
                page,
                sort,
                filter
            });

            if (data?.status === 401) {
                setLoginDialogOpen(true);
                return { data: [], paginate: { pages: 1 } };
            }

            return data;
        },
        select: (data) => ({
            currencies: data?.data ?? [],
            totalPages: data?.paginate?.pages ?? 1,
        }),
        enabled: !!token,
    });

    const currencies = currenciesData?.currencies ?? [];
    const totalPages = currenciesData?.totalPages ?? 1;

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

    const handleSetSort = useCallback((sortValue: string) => {
        setSort(sortValue);
    }, [setSort]);

    const handleAdd = useCallback(() => {
        setSelectedCurrency(undefined);
        setDialogOpen(true);
    }, []);

    const handleEdit = useCallback((currency: CurrencyGetDto) => {
        setSelectedCurrency(currency);
        setDialogOpen(true);
    }, []);

    // Toggle currency status mutation
    const toggleStatusMutation = useMutation({
        mutationFn: async (currency: CurrencyUpdateDto) => {
            if (!currency.id) throw new Error('Invalid currency ID');
            return toggleCurrencyStatus(token, tenantId, currency.id, currency.is_active);
        },
        onSuccess: (_, currency) => {
            queryClient.invalidateQueries({ queryKey: ['currencies'] });
            toastSuccess({
                message: `Currency ${!currency.is_active ? 'activated' : 'deactivated'} successfully`
            });
            setConfirmDialogOpen(false);
            setSelectedCurrency(undefined);
        },
        onError: (error) => {
            console.error('Error toggling currency status:', error);
            toastError({ message: 'Error toggling currency status' });
        }
    });

    const handleToggleStatus = useCallback(async (currency: CurrencyUpdateDto) => {
        if (!currency.id) {
            toastError({ message: 'Invalid currency ID' });
            return;
        }

        if (currency.is_active) {
            setSelectedCurrency(currency);
            setConfirmDialogOpen(true);
        } else {
            toggleStatusMutation.mutate(currency);
        }
    }, [toggleStatusMutation]);

    const handleConfirmToggle = useCallback(() => {
        if (selectedCurrency) {
            toggleStatusMutation.mutate(selectedCurrency);
        }
    }, [selectedCurrency, toggleStatusMutation]);

    // Create currency mutation
    const createCurrencyMutation = useMutation({
        mutationFn: async (data: CurrencyCreateDto) => {
            return createCurrency(token, tenantId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencies'] });
            toastSuccess({ message: 'Currency created successfully' });
            setDialogOpen(false);
            setSelectedCurrency(undefined);
        },
        onError: (error) => {
            console.error('Error creating currency:', error);
            toastError({ message: 'Error creating currency' });
        }
    });

    // Update currency mutation
    const updateCurrencyMutation = useMutation({
        mutationFn: async (data: CurrencyUpdateDto) => {
            if (!data.id) throw new Error('Invalid currency ID');
            return updateCurrency(token, tenantId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currencies'] });
            toastSuccess({ message: 'Currency updated successfully' });
            setDialogOpen(false);
            setSelectedCurrency(undefined);
        },
        onError: (error) => {
            console.error('Error updating currency:', error);
            toastError({ message: 'Error updating currency' });
        }
    });

    const handleSubmit = useCallback(async (data: CurrencyCreateDto) => {
        if (selectedCurrency) {
            updateCurrencyMutation.mutate({ ...data, id: selectedCurrency.id });
        } else {
            createCurrencyMutation.mutate(data);
        }
    }, [selectedCurrency, updateCurrencyMutation, createCurrencyMutation]);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage.toString());
    }, [setPage]);

    const isSubmitting = createCurrencyMutation.isPending ||
        updateCurrencyMutation.isPending ||
        toggleStatusMutation.isPending;

    const getCurrencyCode = (currencyId: string): string => {
        if (!currencyId || !currencies || !Array.isArray(currencies)) return "-";
        const currency = currencies.find(c => c.id === currencyId);
        return currency?.code ?? "-";
    };

    const getCurrencyExchangeRate = (currencyId: string): number => {
        if (!currencyId || !currencies || !Array.isArray(currencies)) return 0;
        const currency = currencies.find(c => c.id === currencyId);
        return currency?.exchange_rate ?? 0;
    };

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
        fetchCurrencies,
        getCurrencyCode,
        getCurrencyExchangeRate
    };
}; 