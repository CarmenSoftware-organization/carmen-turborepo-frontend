import React from 'react';

import {
	ChevronFirst,
	ChevronLast,
	ChevronLeft,
	ChevronRight,
	EyeIcon,
	Pen,
	Trash,
} from 'lucide-react';

import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
} from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { dateKeys, formatDateCustom, TypeDateKey } from '@/lib/formatDate';
import { amountKeys, formatPrice, TypeAmountKey } from '@/lib/formatPrice';
import { PaginationType } from '@/lib/types';

import StatusBadge from '../ui-custom/custom-status-badge';
import { CustomButton } from '../ui-custom/CustomButton';
import IsActiveIcon from '../ui-custom/Icon/IsActiveIcon';
import {
	Table,
	TableBody,
	TableCell,
	TableHeader,
	TableRow,
} from '../ui/table';

interface ColumnProps<T> {
	key: Extract<keyof T, string>;
	label: string;
}

interface Props<T> {
	data: T[];
	columns: ColumnProps<T>[];
	onEdit?: (item: T) => void;
	onDelete?: (item: T) => void;
	onView?: (item: T) => void;
	pagination: PaginationType;
	goToPage: (page: number) => void;
	nextPage: () => void;
	previousPage: () => void;
	setPerpage: (perpage: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTable = <T extends Record<string, any>>({
	data,
	columns,
	onEdit,
	onDelete,
	onView,
	pagination,
	goToPage,
	nextPage,
	previousPage,
	setPerpage: setPerpage,
}: Props<T>) => {
	const getPageNumbers = () => {
		const currentPage = pagination?.page;
		const totalPages = pagination?.pages;
		const delta = 2;
		const minVisiblePages = 3;

		const pages: (number | 'ellipsis')[] = [];

		// Always show first page
		pages.push(1);

		// Calculate the range of pages to show around current page
		let rangeStart = Math.max(2, (currentPage ?? 1) - delta);
		let rangeEnd = Math.min((totalPages ?? 0) - 1, (currentPage ?? 1) + delta);

		// Adjust range to ensure minimum visible pages
		if (rangeEnd - rangeStart + 1 < minVisiblePages) {
			if (currentPage ?? 1 <= Math.floor(totalPages ?? 0 / 2)) {
				rangeEnd = Math.min(
					rangeStart + minVisiblePages - 1,
					(totalPages ?? 0) - 1
				);
			} else {
				rangeStart = Math.max(rangeEnd - minVisiblePages + 1, 2);
			}
		}

		// Add ellipsis before range if needed
		if (rangeStart > 2) {
			pages.push('ellipsis');
		}

		// Add pages in range
		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i);
		}

		// Add ellipsis after range if needed
		if (rangeEnd < (totalPages ?? 0) - 1) {
			pages.push('ellipsis');
		}

		// Always show last page if there is more than one page
		if ((totalPages ?? 0) > 1) {
			pages.push(totalPages ?? 0);
		}

		return pages;
	};

	const shouldShowPagination = (pagination?.pages ?? 0) > 1;

	return (
		<>
			<div className="relative overflow-x-auto">
				<Table>
					<TableHeader>
						<TableRow>
							<TableCell>#</TableCell>
							{columns.map((column) => (
								<TableCell key={column.key} className="font-medium">
									{column.label}
								</TableCell>
							))}
							{(onEdit || onDelete || onView) && (
								<TableCell className="bg-background font-medium text-right sticky right-0 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)]">
									Actions
								</TableCell>
							)}
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((item, index) => (
							<TableRow key={index}>
								<TableCell>
									{((pagination?.page ?? 1) - 1) * (pagination?.perpage ?? 10) +
										index +
										1}
								</TableCell>
								{columns.map((column) => {
									const value = item[column.key];
									return (
										<TableCell key={column.key} className="whitespace-nowrap">
											{typeof value === 'boolean' ? (
												<IsActiveIcon isChecked={value} />
											) : dateKeys.includes(column.key as TypeDateKey) ? (
												formatDateCustom(value)
											) : column.key === 'status' ? (
												<StatusBadge status={value} />
											) : amountKeys.includes(column.key as TypeAmountKey) ? (
												formatPrice(value)
											) : value != null ? (
												String(value)
											) : (
												'-'
											)}
										</TableCell>
									);
								})}

								{(onEdit || onDelete || onView) && (
									<TableCell className="bg-background text-right sticky right-0 shadow-[-8px_0_8px_-4px_rgba(0,0,0,0.05)]">
										<div className="flex gap-2 justify-end">
											{onView && (
												<CustomButton
													variant="ghost"
													size="sm"
													onClick={() => onView(item)}
													className="hover:bg-blue-50"
												>
													<EyeIcon className="h-4 w-4" />
												</CustomButton>
											)}
											{onEdit && (
												<CustomButton
													variant="ghost"
													size="sm"
													onClick={() => onEdit(item)}
													className="hover:bg-blue-50"
												>
													<Pen className="h-4 w-4" />
												</CustomButton>
											)}
											{onDelete && (
												<CustomButton
													variant="ghost"
													size="sm"
													onClick={() => onDelete(item)}
												>
													<Trash className="h-4 w-4" />
												</CustomButton>
											)}
										</div>
									</TableCell>
								)}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{shouldShowPagination && (
				<div className="flex justify-end mt-10">
					<div className="flex items-center">
						<Select
							value={String(pagination?.perpage ?? 10)}
							onValueChange={(value) => setPerpage(Number(value))}
						>
							<SelectTrigger className="w-[70px]">
								<SelectValue placeholder="10" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="20">20</SelectItem>
								<SelectItem value="30">30</SelectItem>
								<SelectItem value="40">40</SelectItem>
								<SelectItem value="50">50</SelectItem>
							</SelectContent>
						</Select>

						<Pagination>
							<PaginationContent>
								{(pagination?.page ?? 1) > 1 && (
									<>
										<PaginationItem>
											<ChevronFirst
												onClick={() => goToPage(1)}
												className="cursor-pointer"
												aria-label="Go to first page"
												size={14}
											/>
										</PaginationItem>
										<PaginationItem>
											<ChevronLeft
												onClick={previousPage}
												className="cursor-pointer"
												size={14}
											/>
										</PaginationItem>
									</>
								)}

								{getPageNumbers().map((pageNum, index) => (
									<PaginationItem key={index}>
										{pageNum === 'ellipsis' ? (
											<PaginationEllipsis />
										) : (
											<PaginationLink
												onClick={() => goToPage(pageNum)}
												isActive={pagination?.page === pageNum}
												className="cursor-pointer"
											>
												{pageNum}
											</PaginationLink>
										)}
									</PaginationItem>
								))}

								{(pagination?.page ?? 1) < (pagination?.pages ?? 1) && (
									<>
										<PaginationItem>
											<ChevronRight
												onClick={nextPage}
												className="cursor-pointer"
												size={14}
											/>
										</PaginationItem>
										<PaginationItem>
											<ChevronLast
												onClick={() => goToPage(pagination?.pages ?? 1)}
												className="cursor-pointer"
												aria-label="Go to last page"
												size={14}
											/>
										</PaginationItem>
									</>
								)}
							</PaginationContent>
						</Pagination>
					</div>
				</div>
			)}
		</>
	);
};

export default DataTable;
