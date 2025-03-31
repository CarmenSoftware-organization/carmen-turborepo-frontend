import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, ChefHat, Star } from "lucide-react";

interface Props {
    readonly data: RecipeDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly handleSkip: (page: number) => void;
}

export default function RecipeGrid({ data, isLoading }: Props) {
    const router = useRouter();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }, (_, i) => i).map((id) => (
                    <Card key={`skeleton-${id}`} className="overflow-hidden">
                        <Skeleton className="h-48 w-full" />
                        <CardHeader className="px-4 py-3 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="px-4 py-2">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </CardContent>
                        <CardFooter className="px-4 py-3 flex justify-between">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((recipe) => (
                <Card
                    key={recipe.id}
                    className="overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer"
                    onClick={() => router.push(`/operational-planning/recipe-management/recipe/${recipe.id}`)}
                >
                    <div className="relative aspect-video w-full overflow-hidden">
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                            <Badge className="bg-black/70 text-white hover:bg-black/80">
                                <Star className="h-3 w-3 text-yellow-400 mr-1 fill-yellow-400" />
                                {recipe.rating}
                            </Badge>
                        </div>
                    </div>
                    
                    <CardHeader className="px-4 py-3 space-y-1">
                        <h3 className="text-lg font-semibold line-clamp-1">{recipe.name}</h3>
                        <p className="text-sm text-muted-foreground">{recipe.cuisine}</p>
                    </CardHeader>
                    
                    <CardContent className="px-4 py-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {recipe.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="font-normal text-xs">
                                    {tag}
                                </Badge>
                            ))}
                            {recipe.tags.length > 3 && (
                                <Badge variant="outline" className="font-normal text-xs">
                                    +{recipe.tags.length - 3}
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-3.5 w-3.5" />
                                <span>{recipe.serving}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <ChefHat className="h-3.5 w-3.5" />
                                <span>{recipe.difficulty}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

