'use client';

import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { toastError } from '@/components/ui-custom/Toast';
import { Button } from '@/components/ui/button';
import { RecipeCreateModel } from '@/dtos/recipe.dto';
import { useURL } from '@/hooks/useURL';
import { FieldConfig } from '@/lib/util/uiConfig';
import { FileDown, Printer, Plus, LayoutGrid, LayoutList } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import * as m from '@/paraglide/messages.js';
import { Link } from '@/lib/i18n';
import SearchForm from '@/components/ui-custom/SearchForm';
import { statusOptions } from '@/lib/statusOptions';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import RecipeCard from './RecipeCard';
import RecipeDisplay from './RecipeDisplay';

enum RecipeField {
	Name = 'name',
	Category = 'category',
	CostPerPortion = 'costPerPortion',
	SellingPrice = 'sellingPrice',
	Margin = 'grossMargin',
	Status = 'status',
}

enum ViewType {
	Table = 'table',
	Grid = 'grid',
}

const recipeFields: FieldConfig<RecipeCreateModel>[] = [
	{
		key: RecipeField.Name,
		label: 'Name',
		className: 'w-40',
	},
	{
		key: RecipeField.Category,
		label: 'Category',
		className: 'w-40',
	},
	{
		key: RecipeField.CostPerPortion,
		label: 'Cost Per Portion',
		className: 'w-40',
	},
	{
		key: RecipeField.SellingPrice,
		label: 'Selling Price',
		className: 'w-40',
	},
	{
		key: RecipeField.Margin,
		label: 'Margin',
		className: 'w-40',
	},
	{
		key: RecipeField.Status,
		label: 'Status',
		className: 'w-40',
	},
];

const RecipeList = () => {
	const [recipeData, setRecipeData] = useState<RecipeCreateModel[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [viewType, setViewType] = useState<ViewType>(ViewType.Table);

	useEffect(() => {
		const fetchRecipes = async () => {
			try {
				const response = await fetch(
					'/api/operational-planning/recipe-management/recipe'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch recipes');
				}
				const data = await response.json();
				setRecipeData(data.data);
				setPages('1'); // mock data
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
				toastError({ message: 'Failed to fetch recipes' });
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecipes();
	}, []);

	if (error) {
		return <ErrorCard message={error} data-id="recipe-error-card" />;
	}

	const title = 'Recipes';

	const actionButtons = (
		<div className="action-btn-container" data-id="recipe-action-btn-container">
			<Button size={'sm'} data-id="recipe-add-button" asChild>
				<Link href="/operational-planning/recipe-management/recipes/new">
					<Plus className="h-4 w-4" />
					{m.add_text()}
				</Link>
			</Button>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="recipe-export-button"
			>
				<FileDown className="h-4 w-4" data-id="recipe-export-icon" />
				{m.export_text()}
			</Button>
			<Button variant="outline" size={'sm'} data-id="recipe-print-button">
				<Printer className="h-4 w-4" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="recipe-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${m.Search()}...`}
				data-id="recipe-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="recipe-filter-container-center"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="recipe-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={recipeFields}
					items={recipeData}
					onSort={setRecipeData}
					data-id="recipe-sort-dropdown"
				/>
				<Button
					variant="outline"
					size={'sm'}
					data-id="recipe-view-type-button"
					onClick={() =>
						setViewType(
							viewType === ViewType.Table ? ViewType.Grid : ViewType.Table
						)
					}
				>
					{viewType === ViewType.Table ? (
						<LayoutList className="h-4 w-4" />
					) : (
						<LayoutGrid className="h-4 w-4" />
					)}
				</Button>
			</div>
		</div>
	);

	const handlePageChange = (newPage: number) => {
		const numericTotalPages = Number(pages);
		if (newPage < 1 || newPage > numericTotalPages) return;
		setPage(newPage.toString());
	};

	const content = (
		<>
			{viewType === ViewType.Table ? (
				<RecipeDisplay
					recipes={recipeData}
					fields={recipeFields}
					page={+page}
					totalPage={+pages}
					handlePageChange={handlePageChange}
				/>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{recipeData.map((recipe) => (
						<RecipeCard key={recipe.id} recipe={recipe} />
					))}
				</div>
			)}
		</>
	);

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			isLoading={isLoading}
			data-id="recipe-data-display-template"
		/>
	);
};

export default RecipeList;
