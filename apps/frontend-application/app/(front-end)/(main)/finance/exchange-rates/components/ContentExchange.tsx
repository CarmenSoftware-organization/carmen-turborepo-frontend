'use client';
import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import * as m from '@/paraglide/messages.js';
import { ExchangeRateType } from './ExchangeRateComponents';
import { cn } from '@/lib/utils';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';

interface ContentExchangeProps {
	paginatedRates: ExchangeRateType[];
	startIndex: number;
	currentPage: number;
	totalPages: number;
	isLoading: boolean;
	filteredRates: ExchangeRateType[];
	setCurrentPage: (page: number) => void;
	formatRate: (rate: number) => string;
}

const ContentExchange = ({
	paginatedRates,
	startIndex,
	currentPage,
	totalPages,
	isLoading,
	filteredRates,
	setCurrentPage,
	formatRate,
}: ContentExchangeProps) => {
	const fields = ['#', 'Code', 'Currency', 'Symbol', 'Rate'];

	if (isLoading) {
		return (
			<>
				<div className="hidden md:block">
					<Table>
						<TableHeader>
							<TableRow className="text-xs">
								<TableHead className="w-[50px]">#</TableHead>
								<TableHead>{m.code_label()}</TableHead>
								<TableHead>{m.currency()}</TableHead>
								<TableHead>{m.symbol_label()}</TableHead>
								<TableHead>{m.rate_label()}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBodySkeleton columns={fields.length} withAction />
					</Table>
				</div>

				<div className="md:hidden">
					<CardsContainerSkeleton fields={fields.length} cards={5} withAction />
				</div>
			</>
		);
	}

	return (
		<>
			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow className="text-xs">
							<TableHead className="w-[50px]">#</TableHead>
							<TableHead>{m.code_label()}</TableHead>
							<TableHead>{m.currency()}</TableHead>
							<TableHead>{m.symbol_label()}</TableHead>
							<TableHead>{m.rate_label()}</TableHead>
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
								<TableRow key={rate.code} className="text-xs">
									<TableCell>{startIndex + index + 1}</TableCell>
									<TableCell className="w-20">{rate.code}</TableCell>
									<TableCell className="w-40">{rate.name}</TableCell>
									<TableCell className="w-20">{rate.symbol}</TableCell>
									<TableCell className="font-mono">
										{formatRate(rate.historical_rate)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="md:hidden">
				{paginatedRates.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						No results found
					</div>
				) : (
					<div className="grid gap-4 p-4">
						{paginatedRates.map((rate, index) => (
							<Card key={rate.code}>
								<CardHeader className="pb-2">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<CardDescription>
												#{startIndex + index + 1}
											</CardDescription>
											<CardTitle className="text-xl">{rate.code}</CardTitle>
										</div>
										<CardTitle className="font-mono tabular-nums">
											{formatRate(rate.historical_rate)}
										</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center justify-between text-sm text-muted-foreground">
										<div className="truncate max-w-[60%]">{rate.name}</div>
										<div className="font-medium">{rate.symbol}</div>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>

			{!isLoading && filteredRates.length > 0 && (
				<Pagination className="mt-4">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
								className={cn(
									'cursor-pointer',
									currentPage === 1 && 'pointer-events-none opacity-50'
								)}
							/>
						</PaginationItem>

						{[...Array(totalPages)].map((_, i) => {
							const pageNumber = i + 1;
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
								onClick={() =>
									setCurrentPage(Math.min(totalPages, currentPage + 1))
								}
								className={cn(
									'cursor-pointer',
									currentPage === totalPages && 'pointer-events-none opacity-50'
								)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</>
	);
};

export default ContentExchange;
