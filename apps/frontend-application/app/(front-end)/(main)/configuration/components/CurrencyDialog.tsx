'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon, Loader2 } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui-custom/dialog/dialog';
import PaginationComponent from '@/components/PaginationComponent';
import * as m from '@/paraglide/messages.js';
import { formType } from '@/constants/enums';
import SearchForm from '@/components/ui-custom/SearchForm';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SORT_OPTIONS, sortFields, toggleSort } from '@/lib/util/currency';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import {
	CurrencyCreateModel,
	SystemCurrencyCreateModel,
	SystemCurrencyCreateSchema,
} from '@/dtos/currency.dto';
import { fetchSystemCurrencies } from '@/services/currency';

// Helper function to validate SORT_OPTIONS
interface CurrencyDialogProps {
	mode: formType;
	defaultValues?: CurrencyCreateModel;
	onSuccess: (currency: CurrencyCreateModel | CurrencyCreateModel[]) => void;
}

const CurrencyDialog: React.FC<CurrencyDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';

	const [listCurrencies, setListCurrencies] = useState<
		SystemCurrencyCreateModel[]
	>([]);
	const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		pages: 1,
		perpage: 10,
		total: 0,
	});
	const [search, setSearch] = useState('');
	const [sort, setSort] = useState(SORT_OPTIONS.NAME);

	const fetchListCurrencies = async () => {
		setIsLoading(true);
		try {
			const result = await fetchSystemCurrencies(
				token,
				tenantId,
				pagination.page,
				pagination.perpage,
				search,
				sort
			);
			setListCurrencies(result.data);
			setPagination(result.pagination);
		} catch (error) {
			console.error('Error fetching currencies:', error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (open) {
			fetchListCurrencies();
		}
	}, [
		token,
		tenantId,
		pagination.page,
		pagination.perpage,
		open,
		search,
		sort,
	]);

	const handleSwitchChange = (currencyId: string, checked: boolean) => {
		setSelectedCurrencies((prev) => {
			if (checked) {
				return [...prev, currencyId];
			} else {
				return prev.filter((id) => id !== currencyId);
			}
		});
	};

	const defaultCurrencyValues: SystemCurrencyCreateModel = {
		iso_code: '',
		name: '',
		symbol: '',
		exchange_rate: 0,
		is_active: true,
	};

	const form = useForm<SystemCurrencyCreateModel>({
		resolver: zodResolver(SystemCurrencyCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? {
					...defaultValues,
					iso_code: defaultValues.code,
					exchange_rate: defaultValues.exchange_rate ?? 0,
				}
				: defaultCurrencyValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({
				...defaultValues,
				iso_code: defaultValues.code,
				exchange_rate: defaultValues.exchange_rate ?? 0,
			});
		} else {
			form.reset(defaultCurrencyValues);
		}
	}, [mode, defaultValues, form]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		console.log('selectedCurrencies', selectedCurrencies);

		try {
			const response = await fetch('/api/configuration/currency', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
					'x-tenant-id': tenantId,
				},
				body: JSON.stringify({
					data: selectedCurrencies,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to update currencies');
			}

			const result = await response.json();
			console.log('result', result);

			if (result.success) {
				onSuccess(result.data);
			}

			handleClose();
		} catch (error) {
			console.error('Error updating currencies:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		form.reset();
		setSelectedCurrencies([]);
		setSort(SORT_OPTIONS.NAME);
		setPagination((prev) => ({ ...prev, page: 1 }));
	};

	const handlePageChange = (newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handleSortChange = (field: SORT_OPTIONS) => {
		setSort((prev) => toggleSort(field, prev) as SORT_OPTIONS);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(isOpen) => {
				setOpen(isOpen);
				if (!isOpen) {
					handleClose();
				}
			}}
			data-id="currency-dialog"
		>
			<DialogTrigger asChild data-id="currency-trigger">
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					disabled={isLoading}
					data-id="currency-button"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon className="h-4 w-4" />
							{m.add_text()} {m.currency()}
						</>
					) : (
						<PencilIcon className="w-4 h-4" />
					)}
				</Button>
			</DialogTrigger>
			<DialogContent data-id="currency-content">
				<DialogHeader data-id="currency-header">
					<DialogTitle data-id="currency-title">
						{mode === formType.ADD
							? `${m.create_new_currency()}`
							: `${m.edit_currency()}`}
					</DialogTitle>
				</DialogHeader>
				{mode === formType.EDIT && defaultValues ? (
					<h1 data-id="currency-edit-title">{m.edit_currency()}</h1>
				) : (
					<>
						<div className="flex my-4" data-id="currency-search-container">
							<SearchForm
								defaultValue={search}
								onSearch={setSearch}
								placeholder={`${m.Search()} ${m.currency()}..`}
								data-id="search-input"
							/>
							<DropdownMenu data-id="currency-sort-container">
								<DropdownMenuTrigger asChild data-id="currency-sort-trigger">
									<Button
										variant="outline"
										size="sm"
										aria-label="Sort options"
										data-id="sort-button"
									>
										{sortFields.find((f) => sort.startsWith(f.key))?.label ??
											'Sort'}{' '}
										{sort.endsWith(':desc') ? '↓' : sort ? '↑' : ''}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									data-id="currency-sort-content"
									className="w-56"
								>
									<DropdownMenuLabel data-id="currency-sort-label">
										{m.sort_by()}
									</DropdownMenuLabel>
									<DropdownMenuSeparator data-id="currency-sort-separator" />
									{sortFields.map(({ key, label }) => (
										<DropdownMenuItem
											key={key}
											data-id={`sort-item-${key}`}
											className={`flex justify-between items-center ${sort.startsWith(key) ? 'font-bold text-blue-500' : ''
												}`}
											onClick={() => handleSortChange(key)}
											aria-selected={sort.startsWith(key)}
										>
											{label}
											{sort.startsWith(key) && (
												<span>{sort.endsWith(':desc') ? '↓' : '↑'}</span>
											)}
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<Table data-id="currency-table">
							<TableHeader data-id="currency-table-header">
								<TableRow data-id="currency-table-row">
									<TableHead data-id="currency-table-code" className="w-40">
										{m.code_label()}
									</TableHead>
									<TableHead data-id="currency-table-head-name">
										{m.currency_name()}
									</TableHead>
									<TableHead data-id="currency-table-head-symbol">
										{m.symbol_label()}
									</TableHead>
									<TableHead data-id="currency-table-head-status">
										{m.status_text()}
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody data-id="currency-table-body">
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={4} className="h-24 text-center">
											<div className="flex items-center justify-center">
												<Loader2 className="h-6 w-6 animate-spin text-primary" />
											</div>
										</TableCell>
									</TableRow>
								) : (
									listCurrencies.map((currency) => (
										<TableRow key={currency.id} data-id="currency-table-row">
											<TableCell data-id="currency-table-cell-code">
												{currency.iso_code}
											</TableCell>
											<TableCell data-id="currency-table-cell-name">
												{currency.name}
											</TableCell>
											<TableCell data-id="currency-table-cell-symbol">
												{currency.symbol}
											</TableCell>
											<TableCell data-id="currency-table-cell-status">
												<Switch
													checked={selectedCurrencies.includes(
														currency.iso_code
													)}
													onCheckedChange={(checked) =>
														handleSwitchChange(currency.iso_code, checked)
													}
													aria-label={`Select ${currency.name}`}
													disabled={isLoading}
													data-id={`switch-${currency.iso_code}`}
												/>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<PaginationComponent
							currentPage={pagination.page}
							totalPages={pagination.pages}
							onPageChange={handlePageChange}
							data-id="currency-pagination"
						/>
						<div className="text-right pt-2">
							<LoaderButton
								onClick={handleSubmit}
								disabled={isLoading}
								isLoading={isLoading}
								size={'sm'}
								data-id="currency-submit-button"
							>
								{isLoading
									? `${m.loading()}...`
									: mode === formType.EDIT
										? `${m.save_change_text()}`
										: `${m.add_text()}`}
							</LoaderButton>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default CurrencyDialog;