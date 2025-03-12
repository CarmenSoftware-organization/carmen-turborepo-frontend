import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useURL } from '@/hooks/useURL';
import { VendorCreateModel } from '@/dtos/vendor.dto';
import { SortDirection } from '@/lib/util/uiConfig';
import { VendorFields } from '@/constants/enums';
import { fetchAllVendors } from '@/services/vendor';

export type SortQuery = `${VendorFields}:${SortDirection}` | '';

export const useVendor = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [vendors, setVendors] = useState<VendorCreateModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);

	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [sort, setSort] = useURL('sort');

	const fetchData = async () => {
		try {
			setIsLoading(true);
			const data = await fetchAllVendors(token, tenantId, {
				search,
				status,
				page,
				sort,
			});
			setVendors(data.data);
			setPage(data.pagination.page);
			setPages(data.pagination.pages);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [token, tenantId, search, status, page, sort]);

	const handlePageChange = (newPage: number) => {
		const numericTotalPages = Number(pages);
		if (newPage < 1 || newPage > numericTotalPages) return;
		setPage(newPage.toString());
	};

	const handleSortChange = (newSort: SortQuery) => {
		setSort(newSort);
	};

	return {
		vendors,
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
		sort,
		setSort,
		handlePageChange,
		handleSortChange,
	};
};
