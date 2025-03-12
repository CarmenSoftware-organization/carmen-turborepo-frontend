'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FileDown, Printer } from 'lucide-react';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { Button } from '@/components/ui/button';

import {
	export_text,
	print_text,
	Search,
	session_expire,
} from '@/paraglide/messages';
import SearchForm from '@/components/ui-custom/SearchForm';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { statusOptions } from '@/lib/statusOptions';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import { useURL } from '@/hooks/useURL';
import { FieldConfig } from '@/lib/util/uiConfig';
import DisplayComponent from '@/components/templates/DisplayComponent';
import { CreditNoteModel } from '@/dtos/credit-note.dto';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';

enum CreditNoteField {
	RefNumber = 'refNumber',
	Description = 'description',
	Vendor = 'vendorName',
	Status = 'status',
	Date = 'createdDate',
	DocNumber = 'docNumber',
	DocDate = 'docDate',
	NetAmount = 'netAmount',
	TaxAmount = 'taxAmount',
	Amount = 'totalAmount',
	VendorId = 'vendorId',
	Currency = 'currency',
	Notes = 'notes',
	CreatedBy = 'createdBy',
	UpdatedDate = 'updatedDate',
	UpdatedBy = 'updatedBy',
	Items = 'items',
	Attachments = 'attachments',
}

const sortFields: FieldConfig<CreditNoteModel>[] = [
	{ key: CreditNoteField.RefNumber, label: 'Reference No.', className: 'w-20' },
	{ key: CreditNoteField.Vendor, label: 'Vendor', className: 'w-20' },
	{ key: CreditNoteField.Date, label: 'Date', className: 'w-20' },
	{ key: CreditNoteField.Amount, label: 'Amount', className: 'w-20' },
	{ key: CreditNoteField.DocNumber, label: 'Doc No.', className: 'w-20' },
	{ key: CreditNoteField.DocDate, label: 'Doc Date', className: 'w-20' },
	{ key: CreditNoteField.NetAmount, label: 'Net Amount', className: 'w-20' },
	{ key: CreditNoteField.TaxAmount, label: 'Tax Amount', className: 'w-20' },
	{
		key: CreditNoteField.Status,
		label: 'Status',
		className: 'w-20',
		type: 'badge',
	},

	{ key: CreditNoteField.CreatedBy, label: 'Created By', className: 'w-20' },
	{
		key: CreditNoteField.UpdatedDate,
		label: 'Updated Date',
		className: 'w-20',
	},
	{ key: CreditNoteField.UpdatedBy, label: 'Updated By', className: 'w-20' },
];

const creditNotesFiltered: FieldConfig<CreditNoteModel>[] = [
	...sortFields,
	{ key: CreditNoteField.Description, label: 'Description', className: 'w-40' },
];

const CreditNoteList = () => {
	const [creditNotes, setCreditNotes] = useState<CreditNoteModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');

	const handleFetchCreditNotes = async () => {
		try {
			const response = await fetch('/api/procurement/credit-note');
			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || 'Failed to fetch credit notes');
			}

			setCreditNotes(result.data);
			setPage('1');
			setPages('10');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		handleFetchCreditNotes();
	}, []);

	const handleSuccess = useCallback(
		(values: CreditNoteModel) => {
			setCreditNotes((prev) => {
				const mapValues = new Map(prev.map((u) => [u.id, u]));
				mapValues.set(values.id, values);
				return Array.from(mapValues.values());
			});
		},
		[setCreditNotes]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			try {
				setCreditNotes((prev) => prev.filter((p) => p.id !== id));
				toastSuccess({ message: 'Credit Note deleted successfully' });
			} catch (error) {
				if (error instanceof Error) {
					toastError({ message: `${session_expire()}` });
				}
			}
		},
		[setCreditNotes]
	);

	const title = 'Credit Note List';

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="credit-note-action-btn-container"
		>
			<Button
				variant="outline"
				size={'sm'}
				data-id="credit-note-refresh-button"
			>
				Add Credit Note
			</Button>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="credit-note-export-button"
			>
				<FileDown className="h-4 w-4" />
				{export_text()}
			</Button>
			<Button variant="outline" size={'sm'} data-id="credit-note-print-button">
				<Printer className="h-4 w-4" />
				{print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="credit-note-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${Search()}...`}
				data-id="credit-note-search-form"
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="credit-note-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={sortFields}
					items={creditNotes}
					onSort={setCreditNotes}
				/>
			</div>
		</div>
	);

	const content = error ? (
		<ErrorCard message={error} data-id="credit-note-error-card" />
	) : (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		<DisplayComponent<any>
			items={creditNotes}
			fields={creditNotesFiltered}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			page={+page}
			totalPage={+pages}
			setPage={setPage}
			data-id="credit-note-display-component"
		/>
	);

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			isLoading={isLoading}
			data-id="credit-note-data-display-template"
		/>
	);
};

export default CreditNoteList;
