import React, { useEffect, useState } from 'react';
import { FieldConfig, SortDirection, SortQuery } from '@/lib/util/uiConfig';
import { ProductCreateModel } from '@/dtos/product.dto';
import { productStatusBadge } from './ProductList';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { CardsContainerSkeleton } from '@/components/ui-custom/Loading/CardsContainerSkeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Link } from '@/lib/i18n';
import PaginationComponent from '@/components/PaginationComponent';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { TableBodySkeleton } from '@/components/ui-custom/Loading/TableBodySkeleton';
import * as m from '@/paraglide/messages.js';
import SortButton from '@/components/SortButton';
import { ProductField } from '@/constants/enums';
interface ProductDisplayProps {
	products: ProductCreateModel[];
	fields: FieldConfig<ProductCreateModel>[];
	page: number;
	totalPage: number;
	handlePageChange: (newPage: number) => void;
	sort?: string;
	onSortChange?: (sort: SortQuery) => void;
	isLoading?: boolean;
}

const ProductDisplay: React.FC<ProductDisplayProps> = ({
	products,
	fields = [],
	page,
	totalPage,
	handlePageChange,
	sort,
	onSortChange,
	isLoading = false,
}) => {
	const [sortField, setSortField] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	useEffect(() => {
		if (!sort) return;

		const [field, direction] = sort.split(':');
		setSortField(field);
		setSortDirection((direction as SortDirection) || 'asc');
	}, [sort]);

	const handleSort = (field: string) => {
		const newDirection: SortDirection =
			sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

		setSortField(field);
		setSortDirection(newDirection);
		onSortChange?.(`${field}:${newDirection}` as SortQuery);
	};


	const renderFieldValue = (field: FieldConfig<ProductCreateModel>, product: ProductCreateModel) => {
		if (field.key === ProductField.STATUS) {
			return productStatusBadge(product[field.key]);
		}
		if (field.render) {
			return field.render(product[field.key], product);
		}
		return String(product[field.key]);
	};

	return (
		<>
			<div className="block md:hidden" role="region" aria-label="Product list mobile view">
				<div className="flex items-center gap-2 mb-4 overflow-x-auto">
					{fields.map((field) => (
						<Button
							key={field.key as string}
							variant="outline"
							size="sm"
							onClick={() => handleSort(String(field.key))}
							aria-label={`Sort by ${field.label}`}
						>
							{field.label}
							{sortField === field.key && (
								sortDirection === 'asc' ? (
									<ChevronUp className="ml-1 h-4 w-4" />
								) : (
									<ChevronDown className="ml-1 h-4 w-4" />
								)
							)}
						</Button>
					))}
				</div>

				{isLoading ? (
					<CardsContainerSkeleton
						fields={fields.length}
						cards={5}
						withAction
					/>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{products.map((product) => (
							<Card
								key={product.id}
								className="hover:shadow-md transition-all"
							>
								<CardContent className="p-4">
									{fields.map((field) => (
										<div
											key={field.key as string}
											className="grid grid-cols-10 gap-4"
										>
											<span className="text-sm text-muted-foreground col-span-3">
												{field.label}
											</span>
											<span className="text-sm font-medium col-span-7">
												{renderFieldValue(field, product)}
											</span>
										</div>
									))}
								</CardContent>
								<CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
									<Button
										asChild
										variant="ghost"
										size="sm"
										aria-label={`View product ${product.id} details`}
									>
										<Link href={`/product-management/products/${product.id}`}>
											<Eye className="h-4 w-4" />
										</Link>
									</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				)}
			</div>
			<div className="hidden md:block" role="region" aria-label="Product list desktop view">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[50px]">#</TableHead>
							{fields.map((field) => (
								<TableHead
									key={field.key as string}
									className={`text-xs ${field.className || ''}`}
									style={{ width: field.width }}
									align={field.align}
								>
									<SortButton
										field={String(field.key)}
										label={field.label}
										isActive={sortField === field.key}
										direction={sortDirection}
										onSort={handleSort}
									/>
								</TableHead>
							))}
							<TableHead className="text-right">
								{m.action_text()}
							</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<TableBodySkeleton
							columns={fields.length}
							withAction
						/>
					) : (
						<TableBody>
							{products.map((product, index) => (
								<TableRow key={product.id}>
									<TableCell className="font-medium text-xs">
										{index + 1}
									</TableCell>
									{fields.map((field) => (
										<TableCell
											key={field.key as string}
											className={`text-xs ${field.className || ''}`}
											align={field.align}
										>
											{renderFieldValue(field, product)}
										</TableCell>
									))}
									<TableCell className="text-right">
										<Button
											asChild
											variant="ghost"
											size="sm"
											aria-label={`View product ${product.id} details`}
										>
											<Link href={`/product-management/products/${product.id}`}>
												<Eye className="h-4 w-4" />
											</Link>
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
				<PaginationComponent
					currentPage={page}
					totalPages={totalPage}
					onPageChange={handlePageChange}
				/>
			</div>
		</>
	);
};

export default ProductDisplay;