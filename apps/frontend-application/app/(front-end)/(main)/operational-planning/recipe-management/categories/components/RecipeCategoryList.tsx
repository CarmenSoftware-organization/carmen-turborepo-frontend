'use client';

import { useAuth } from '@/app/context/AuthContext';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { RecipeCategoryCreateModel } from '@/dtos/recipe-category.dto';
import { useURL } from '@/hooks/useURL';
import { FieldConfig } from '@/lib/util/uiConfig';
import React, { useCallback, useEffect, useState } from 'react';
import * as m from '@/paraglide/messages.js';
import { formType } from '@/constants/enums';
import { Button } from '@/components/ui/button';
import { FileDown, Printer } from 'lucide-react';
import RecipeCategoryDialog from './RecipeCategoryDialog';
import SearchForm from '@/components/ui-custom/SearchForm';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { statusOptions } from '@/lib/statusOptions';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import DisplayComponent from '@/components/templates/DisplayComponent';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';

enum RecipeCategoryField {
	Name = 'name',
	Code = 'code',
	Description = 'description',
	Parent = 'parentId',
	Level = 'level',
	Status = 'status',
	SortOrder = 'sortOrder',
	DefaultCostSettings = 'defaultCostSettings',
	DefaultMargins = 'defaultMargins',
	RecipeCount = 'recipeCount',
	ActiveRecipeCount = 'activeRecipeCount',
	AverageCost = 'averageCost',
	AverageMargin = 'averageMargin',
	LastUpdated = 'lastUpdated',
}

const recipeCategoryFields: FieldConfig<RecipeCategoryCreateModel>[] = [
	{
		key: RecipeCategoryField.Name,
		label: 'Name',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.Code,
		label: 'Code',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.Description,
		label: 'Description',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.Status,
		label: 'Status',
		className: 'w-40',
		type: 'badge',
	},
	{
		key: RecipeCategoryField.RecipeCount,
		label: 'Recipe Count',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.ActiveRecipeCount,
		label: 'Active Recipe',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.AverageCost,
		label: 'Average Cost',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.AverageMargin,
		label: 'Average Margin',
		className: 'w-40',
	},
	{
		key: RecipeCategoryField.LastUpdated,
		label: 'Last Updated',
		className: 'w-40',
	},
];
const RecipeCategoryList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [categoryData, setCategoryData] = useState<RecipeCategoryCreateModel[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');

	useEffect(() => {
		const fetchRecipeCategories = async () => {
			try {
				const response = await fetch(
					'/api/operational-planning/recipe-management/categories'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch cuisine types');
				}
				const data = await response.json();
				setCategoryData(data.data);
				setPages('1'); // mock data
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
				toastError({ message: 'Failed to fetch cuisine types' });
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecipeCategories();
	}, []);

	const handleSuccess = useCallback(
		(values: RecipeCategoryCreateModel) => {
			setCategoryData((prev) => {
				if (!values.id) return prev;
				const mapValues = new Map(prev.map((u) => [u.id, u]));
				mapValues.set(values.id, values);
				return Array.from(mapValues.values());
			});
		},
		[setCategoryData]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			alert(`delete ${id}`);
			toastSuccess({ message: 'Recipe category deleted successfully' });
		},
		[token, tenantId, setCategoryData]
	);

	if (error) {
		return <ErrorCard message={error} />;
	}

	const title = 'Recipe Category';

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="recipe-category-action-btn-container"
		>
			<RecipeCategoryDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="recipe-category-add-dialog"
			/>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="recipe-category-export-button"
			>
				<FileDown className="h-4 w-4" data-id="recipe-category-export-icon" />
				{m.export_text()}
			</Button>
			<Button
				variant="outline"
				size={'sm'}
				data-id="recipe-category-print-button"
			>
				<Printer className="h-4 w-4" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div
			className="filter-container"
			data-id="recipe-category-filter-container"
		>
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${m.Search()}...`}
				data-id="recipe-category-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="recipe-category-filter-container-center"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="recipe-category-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={recipeCategoryFields}
					items={categoryData}
					onSort={setCategoryData}
					data-id="recipe-category-sort-dropdown"
				/>
			</div>
		</div>
	);

	const content = (
		<DisplayComponent<RecipeCategoryCreateModel>
			items={categoryData}
			fields={recipeCategoryFields}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			editComponent={({ item, onSuccess }) => (
				<RecipeCategoryDialog
					mode={formType.EDIT}
					defaultValues={item}
					onSuccess={onSuccess}
				/>
			)}
			page={+page}
			totalPage={+pages}
			setPage={setPage}
			data-id="recipe-category-display-component"
		/>
	);

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			isLoading={isLoading}
			data-id="recipe-category-data-display-template"
		/>
	);
};

export default RecipeCategoryList;
