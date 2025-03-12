'use client';
import React from 'react';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import { Button } from '@/components/ui/button';
import CurrencyDialog from './CurrencyDialog';
import { formType } from '@/constants/enums';
import SearchForm from '@/components/ui-custom/SearchForm';
import { statusOptions } from '@/lib/statusOptions';
import { FileDown, Printer } from 'lucide-react';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import DisplayComponent from '@/components/templates/DisplayComponent';
import { FieldConfig } from '@/lib/util/uiConfig';
import { CurrencyCreateModel } from '@/dtos/currency.dto';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import {
	code_label,
	currency,
	currency_name,
	export_text,
	print_text,
	rate_label,
	refresh_exchange_rate,
	Search,
	status_text,
	symbol_label,
} from '@/paraglide/messages.js';
import RefreshTokenComponents from './RefreshTokenComponents';
import { useCurrency } from '@/hooks/useCurrency';

enum CurrencyField {
	Code = 'code',
	Name = 'name',
	Symbol = 'symbol',
	Description = 'description',
	Rate = 'exchange_rate',
	isActive = 'is_active',
}

const sortFields: FieldConfig<CurrencyCreateModel>[] = [
	{ key: CurrencyField.Code, label: `${code_label()}`, className: 'w-20' },
	{ key: CurrencyField.Name, label: `${currency_name()}`, className: 'w-20' },
	{ key: CurrencyField.Rate, label: `${rate_label()}`, className: 'w-20' },
	{
		key: CurrencyField.isActive,
		label: `${status_text()}`,
		type: 'badge',
		className: 'w-10',
	},
];

const currenciesFiltered: FieldConfig<CurrencyCreateModel>[] = [
	...sortFields,
	{
		key: CurrencyField.Symbol,
		label: `${symbol_label()}`,
		className: 'w-20',
	},
];

const CurrencyList = () => {
	const {
		currencies,
		isLoading,
		error,
		search,
		setSearch,
		status,
		setStatus,
		statusOpen,
		setStatusOpen,
		page,
		totalPages,
		setPage,
		showRefreshToken,
		handleSuccess,
		handleDelete,
		refreshExchangeRate,
		setCurrencies
	} = useCurrency();

	if (showRefreshToken) return <RefreshTokenComponents />

	if (error) {
		return <ErrorCard message={error} data-id="currency-error-card" />;
	}

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="currency-action-btn-container"
		>
			<Button
				variant={'outline'}
				size={'sm'}
				data-id="currency-refresh-exchange-rate-button"
				onClick={refreshExchangeRate}
			>
				{refresh_exchange_rate()}
			</Button>
			<CurrencyDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="currency-add-dialog"
			/>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="currency-export-button"
			>
				<FileDown className="h-4 w-4" />
				{export_text()}
			</Button>
			<Button variant="outline" size={'sm'} data-id="currency-print-button">
				<Printer className="h-4 w-4" />
				{print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="currency-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${Search()} ${currency()}..`}
				data-id="currency-search-form"
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="currency-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={sortFields}
					items={currencies}
					onSort={setCurrencies}
				/>
			</div>
		</div>
	);

	const content = (
		<DisplayComponent<CurrencyCreateModel>
			items={currencies}
			fields={currenciesFiltered}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			page={+page}
			totalPage={totalPages}
			setPage={setPage}
			data-id="currency-display-component"
			isLoading={isLoading}
		/>
	);

	return (
		<DataDisplayTemplate
			title={currency()}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			data-id="currency-data-display-template"
		/>
	);
};

export default CurrencyList;
