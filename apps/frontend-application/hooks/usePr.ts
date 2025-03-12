import { useState, useEffect, useCallback } from 'react';
import { PrType } from '@/lib/types';
import { fetchPrList } from '@/services/purchase-request';

export const usePr = () => {
	const [prList, setPrList] = useState<PrType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getPrList = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const controller = new AbortController();
		const { signal } = controller;

		try {
			const data = await fetchPrList(signal);
			if (data) setPrList(data);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: 'Error fetching Purchase Requests'
			);
		} finally {
			setIsLoading(false);
		}

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		getPrList();

		return () => abortController.abort();
	}, [getPrList]);

	return { prList, setPrList, isLoading, error, getPrList };
};
