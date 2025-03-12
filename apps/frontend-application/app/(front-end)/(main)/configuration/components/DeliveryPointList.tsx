'use client';
import { useAuth } from '@/app/context/AuthContext';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DeliveryPointDialog } from './DeliveryPointDialog';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { formType } from '@/constants/enums';
import SearchForm from '@/components/ui-custom/SearchForm';
import { useURL } from '@/hooks/useURL';
import { statusOptions } from '@/lib/statusOptions';
import * as m from '@/paraglide/messages.js';
import { FileDown, Printer } from 'lucide-react';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import DisplayComponent from '@/components/templates/DisplayComponent';
import { FieldConfig, SortQuery } from '@/lib/util/uiConfig';
import { DeliveryPointCreateModel } from '@/dtos/delivery-point.dto';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import SortComponent from '@/components/ui-custom/SortComponent';
import { deleteDeliveryPoint, fetchDeliveryPoints } from '@/services/delivery_point';

enum DeliveryPointField {
	Name = 'name',
	isActive = 'is_active',
}

const sortFields: FieldConfig<DeliveryPointCreateModel>[] = [
	{ key: DeliveryPointField.Name, label: `${m.delivery_point_label()}`, className: 'w-40' },
];

const deliveryPointsFields: FieldConfig<DeliveryPointCreateModel>[] = [
	{
		key: DeliveryPointField.Name,
		label: `${m.delivery_point_label()}`,
		className: 'w-40',
	},
	{ key: DeliveryPointField.isActive, label: `${m.status_text()}`, type: 'badge' },
];

const DeliveryPointList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [deliveryPoints, setDeliveryPoints] = useState<
		DeliveryPointCreateModel[]
	>([]);
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
			const data = await fetchDeliveryPoints(token, tenantId, {
				search,
				status,
				page,
				sort
			});
			setDeliveryPoints(data.data);
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

	const handleSuccess = useCallback(
		(values: DeliveryPointCreateModel) => {
			setDeliveryPoints((prev) => {
				const mapValues = new Map(prev.map((u) => [u.id, u]));
				mapValues.set(values.id, values);
				return Array.from(mapValues.values());
			});
		},
		[setDeliveryPoints]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				const res = await deleteDeliveryPoint(id, token, tenantId);
				if (res) {
					setDeliveryPoints((prev) => prev.filter((p) => p.id !== id));
					toastSuccess({ message: `${m.delivery_point_del_success()}` });
				}
			} catch (error) {
				if (error instanceof Error) {
					if (error.message === 'Unauthorized') {
						toastError({ message: `${m.session_expire()}` });
					} else {
						toastError({
							message: `${m.fail_del_delivery_point()}: ${error.message}`,
						});
					}
				} else {
					toastError({
						message: `${m.error_del_text()} ${m.delivery_point()}.`,
					});
				}
			}
		},
		[token, tenantId, deleteDeliveryPoint]
	);

	if (error) {
		return <ErrorCard message={error} />;
	}

	const title = `${m.delivery_point()}`;

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="delivery-point-action-btn-container"
		>
			<DeliveryPointDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="delivery-point-add-dialog"
			/>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="delivery-point-export-button"
			>
				<FileDown className="h-4 w-4" data-id="delivery-point-export-icon" />
				{m.export_text()}
			</Button>
			<Button
				variant="outline"
				size={'sm'}
				data-id="delivery-point-print-button"
			>
				<Printer className="h-4 w-4" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="delivery-point-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${m.Search()} ${m.delivery_point()}...`}
				data-id="delivery-point-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="delivery-point-filter-container-center"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="delivery-point-status-search-dropdown"
				/>
				<SortComponent
					fieldConfigs={sortFields}
					sort={sort}
					setSort={setSort}
					data-id="delivery-point-sort-dropdown"
				/>
			</div>
		</div>
	);

	const content = (
		<DisplayComponent<DeliveryPointCreateModel>
			items={deliveryPoints}
			fields={deliveryPointsFields}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			editComponent={({ item, onSuccess }) => (
				<DeliveryPointDialog
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
			data-id="delivery-point-display-component"
		/>
	);

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			data-id="delivery-point-data-display-template"
		/>
	);
};

export default DeliveryPointList;
