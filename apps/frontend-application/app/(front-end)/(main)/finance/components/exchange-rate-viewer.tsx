'use client';

import React, { useState, useEffect } from 'react';
import { getExchangeRate } from '../actions/exchangeRate';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";

interface ExchangeRate {
	code: string;
	name: string;
	symbol: string;
	historical_rate: number;
}

const ITEMS_PER_PAGE = 10;

const LoadingTable = () => (
	<div className="space-y-3">
		{[...Array(5)].map((_, i) => (
			<Skeleton key={i} className="w-full h-12" />
		))}
	</div>
);

export function ExchangeRateViewer() {
	const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	useEffect(() => {
		const loadExchangeRates = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const data = await getExchangeRate();
				setExchangeRates(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to load exchange rates');
				console.error('Failed to load exchange rates:', err);
			} finally {
				setIsLoading(false);
			}
		};

		loadExchangeRates();
	}, []);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1); // Reset to first page when searching
	};

	const filteredRates = exchangeRates.filter((rate) =>
		Object.values(rate)
			.join(' ')
			.toLowerCase()
			.includes(searchTerm.toLowerCase())
	);

	const totalPages = Math.ceil(filteredRates.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const paginatedRates = filteredRates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

	const formatRate = (rate: number) => {
		return new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		}).format(rate);
	};

	if (error) {
		return (
			<Alert variant="destructive" className="mb-4">
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	return (
		<div className="space-y-4">
			<div className="relative">
				<Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="Search currencies..."
					value={searchTerm}
					onChange={handleSearch}
					className="pl-10"
					aria-label="Search currencies"
				/>
			</div>

			<div className="rounded-md border">
				{isLoading ? (
					<LoadingTable />
				) : (
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-[80px]">#</TableHead>
									<TableHead>Code</TableHead>
									<TableHead className="hidden md:table-cell">Name</TableHead>
									<TableHead>Symbol</TableHead>
									<TableHead className="text-right">Rate</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedRates.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center">
											No results found
										</TableCell>
									</TableRow>
								) : (
									paginatedRates.map((rate, index) => (
										<TableRow key={rate.code}>
											<TableCell>{startIndex + index + 1}</TableCell>
											<TableCell className="font-medium">{rate.code}</TableCell>
											<TableCell className="hidden md:table-cell">{rate.name}</TableCell>
											<TableCell>{rate.symbol}</TableCell>
											<TableCell className="text-right">
												{formatRate(rate.historical_rate)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				)}
			</div>

			{!isLoading && filteredRates.length > 0 && (
				<Pagination className="mt-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
								className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
							/>
						</PaginationItem>

						{[...Array(totalPages)].map((_, i) => {
							const pageNumber = i + 1;
							// Show first page, current page, last page, and pages around current
							if (
								pageNumber === 1 ||
								pageNumber === totalPages ||
								(pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
							) {
								return (
									<PaginationItem key={pageNumber}>
										<PaginationLink
											onClick={() => setCurrentPage(pageNumber)}
											isActive={currentPage === pageNumber}
											className="cursor-pointer"
										>
											{pageNumber}
										</PaginationLink>
									</PaginationItem>
								);
							} else if (
								pageNumber === currentPage - 2 ||
								pageNumber === currentPage + 2
							) {
								return (
									<PaginationItem key={pageNumber}>
										<PaginationEllipsis />
									</PaginationItem>
								);
							}
							return null;
						})}

						<PaginationItem>
							<PaginationNext
								onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
								className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}

export default ExchangeRateViewer;