import { RecipeDto, RecipeResponse } from "@/dtos/operational-planning.dto";

export const fetchRecipe = async (query?: string): Promise<RecipeResponse> => {
    const url = `https://dummyjson.com/recipes?${query}`;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    return data;
}


export const fetchRecipeById = async (id: string): Promise<RecipeDto> => {
    const url = `https://dummyjson.com/recipes/${id}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
}
