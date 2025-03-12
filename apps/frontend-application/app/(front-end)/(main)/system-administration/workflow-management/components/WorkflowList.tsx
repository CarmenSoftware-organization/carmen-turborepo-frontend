'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import Link from 'next/link';
import { Eye, PlusCircle } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { useURL } from '@/hooks/useURL';
import { fetchWorkflows } from '../../actions/workflow';
import { toastError } from '@/components/ui-custom/Toast';
import { statusOptions } from '@/lib/statusOptions';
import {
	Search,
	status_text,
	workflow,
	session_expire,
	fail_to_text,
} from '@/paraglide/messages.js';
import { Card, CardContent } from '@/components/ui/card';
import RefreshToken from '@/components/RefreshToken';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import SearchForm from '@/components/ui-custom/SearchForm';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { FieldConfig, SortDirection } from '@/lib/util/uiConfig';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import SortComponent from '@/components/ui-custom/SortComponent';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as m from '@/paraglide/messages.js';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { Badge } from '@/components/ui-custom/is-active-badge';
import PaginationComponent from '@/components/PaginationComponent';

interface WorkflowListProps {
	id: string;
	name: string;
	workflow_type: string;
	is_active: string;
}

enum WorkflowField {
	name = 'name',
	workflow_type = 'workflow_type',
	isActive = 'is_active',
}

const sortFields: FieldConfig<WorkflowListProps>[] = [
	{ key: WorkflowField.name, label: `Name`, className: 'w-40' },
	{ key: WorkflowField.workflow_type, label: `Type`, className: 'w-40' },
	{
		key: WorkflowField.isActive,
		label: `${status_text()}`,
		type: 'badge',
		className: 'w-24',
	},
	// {
	// 	key: WorkflowField.lastModified,
	// 	label: `Last Modified`,
	// 	className: 'w-40',
	// },
];

const fields: FieldConfig<WorkflowListProps>[] = [...sortFields];

interface SortButtonProps {
	field: string;
	label: string;
	isActive: boolean;
	direction: SortDirection;
	onSort: (field: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
	field,
	label,
	isActive,
	direction,
	onSort,
}) => (
	<div className="flex items-center gap-1">
		<span>{label}</span>
		<Button
			variant="ghost"
			size="sm"
			className="h-6 w-6 p-0"
			onClick={() => onSort(field)}
			aria-label={`Sort by ${label} ${isActive ? (direction === 'asc' ? 'descending' : 'ascending') : ''}`}
		>
			{isActive ? (
				direction === 'asc' ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)
			) : (
				<div className="flex flex-col -space-y-2">
					<ChevronUp className="h-3 w-3 opacity-50" />
					<ChevronDown className="h-3 w-3 opacity-50" />
				</div>
			)}
		</Button>
	</div>
);

const renderFieldValue = (
	field: FieldConfig<WorkflowListProps>,
	wf: WorkflowListProps
) => {
	if (field.render) {
		return field.render(wf[field.key], wf);
	}

	const value = wf[field.key];
	switch (field.type) {
		case 'badge':
			if (typeof value === 'boolean') {
				return (
					<Badge variant={value ? 'default' : 'destructive'}>
						{value ? `${m.status_active()}` : `${m.status_inactive()}`}
					</Badge>
				);
			}
			return <Badge>{String(value)}</Badge>;

		default:
			return (
				<span className={`text-xs ${field.className || ''}`}>
					{String(value)}
				</span>
			);
	}
};

