'use client';

import { Link } from '@/lib/i18n';
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Plus, Printer } from 'lucide-react';
import * as m from '@/paraglide/messages.js';
import SearchForm from '@/components/ui-custom/SearchForm';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import ProductDisplay from './ProductDisplay';
import SortComponent from '@/components/ui-custom/SortComponent';
import { productFields, sortProductFields } from '@/constants/fields';
import { statusProductOptions } from '@/constants/status';
import { useProduct } from '@/hooks/useProduct';

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
	active:
		'border-transparent bg-[#eaf1e9] text-[#276D20] shadow hover:bg-[#eaf1e9]/80 font-bold',
	inactive:
		'border-transparent bg-[#ece0e0] text-[#9D1C1D] shadow hover:bg-[#ece0e0]/80 font-bold',
	discontinued:
		'border-transparent bg-orange-100 text-orange-600 hover:bg-orange-50 font-bold',
	'': 'bg-gray-400 text-white',
};

export const productStatusBadge = (status?: string) => {
	if (!status) {
		return (
			<span className="px-2 py-1 rounded-full text-xs bg-gray-400 text-white">
				Unknown
			</span>
		);
	}

	return (
		<span
			className={`px-2 py-1 rounded-full text-xs ${PRODUCT_STATUS_COLORS[status] || 'bg-gray-400 text-white'
				}`}
		>
			{status.charAt(0).toUpperCase() + status.slice(1)}
		</span>
	);
};

const ProductList = () => {
	const {
		products,
		isLoading,
		statusOpen,
		setStatusOpen,
		search,
		setSearch,
		status,
		setStatus,
		page,
		pages,
		sort,
		handlePageChange,
		handleSortChange,
	} = useProduct();

	const actionButtons = (
		<div className="flex items-center gap-2">
			<Button
				asChild
				variant="outline"
				size="sm"
				data-id="product-list-new-product-button"
			>
				<Link
					href="/product-management/products/new"
					data-id="product-list-new-product-button"
				>
					<Plus className="h-4 w-4" />
					New product
				</Link>
			</Button>
			<Button
				variant="outline"
				className="group"
				size="sm"
				data-id="product-list-export-button"
			>
				<FileDown className="h-4 w-4" />
				{m.export_text()}
			</Button>
			<Button variant="outline" size="sm" data-id="product-list-print-button">
				<Printer className="h-4 w-4" data-id="product-list-print-button-icon" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div
			className="filter-container my-4"
			data-id="product-list-filter-container"
		>
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${m.Search()} ...`}
				data-id="product-list-search-form"
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusProductOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="product-list-status-search-dropdown"
				/>
				<SortComponent
					fieldConfigs={sortProductFields}
					sort={sort}
					setSort={handleSortChange}
					data-id="product-list-sort-dropdown"
				/>
			</div>
		</div>
	);

	return (
		<DataDisplayTemplate
			title="Products List"
			actionButtons={actionButtons}
			filters={filter}
			content={
				<ProductDisplay
					products={products}
					fields={productFields}
					page={+page}
					totalPage={+pages}
					handlePageChange={handlePageChange}
					sort={sort}
					onSortChange={handleSortChange}
					isLoading={isLoading}
					data-id="product-list-product-display"
				/>
			}
			data-id="product-list-data-display-template"
		/>
	);
};

export default ProductList;
