import { useCallback, useState, useEffect } from 'react';
import { useURL } from '@/hooks/useURL';
import { fetchWorkflowList } from '@/services/workflow';

interface WorkflowListProps {
	id: string;
	name: string;
	workflow_type: string;
	is_active: string;
}

export const useWorkflow = () => {
	const token = 'mock-token';
	const tenantId = 'mock-tenant-id';
	const [workflows, setWorkflows] = useState<WorkflowListProps[]>([]);
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
			const data = await fetchWorkflowList(token, tenantId, {
				search,
				status,
				page,
				sort,
			});
			setWorkflows(data.data);
			setPage(data.pagination.page);
			setPages(data.pagination.pages);
		} catch (error) {
			console.log('error', error);
			console.log('Failed to fetch workflow');
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
		workflows,
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
