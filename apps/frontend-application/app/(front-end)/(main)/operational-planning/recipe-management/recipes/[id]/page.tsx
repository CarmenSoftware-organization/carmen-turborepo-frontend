'use client';

import React, { useEffect, useState } from 'react';
import RecipeDetails from './components/RecipeDetails';
import { useParams } from 'next/navigation';
import { Recipe } from '@/dtos/recipe.dto';

const RecipeIDPage = () => {
	const { id } = useParams() as { id: string };
	const [recipe, setRecipe] = useState<Recipe>();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchRecipe = async () => {
			try {
				setIsLoading(true);
				const url = `/api/operational-planning/recipe-management/recipe/${id}`;
				const response = await fetch(url, {
					method: 'GET',
					cache: 'no-store',
				});
				const data = await response.json();
				if (data.success) {
					setRecipe(data.data);
				}
			} catch (error) {
				console.error('Error fetching recipe:', error);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) {
			fetchRecipe();
		}
	}, [id]);

	return <RecipeDetails recipe={recipe} isLoading={isLoading} />;
};

export default RecipeIDPage;
