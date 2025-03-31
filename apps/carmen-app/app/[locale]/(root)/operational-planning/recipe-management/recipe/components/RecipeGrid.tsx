import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";

interface Props {
    readonly data: RecipeDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly handleSkip: (page: number) => void;
}

export default function RecipeGrid({ data, isLoading, currentPage, totalPages, handleSkip }: Props) {

    const router = useRouter();

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4', 'skeleton-5', 'skeleton-6'].map((id) => (
                    <Card key={id} className="w-full">
                        <CardHeader>
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {data.map((recipe) => (
                <Card
                    key={recipe.id}
                    className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
                    onClick={() => router.push(`/operational-planning/recipe-management/recipe/${recipe.id}`)}
                >
                    <CardHeader>
                        <h3 className="text-lg font-semibold">{recipe.name}</h3>
                    </CardHeader>
                    <CardContent>
                        <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-32 object-cover rounded-md mb-4"
                        />
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-600">
                                    {recipe.cuisine} • {recipe.difficulty}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm">{recipe.rating}</span>
                                </div>
                            </div>
                            <p className="text-sm">
                                {recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins • {recipe.serving} servings
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {recipe.tags.map((tag) => (
                                    <Badge key={tag} variant="outline">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

