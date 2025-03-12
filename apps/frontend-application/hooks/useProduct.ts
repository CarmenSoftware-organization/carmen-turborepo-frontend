import { useCallback, useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useURL } from '@/hooks/useURL';
import { toastError } from '@/components/ui-custom/Toast';
import { ProductCreateModel } from '@/dtos/product.dto';
import { fetchProducts } from '@/services/products';

export const useProduct = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [products, setProducts] = useState<ProductCreateModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [sort, setSort] = useURL('sort');

	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const data = await fetchProducts(token, tenantId, {
				search,
				status,
				page,
				sort,
			});
			setProducts(data.data);
			setPage(data.pagination.page);
			setPages(data.pagination.pages);
		} catch (error) {
			console.log('error', error);
			toastError({ message: 'Failed to fetch products' });
		} finally {
			setIsLoading(false);
		}
	}, [token, tenantId, search, status, page, sort, setPage, setPages]);

	const handlePageChange = useCallback(
		(newPage: number) => {
			const numericTotalPages = Number(pages);
			if (newPage < 1 || newPage > numericTotalPages) return;
			setPage(newPage.toString());
		},
		[pages, setPage]
	);

	const handleSortChange = useCallback(
		(newSort: string) => {
			setSort(newSort);
		},
		[setSort]
	);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return {
		products,
		isLoading,
		statusOpen,
		setStatusOpen,
		search,
		setSearch,
		status,
		setStatus,
		page,
		pages,
		sort,
		handlePageChange,
		handleSortChange,
	};
};
