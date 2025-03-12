'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useURL } from '@/hooks/useURL';
import { CurrencyCreateModel } from '@/dtos/currency.dto';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import {
    currency,
    currency_delete_success,
    error_del_text,
    fail_del_currency,
    fail_to_text,
    session_expire
} from '@/paraglide/messages.js';
import { deleteCurrency, fetchCurrencies, fetchExchangeRates, findChangedRates, prepareCurrentRates } from '@/services/currency';

export const useCurrency = () => {
    const { accessToken, tenantId } = useAuth();
    const token = accessToken || '';
    const [currencies, setCurrencies] = useState<CurrencyCreateModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [statusOpen, setStatusOpen] = useState(false);
    const [showRefreshToken, setShowRefreshToken] = useState(false);
    const [search, setSearch] = useURL('search');
    const [status, setStatus] = useURL('status');
    const [page, setPage] = useURL('page');
    const [pages, setPages] = useURL('pages');

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await fetchCurrencies(token, tenantId, {
                search,
                status,
                page,
            });
            setCurrencies(data.data);
            setPage(data.pagination.page);
            setPages(data.pagination.pages);
            setShowRefreshToken(false);
        } catch (err) {
            if (err instanceof Error && err.message === 'Unauthorized') {
                toastError({
                    message: 'Your session has expired. Please login again.',
                });
                setShowRefreshToken(true);
                setCurrencies([]);
            } else {
                setError(err instanceof Error ? err.message : 'An error occurred');
                toastError({ message: `${fail_to_text()} ${currency()}` });
            }
        } finally {
            setIsLoading(false);
        }
    }, [token, tenantId, search, status, page]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSuccess = useCallback(
        (value: CurrencyCreateModel | CurrencyCreateModel[]) => {
            setCurrencies((prev) => {
                const values = Array.isArray(value) ? value : [value];
                const mapValues = new Map(prev.map((u) => [u.id, u]));
                values.forEach((v) => {
                    mapValues.set(v.id, v);
                });
                return Array.from(mapValues.values());
            });
        },
        []
    );

    const handleDelete = useCallback(
        async (id: string) => {
            try {
                const res = await deleteCurrency(id, token, tenantId);
                if (res) {
                    setCurrencies((prev) => prev.filter((p) => p.id !== id));
                    toastSuccess({ message: `${currency_delete_success()}` });
                }
            } catch (error) {
                if (error instanceof Error) {
                    if (error.message === 'Unauthorized') {
                        toastError({ message: `${session_expire()}` });
                    } else {
                        toastError({
                            message: `${fail_del_currency()}: ${error.message}`,
                        });
                    }
                } else {
                    toastError({ message: `${error_del_text()} ${currency()}.` });
                }
            }
        },
        [token, tenantId]
    );

    const refreshExchangeRate = useCallback(async () => {
        try {
            const currentRates = prepareCurrentRates(currencies);
            const apiData = await fetchExchangeRates(token, tenantId);
            const changedRates = findChangedRates(apiData, currentRates);

            if (changedRates.length === 0) {
                console.log('No exchange rate changes detected');
            } else {
                console.log('Changed rates payload:', changedRates);
            }
            return changedRates;
        } catch (error) {
            console.error('Error refreshing exchange rates:', error);
            toastError({
                message:
                    error instanceof Error
                        ? error.message
                        : 'Failed to refresh exchange rates',
            });
            throw error;
        }
    }, [currencies, token, tenantId]);



    return {
        currencies,
        isLoading,
        error,
        search,
        setSearch,
        status,
        setStatus,
        statusOpen,
        setStatusOpen,
        page: Number(page),
        totalPages: Number(pages),
        setPage,
        showRefreshToken,
        handleSuccess,
        handleDelete,
        refreshExchangeRate,
        fetchData,
        setCurrencies,
    };
};