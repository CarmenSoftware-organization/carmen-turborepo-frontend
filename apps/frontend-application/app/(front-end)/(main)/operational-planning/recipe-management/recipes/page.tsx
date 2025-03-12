import { RecipeListSkeleton } from '@/components/ui-custom/Loading/recipe-list-skeleton'
import React, { Suspense } from 'react'
import RecipeList from './components/RecipeList';

const RecipePage = () => {
    return (
			<Suspense
				fallback={<RecipeListSkeleton />}
				data-id="recipe-list-suspense"
			>
				<RecipeList data-id="recipe-list" />
			</Suspense>
		);
}

export default RecipePage