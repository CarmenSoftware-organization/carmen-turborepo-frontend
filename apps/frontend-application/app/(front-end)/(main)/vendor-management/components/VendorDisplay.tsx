import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui-custom/is-active-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Eye, ChevronUp, ChevronDown, FileX } from 'lucide-react';
import Link from 'next/link';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import * as m from '@/paraglide/messages.js';
import { VendorCreateModel } from '@/dtos/vendor.dto';
import PaginationComponent from '@/components/PaginationComponent';
import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import { SortDirection } from '@/lib/util/uiConfig';

type SortableFields = 'name' | 'description' | 'is_active';
type SortQuery = `${SortableFields}:${SortDirection}` | '';

interface ColumnConfig {
	field: SortableFields;
	label: string;
	width?: string;
	render?: (item: VendorCreateModel) => React.ReactNode;
}

interface VendorDisplayProps {
	vendors: VendorCreateModel[];
	page: number;
	totalPage: number;
	handlePageChange: (newPage: number) => void;
	sort?: string;
	onSortChange?: (sort: SortQuery) => void;
	isLoading?: boolean;
}

const VendorDisplay: React.FC<VendorDisplayProps> = ({
	vendors,
	page,
	totalPage,
	handlePageChange,
	sort,
	onSortChange,
	isLoading = false,
}) => {
	const [sortField, setSortField] = useState<SortableFields | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	const columns: ColumnConfig[] = [
		{
			field: 'name',
			label: m.vendor_name_label(),
			width: 'w-[200px]',
		},
		{
			field: 'description',
			label: m.description(),
			width: 'w-[400px]',
		},
		{
			field: 'is_active',
			label: m.status_text(),
			render: (vendor) => (
				<Badge variant={vendor.is_active ? 'default' : 'destructive'}>
					{vendor.is_active ? m.status_active() : m.status_inactive()}
				</Badge>
			),
		},
	];

	useEffect(() => {
		if (sort) {
			const [field, direction] = sort.split(':');
			setSortField(field as SortableFields);
			setSortDirection((direction as SortDirection) || 'asc');
		}
	}, [sort]);

	const handleSort = (field: SortableFields) => {
		const newDirection: SortDirection =
			sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

		setSortField(field);
		setSortDirection(newDirection);
		onSortChange?.(`${field}:${newDirection}`);
	};

	const SortButton: React.FC<{ field: SortableFields; label: string }> = ({
		field,
		label,
	}) => (
		<div className="flex items-center gap-1">
			<span>{label}</span>
			<Button
				variant="ghost"
				size="sm"
				className="h-6 w-6 p-0"
				onClick={() => {
					handleSort(field);
				}}
			>
				{sortField === field ? (
					sortDirection === 'asc' ? (
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

	const EmptyState = () => (
		<TableRow>
			<TableCell colSpan={columns.length + 2} className="h-32 text-center">
				<div className="flex flex-col items-center justify-center">
					<FileX className="h-16 w-16 text-muted-foreground mb-4" />
					<h3 className="text-lg font-semibold text-muted-foreground">
						<p>No Data Available</p>
					</h3>
					<p className="text-sm text-muted-foreground mt-1">
						<p>No vendors found</p>
					</p>
				</div>
			</TableCell>
		</TableRow>
	);

	return (
		<>
			{/* Mobile View */}
			<div className="block md:hidden">
				<div className="flex items-center gap-2 mb-4">
					{columns.map((column) => (
						<Button
							key={column.field}
							variant="outline"
							size="sm"
							onClick={() => handleSort(column.field)}
						>
							{column.label}
							{sortField === column.field &&
								(sortDirection === 'asc' ? (
									<ChevronUp className="ml-1 h-4 w-4" />
								) : (
									<ChevronDown className="ml-1 h-4 w-4" />
								))}
						</Button>
					))}
				</div>
				<div className="grid grid-cols-1 gap-4">
					{isLoading ? (
						<CardsContainerSkeleton
							fields={columns.length}
							cards={5}
							withAction
						/>
					) : vendors.length === 0 ? (
						<Card className="p-6">
							<div className="flex flex-col items-center justify-center text-center">
								<FileX className="h-16 w-16 text-muted-foreground mb-4" />
								<h3 className="text-lg font-semibold text-muted-foreground">
									<p>No Data Available</p>
								</h3>
								<p className="text-sm text-muted-foreground mt-1">
									<p>No vendors found</p>
								</p>
							</div>
						</Card>
					) : (
						vendors.map((vendor) => (
							<Card key={vendor.id} className="hover:shadow-md transition-all">
								<CardContent className="p-4">
									<div className="space-y-2">
										{columns.map((column) => (
											<div key={column.field} className="flex justify-between">
												<span className="font-medium">{column.label}:</span>
												<span>
													{column.render
														? column.render(vendor)
														: vendor[column.field]}
												</span>
											</div>
										))}
									</div>
								</CardContent>
								<CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
									<Button asChild variant="ghost">
										<Link href={`/vendor-management/vendors/${vendor.id}`}>
											<Eye className="h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))
					)}
				</div>
			</div>

			{/* Desktop View */}
			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">#</TableHead>
							{columns.map((column) => (
								<TableHead key={column.field} className={column.width}>
									<SortButton field={column.field} label={column.label} />
								</TableHead>
							))}
							<TableHead className="text-right">{m.action_text()}</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<TableBodySkeleton columns={columns.length} rows={5} withAction />
					) : (
						<TableBody>
							{vendors.length === 0 ? (
								<EmptyState />
							) : (
								vendors.map((vendor, index) => (
									<TableRow key={vendor.id} className="text-xs">
										<TableCell className="font-medium">{index + 1}</TableCell>
										{columns.map((column) => (
											<TableCell key={column.field}>
												{column.render
													? column.render(vendor)
													: vendor[column.field]}
											</TableCell>
										))}
										<TableCell className="text-right">
											<Button asChild variant="ghost" size="sm">
												<Link href={`/vendor-management/vendors/${vendor.id}`}>
													<Eye className="h-4 w-4" />
												</Link>
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					)}
				</Table>
				{vendors.length > 0 && (
					<PaginationComponent
						currentPage={page}
						totalPages={totalPage}
						onPageChange={handlePageChange}
					/>
				)}
			</div>
		</>
	);
};

export default VendorDisplay;