const WorkflowList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [workflows, setWorkflows] = useState<WorkflowListProps[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [sort, setSort] = useURL('sort');
	const [showRefreshToken, setShowRefreshToken] = useState(false);
	const [sortField, setSortField] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	const fetchList = async () => {
		try {
			setIsLoading(true);
			const data = await fetchWorkflows(token, tenantId, {
				search,
				status,
				page,
			});

			setWorkflows(data.data);
			setPage(data.pagination.page.toString());
			setPages(data.pagination.pages.toString());
			setShowRefreshToken(false);
		} catch (err) {
			if (err instanceof Error && err.message === 'Unauthorized') {
				toastError({
					message: 'Your session has expired. Please login again.',
				});
				setShowRefreshToken(true);
				setWorkflows([]);
			} else {
				setError(err instanceof Error ? err.message : 'An error occurred');
				toastError({ message: `${fail_to_text()}` });
			}
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchList();
	}, [token, tenantId, search, status]);

	useEffect(() => {
		if (!sort) return;

		const [field, direction] = sort.split(':');
		setSortField(field);
		setSortDirection((direction as SortDirection) || 'asc');
	}, [sort]);

	const handleSort = (field: string) => {
		const newDirection: SortDirection =
			sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

		setSortField(field);
		setSortDirection(newDirection);
		setSort(`${field}:${newDirection}`);
	};

	const handlePageChange = (newPage: number) => {
		const numericTotalPages = Number(pages);
		if (newPage < 1 || newPage > numericTotalPages) return;
		setPage(newPage.toString());
	};

	if (showRefreshToken) {
		return (
			<Card
				className="border-destructive w-full md:w-1/2"
				data-id="currency-refresh-token-card"
			>
				<CardContent className="pt-6" data-id="currency-refresh-token-content">
					<div
						className="flex flex-col items-center gap-4"
						data-id="currency-refresh-token-container"
					>
						<p className="text-destructive">{session_expire()}</p>
						<RefreshToken />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return <ErrorCard message={error} data-id="workflow-error-card" />;
	}

	const actionButtons = (
		<div className="flex items-center gap-2">
			<Button asChild size="sm" data-id="workflow-list-new-workflow-button">
				<Link
					href="/system-administration/workflow-management/new"
					data-id="workflow-list-new-workflow-button"
				>
					<PlusCircle className="h-4 w-4" />
					New Workflow
				</Link>
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container my-4" data-id="currency-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${Search()} ${workflow()}..`}
				data-id="currency-search-form"
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="workflow-status-search-dropdown"
				/>
				<SortComponent
					fieldConfigs={sortFields}
					sort={sort}
					setSort={setSort}
					data-id="workflow-list-sort-dropdown"
				/>
			</div>
		</div>
	);

	const content = (
		<>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">#</TableHead>
						{fields.map((field) => (
							<TableHead
								key={field.key as string}
								className={`text-xs ${field.className || ''}`}
								style={{ width: field.width }}
								align={field.align}
							>
								<SortButton
									field={String(field.key)}
									label={field.label}
									isActive={sortField === field.key}
									direction={sortDirection}
									onSort={handleSort}
								/>
							</TableHead>
						))}
						<TableHead className="text-right">{m.action_text()}</TableHead>
					</TableRow>
				</TableHeader>
				{isLoading ? (
					<TableBodySkeleton columns={fields.length} withAction />
				) : (
					<TableBody>
						{workflows.map((w, index) => (
							<TableRow key={w.id}>
								<TableCell className="font-medium text-xs">
									{index + 1}
								</TableCell>
								{fields.map((field) => (
									<TableCell
										key={field.key as string}
										className={`text-xs ${field.className || ''}`}
										align={field.align}
									>
										{renderFieldValue(field, w)}
									</TableCell>
								))}
								<TableCell className="text-right">
									<Button
										asChild
										variant="ghost"
										size="sm"
										aria-label={`View workflow ${w.id} details`}
									>
										<Link
											href={`/system-administration/workflow-management/${w.id}`}
										>
											<Eye className="h-4 w-4" />
										</Link>
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				)}
			</Table>
			<PaginationComponent
				currentPage={+page}
				totalPages={+pages}
				onPageChange={handlePageChange}
			/>
		</>
	);

	return (
		<DataDisplayTemplate
			title="Workflow"
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			data-id="workflow-list-data-display-template"
		/>
	);
};

export default WorkflowList;
