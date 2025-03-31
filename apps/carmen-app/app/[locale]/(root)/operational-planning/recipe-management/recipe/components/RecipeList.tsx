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
import { Clock, EyeIcon, Star } from "lucide-react";
import { Link } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecipeListProps {
    readonly data: RecipeDto[];
    readonly isLoading: boolean;
    readonly currentPage: number;
    readonly totalPages: number;
    readonly handleSkip: (page: number) => void;
}

export default function RecipeList({ data, isLoading }: RecipeListProps) {
    if (isLoading) {
        return (
            <div className="rounded-md border">
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
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }, (_, i) => i).map((id) => (
                            <TableRow key={`skeleton-row-${id}`}>
                                <TableCell><Skeleton className="h-14 w-14 rounded-md" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-9 w-9 rounded-md" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Cuisine</TableHead>
                        <TableHead>Difficulty</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="w-[80px] text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((recipe) => (
                        <TableRow key={recipe.id} className="hover:bg-muted/50">
                            <TableCell>
                                <Avatar className="h-14 w-14 rounded-md">
                                    <AvatarImage 
                                        src={recipe.image} 
                                        alt={recipe.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="rounded-md">
                                        {recipe.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{recipe.name}</TableCell>
                            <TableCell>{recipe.cuisine}</TableCell>
                            <TableCell>{recipe.difficulty}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span>{recipe.rating}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                    {recipe.tags.slice(0, 2).map((tag) => (
                                        <Badge key={tag} variant="secondary" className="font-normal text-xs">
                                            {tag}
                                        </Badge>
                                    ))}
                                    {recipe.tags.length > 2 && (
                                        <Badge variant="outline" className="font-normal text-xs">
                                            +{recipe.tags.length - 2}
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                    <Link href={`/operational-planning/recipe-management/recipe/${recipe.id}`}>
                                        <EyeIcon className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

