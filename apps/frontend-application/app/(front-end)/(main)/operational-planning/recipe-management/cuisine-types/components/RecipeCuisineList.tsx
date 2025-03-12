'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
	RecipeCuisine,
	RecipeCuisineCreateModel,
} from '@/dtos/cuisine-types.dto';
import { FieldConfig } from '@/lib/util/uiConfig';
import { useAuth } from '@/app/context/AuthContext';
import { useURL } from '@/hooks/useURL';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import * as m from '@/paraglide/messages.js';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { FileDown } from 'lucide-react';
import SearchForm from '@/components/ui-custom/SearchForm';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { statusOptions } from '@/lib/statusOptions';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import DisplayComponent from '@/components/templates/DisplayComponent';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import RecipeCuisineDialog from './RecipeCuisineDialog';
import { formType } from '@/constants/enums';

enum RecipeCuisineField {
	Name = 'name',
	Code = 'code',
	Description = 'description',
	Region = 'region',
	Status = 'status',
	Recipe = 'recipeCount',
	ActiveRecipe = 'activeRecipeCount',
	PopularDishes = 'popularDishes',
	KeyIngredients = 'keyIngredients',
	LastUpdated = 'lastUpdated',
}

const recipeCuisineFields: FieldConfig<RecipeCuisineCreateModel>[] = [
	{
		key: RecipeCuisineField.Name,
		label: 'Name',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.Code,
		label: 'Code',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.Description,
		label: 'Description',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.Region,
		label: 'Region',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.Status,
		label: 'Status',
		className: 'w-40',
		type: 'badge',
	},
	{
		key: RecipeCuisineField.Recipe,
		label: 'Recipe',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.ActiveRecipe,
		label: 'Active Recipe',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.PopularDishes,
		label: 'Popular Dishes',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.KeyIngredients,
		label: 'Key Ingredients',
		className: 'w-40',
	},
	{
		key: RecipeCuisineField.LastUpdated,
		label: 'Last Updated',
		className: 'w-40',
	},
];

const RecipeCuisineList = () => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [cuisineData, setCuisineData] = useState<RecipeCuisine[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');

	useEffect(() => {
		const fetchCuisineTypes = async () => {
			try {
				const response = await fetch(
					'/api/operational-planning/recipe-management/cuisine-types'
				);
				if (!response.ok) {
					throw new Error('Failed to fetch cuisine types');
				}
				const data = await response.json();
				setCuisineData(data.data);
				setPages('1'); // mock data
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
				toastError({ message: 'Failed to fetch cuisine types' });
			} finally {
				setIsLoading(false);
			}
		};

		fetchCuisineTypes();
	}, []);

	const handleSuccess = useCallback(
		(values: RecipeCuisineCreateModel) => {
			setCuisineData((prev) => {
				if (!values.id) return prev;
				const mapValues = new Map(prev.map((u) => [u.id, u]));
				mapValues.set(values.id, values as RecipeCuisine);
				return Array.from(mapValues.values());
			});
		},
		[setCuisineData]
	);

	const handleDelete = useCallback(
		async (id: string) => {
			alert(`delete ${id}`);
			toastSuccess({ message: 'Recipe cuisine deleted successfully' });
		},
		[token, tenantId, setCuisineData]
	);

	if (error) {
		return <ErrorCard message={error} data-id="recipe-cuisine-error-card" />;
	}

	const title = `${m.recipe_cuisine_types()}`;

	const actionButtons = (
		<div
			className="action-btn-container"
			data-id="recipe-cuisine-action-btn-container"
		>
			<RecipeCuisineDialog
				mode={formType.ADD}
				onSuccess={handleSuccess}
				data-id="recipe-cuisine-add-dialog"
			/>
			<Button
				variant="outline"
				className="group"
				size={'sm'}
				data-id="recipe-cuisine-export-button"
			>
				<FileDown className="h-4 w-4" data-id="recipe-cuisine-export-icon" />
				{m.export_text()}
			</Button>
			<Button
				variant="outline"
				size={'sm'}
				data-id="recipe-cuisine-print-button"
			>
				<Printer className="h-4 w-4" />
				{m.print_text()}
			</Button>
		</div>
	);

	const filter = (
		<div className="filter-container" data-id="recipe-cuisine-filter-container">
			<SearchForm
				defaultValue={search}
				onSearch={setSearch}
				placeholder={`${m.Search()} ${m.recipe_cuisine_types()}...`}
				data-id="recipe-cuisine-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="recipe-cuisine-filter-container-center"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="recipe-cuisine-status-search-dropdown"
				/>
				<SortDropDown
					fieldConfigs={recipeCuisineFields}
					items={cuisineData}
					onSort={setCuisineData}
					data-id="recipe-cuisine-sort-dropdown"
				/>
			</div>
		</div>
	);

	const content = (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		<DisplayComponent<any>
			items={cuisineData}
			fields={recipeCuisineFields}
			idField="id"
			onSuccess={handleSuccess}
			onDelete={handleDelete}
			editComponent={({ item, onSuccess }) => (
				<RecipeCuisineDialog
					mode={formType.EDIT}
					defaultValues={item}
					onSuccess={onSuccess}
				/>
			)}
			page={+page}
			totalPage={+pages}
			setPage={setPage}
			data-id="recipe-cuisine-display-component"
		/>
	);

	return (
		<DataDisplayTemplate
			title={title}
			actionButtons={actionButtons}
			filters={filter}
			content={content}
			isLoading={isLoading}
			data-id="recipe-cuisine-data-display-template"
		/>
	);
};

export default RecipeCuisineList;
