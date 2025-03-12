import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { LocationCreateModel } from '@/dtos/location.dto';
import { useURL } from '@/hooks/useURL';
import { SortQuery } from '@/lib/util/uiConfig';
import { store_location, fail_del_store } from '@/paraglide/messages';
import { deleteStoreLocation, fetchStoreLocations } from '@/services/location';

export const useLocation = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [locations, setLocations] = useState<LocationCreateModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [sort, setSort] = useURL('sort');
	const [statusOpen, setStatusOpen] = useState(false);

	const fetchLocations = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await fetchStoreLocations(token, tenantId, {
				search,
				status,
				page,
				sort,
			});
			setLocations(data.data);
			setPage(data.pagination.page);
			setPages(data.pagination.pages);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	}, [token, tenantId, search, status, page, sort, setPage, setPages]);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				const res = await deleteStoreLocation(id, token, tenantId);
				if (res) {
					setLocations((prev) => prev.filter((p) => p.id !== id));
					toastSuccess({
						message: `${store_location()} deleted successfully`,
					});
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === 'Unauthorized') {
						toastError({
							message: 'Your session has expired. Please login again.',
						});
					} else {
						toastError({
							message: `${fail_del_store()}: ${error.message}`,
						});
					}
				} else {
					toastError({
						message:
							'An unknown error occurred while deleting the store location.',
					});
				}
			}
		},
		[token, tenantId]
	);

	const handlePageChange = useCallback(
		(newPage: number) => {
			const numericTotalPages = Number(pages);
			if (newPage < 1 || newPage > numericTotalPages) return;
			setPage(newPage.toString());
		},
		[pages, setPage]
	);

	const handleFilterSortChange = useCallback(
		(sortString: string) => {
			setSort(sortString as SortQuery);
		},
		[setSort]
	);

	useEffect(() => {
		fetchLocations();
	}, [fetchLocations]);

	return {
		locations,
		isLoading,
		error,
		search,
		setSearch,
		status,
		setStatus,
		page,
		pages,
		sort,
		statusOpen,
		setStatusOpen,
		handleDelete,
		handlePageChange,
		handleFilterSortChange,
	};
};
