'use server';

import { Recipe } from '@/dtos/recipe.dto';

interface RecipeResponse {
	success: boolean;
	data: Recipe | null;
}

export const fetchRecipe = async (id: string): Promise<RecipeResponse> => {
	try {
		const url = `/api/operational-planning/recipe-management/recipe/${id}`;
		const response = await fetch(url, {
			method: 'GET',
			cache: 'no-store',
		});

		return await response.json();
	} catch (error) {
		console.error('Error fetching recipe:', error);
		return {
			success: false,
			data: null,
		};
	}
};
