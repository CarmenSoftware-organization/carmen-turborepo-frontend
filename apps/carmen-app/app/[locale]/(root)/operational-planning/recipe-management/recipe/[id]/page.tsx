import { fetchRecipeById } from "@/services/operational-planning.service";
import RecipeDetailsComponent from "../_components/RecipeDetailsComponent";
export default async function RecipePage({ params }: { readonly params: { readonly id: string } }) {
    const recipe = await fetchRecipeById(params.id);
    return <RecipeDetailsComponent recipe={recipe} />;
}
