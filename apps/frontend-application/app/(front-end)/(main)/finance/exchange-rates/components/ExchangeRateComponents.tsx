'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { getExchangeRate } from '../../actions/exchangeRate';
import { Button } from '@/components/ui/button';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import * as m from '@/paraglide/messages.js';
import ContentExchange from './ContentExchange';

export interface ExchangeRateType {
	code: string;
	name: string;
	symbol: string;
	historical_rate: number;
}

const ITEMS_PER_PAGE = 10;

const ExchangeRateComponents = () => {
	const [exchangeRates, setExchangeRates] = useState<ExchangeRateType[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [open, setOpen] = useState(false);
	const [selectedCurrency, setSelectedCurrency] = useState('THB');

	const fetchData = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await getExchangeRate();
			setExchangeRates(data);
		} catch (err) {
			console.error(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, []);

	const handleBaseCurrencySelect = async (base_currency: string) => {
		setSelectedCurrency(
			base_currency === selectedCurrency ? '' : base_currency
		);
		setOpen(false);
		const data = await getExchangeRate(base_currency);
		setExchangeRates(data);
		setCurrentPage(1);
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};

	const filteredRates = exchangeRates.filter((rate) =>
		Object.values(rate)
			.join(' ')
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRates.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedRates = filteredRates.slice(
		startIndex,
		startIndex + ITEMS_PER_PAGE
	);

	const formatRate = (rate: number) => {
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		}).format(rate);
	};

	const title = `${m.exchange_rates()}`;

	const filter = (
		<div className="flex items-center gap-4">
			<div className="relative my-4 w-full md:w-1/3">
				<Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground text-xs" />
				<Input
					placeholder={m.Search()}
					value={searchTerm}
					onChange={handleSearch}
					className="pl-10 h-8 text-xs"
					aria-label="Search currencies"
				/>
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						role="combobox"
						aria-expanded={open}
						size={'sm'}
						className="w-[100px] justify-between"
					>
						{selectedCurrency
							? exchangeRates.find((rate) => rate.code === selectedCurrency)
									?.code
							: 'Select base currency'}
						<ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0">
					<Command>
						<CommandInput placeholder={m.Search()} className="h-9" />
						<CommandList>
							<CommandEmpty>No currency found.</CommandEmpty>
							<CommandGroup>
								{exchangeRates.map((rate) => (
									<CommandItem
										key={rate.code}
										value={rate.code}
										onSelect={handleBaseCurrencySelect}
									>
										<span>{rate.code}</span>
										<Check
											className={cn(
												'ml-auto h-4 w-4',
												selectedCurrency === rate.code
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		</div>
	);

	const content = (
		<ContentExchange
			paginatedRates={paginatedRates}
			startIndex={startIndex}
			currentPage={currentPage}
			totalPages={totalPages}
			isLoading={isLoading}
			filteredRates={filteredRates}
			setCurrentPage={setCurrentPage}
			formatRate={formatRate}
			data-id="exchange-rate-components"
		/>
	);

	return (
		<DataDisplayTemplate
			title={title}
			filters={filter}
			content={content}
			data-id="exchange-rate-components"
		/>
	);
};

export default ExchangeRateComponents;
