import { useCallback, useEffect, useState } from 'react';
import { GoodsReceiveNote } from '@/lib/types';
import { fetchGoodsReceivedNotes } from '@/services/good-received-note';

export const useGrn = () => {
	const [grnData, setGrnData] = useState<GoodsReceiveNote[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getGrnData = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		const controller = new AbortController();
		const { signal } = controller;

		try {
			const data = await fetchGoodsReceivedNotes(signal);
			if (data) setGrnData(data);
		} catch (error) {
			setError(
				error instanceof Error
					? error.message
					: 'Error fetching Goods Receive Notes'
			);
		} finally {
			setIsLoading(false);
		}

		return () => controller.abort();
	}, []);

	useEffect(() => {
		const abortController = new AbortController();
		getGrnData();

		return () => abortController.abort();
	}, [getGrnData]);

	return { grnData, setGrnData, isLoading, error, getGrnData };
};
