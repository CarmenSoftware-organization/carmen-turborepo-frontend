import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock, Users, Utensils, ChefHat, Flame, Star, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
    readonly recipe: RecipeDto;
}

export default function RecipeDetailsComponent({ recipe }: Props) {
    return (
        <div className="container mx-auto space-y-4">
            <Button variant="outline" asChild>
                <Link href="/operational-planning/recipe-management/recipe">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </Link>
            </Button>

            <ScrollArea className="h-[calc(100vh-10rem)]">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="md:w-1/3">
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-[250px] object-cover rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="md:w-1/2 space-y-2 text-xs">
                        <h1 className="text-3xl font-bold">{recipe.name}</h1>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span>{recipe.serving} servings</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ChefHat className="w-5 h-5" />
                                <span>{recipe.difficulty}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5" />
                                <span>{recipe.caloriesPerServing} cal/serving</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <span className="font-semibold">{recipe.rating}</span>
                            <span className="text-gray-600">({recipe.reviewCount} reviews)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {recipe.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <BookOpen className="w-6 h-6" />
                                Instructions
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <ol className="space-y-2 text-xs">
                                {recipe.instructions.map((instruction, index) => (
                                    <li key={`instruction-${instruction}`} className="flex items-center gap-4">
                                        <span className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                                            {index + 1}
                                        </span>
                                        <span>{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Utensils className="w-6 h-6" />
                                Ingredients
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                {recipe.ingredients.map((ingredient) => (
                                    <li key={`ingredient-${ingredient}`} className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-primary rounded-full" />
                                        {ingredient}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                </div>
            </ScrollArea>


        </div>
    );
}

