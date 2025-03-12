import { useState, useEffect, useCallback } from 'react';
import { PurchaseOrderType } from '@/lib/types';
import { fetchPurchaseOrders } from '@/services/purchase-order';

export const usePOderData = () => {
	const [poData, setPoData] = useState<PurchaseOrderType[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getPoData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const controller = new AbortController();
		const { signal } = controller;

		try {
			const data = await fetchPurchaseOrders(signal);
			if (data) setPoData(data);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: 'Error fetching Purchase Orders'
			);
		} finally {
			setIsLoading(false);
		}

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		getPoData();

		return () => abortController.abort();
	}, [getPoData]);

	return { poData, setPoData, isLoading, error, getPoData };
};
