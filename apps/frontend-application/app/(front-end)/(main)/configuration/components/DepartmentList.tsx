'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useCallback } from 'react';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import DepartmentDialog from './DepartmentDialog';
import { deleteDepartment, fetchDepartments } from '@/services/department';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { formType } from '@/constants/enums';
import SearchForm from '@/components/ui-custom/SearchForm';
import { useURL } from '@/hooks/useURL';
import { statusOptions } from '@/lib/statusOptions';
import * as m from '@/paraglide/messages.js';
import { FileDown, Printer } from 'lucide-react';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import DisplayComponent from '@/components/templates/DisplayComponent';
import { FieldConfig, SortQuery } from '@/lib/util/uiConfig';
import { DepartmentCreateModel } from '@/dtos/department.dto';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';

enum DepartmentFields {
	Name = 'name',
	Description = 'description',
	isActive = 'is_active',
}

const sortFields: FieldConfig<DepartmentCreateModel>[] = [
	{
		key: DepartmentFields.Name,
		label: m.department_name_label(),
		className: 'w-40',
	},
	{
		key: DepartmentFields.isActive,
		label: m.status_text(),
		type: 'badge',
		className: 'w-24',
	},
];

const departmentFields: FieldConfig<DepartmentCreateModel>[] = [
	...sortFields,
	{ key: DepartmentFields.Description, label: m.description() },
];

const DepartmentList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [departments, setDepartments] = useState<DepartmentCreateModel[]>([]);
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
			const data = await fetchDepartments(token, tenantId, {
				search,
				status,
				page,
				sort
			});
			setDepartments(data.data);
			setPage(data.pagination.page);
			setPages(data.pagination.pages);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'An error occurred');
			toastError({ message: 'Failed to fetch departments' });
		} finally {
			setIsLoading(false);
		}
	};


	useEffect(() => {
		fetchData();
	}, [token, tenantId, search, status, page, sort]);

	const handleSuccess = useCallback((values: DepartmentCreateModel) => {
		setDepartments((prev) => {
			const mapValues = new Map(prev.map((u) => [u.id, u]));
			mapValues.set(values.id, values);
			return Array.from(mapValues.values());
		});
	}, []);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				await deleteDepartment(id, token, tenantId);
				setDepartments((prev) =>
					prev.filter((department) => department.id !== id)
				);
				toastSuccess({ message: m.del_department_success() });
			} catch (error) {
				const message =
					error instanceof Error ? error.message : m.error_del_text();
				toastError({ message: `${m.fail_del_department()}: ${message}` });
			}
		},
		[token, tenantId]
	);

	const title = m.department();

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="department-action-btn-container"
		>
			<DepartmentDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="department-add-dialog"
			/>
			<Button
				variant="outline"
				size="sm"
				aria-label={m.export_text()}
				data-id="department-export-button"
			>
				<FileDown className="h-4 w-4" />
				{m.export_text()}
			</Button>
			<Button
				variant="outline"
				size="sm"
				aria-label={m.print_text()}
				data-id="department-print-button"
			>
				<Printer className="h-4 w-4" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="department-filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${m.Search()} ${m.department()}...`}
				data-id="department-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="department-filter-container-center"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="department-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={sortFields}
					items={departments}
					onSort={setDepartments}
					data-id="department-sort-dropdown"
				/>
			</div>
		</div>
	);

	const content = (
		<DisplayComponent<DepartmentCreateModel>
			items={departments}
			fields={departmentFields}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			editComponent={({ item, onSuccess }) => (
				<DepartmentDialog
					mode={formType.EDIT}
					defaultValues={item}
					onSuccess={onSuccess}
				/>
			)}
			page={+page}
			totalPage={+pages}
			setPage={setPage}
			sort={sort}
			onSortChange={(newSort: SortQuery) => {
				setSort(newSort);
			}}
			isLoading={isLoading}
			data-id="department-display-component"
		/>
	);

	if (error) {
		return <ErrorCard message={error} data-id="department-error-card" />;
	}

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			data-id="department-data-display-template"
		/>
	);
};

export default DepartmentList;
