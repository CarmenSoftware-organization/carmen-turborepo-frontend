import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface Props {
    readonly data: RecipeDto[];
    readonly isLoading: boolean;
}

export default function RecipeGrid({ data, isLoading }: Props) {
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
        <ScrollArea className="h-[calc(100vh-230px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-1">
                {data.map((recipe) => (
                    <Card
                        key={recipe.id}
                        className="w-full cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 p-3"
                        onClick={() => router.push(`/operational-planning/recipe-management/recipe/${recipe.id}`)}
                    >
                        <Image
                            src={recipe.image}
                            alt={recipe.name}
                            className="w-full h-24 object-cover rounded-md mb-4"
                        />
                        <h3 className="text-base font-semibold">{recipe.name}</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    {recipe.cuisine} • {recipe.difficulty}
                                </p>
                                <div className="flex items-center gap-1">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-xs">{recipe.rating}</span>
                                </div>
                            </div>
                            <p className="text-xs">
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
                    </Card>
                ))}
            </div>
        </ScrollArea>
    );
}

