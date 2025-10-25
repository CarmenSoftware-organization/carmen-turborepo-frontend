import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

interface RecipeListProps {
    readonly data: RecipeDto[];
    readonly isLoading: boolean;
}

export default function RecipeList({ data, isLoading }: RecipeListProps) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                {['skeleton-row-1', 'skeleton-row-2', 'skeleton-row-3', 'skeleton-row-4', 'skeleton-row-5'].map((id) => (
                    <div key={id} className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-md" />
                        <Skeleton className="h-16 flex-1" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <ScrollArea className="h-[calc(100vh-230px)]">
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Cuisine</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Tags</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((recipe) => (
                            <TableRow key={recipe.id}>
                                <TableCell>
                                    <Image
                                        src={recipe.image}
                                        alt={recipe.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                        width={64}
                                        height={64}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{recipe.name}</TableCell>
                                <TableCell>{recipe.cuisine}</TableCell>
                                <TableCell>{recipe.difficulty}</TableCell>
                                <TableCell>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span>{recipe.rating}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-wrap gap-1">
                                        {recipe.tags.map((tag) => (
                                            <Badge key={tag} variant="outline">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/operational-planning/recipe-management/recipe/${recipe.id}`}>
                                            <EyeIcon className="w-4 h-4" />
                                        </Link>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
    );
}

