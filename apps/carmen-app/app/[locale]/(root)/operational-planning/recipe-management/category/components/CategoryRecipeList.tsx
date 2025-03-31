import { CategoryRecipeDto } from "@/dtos/operational-planning.dto";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash } from "lucide-react";

interface CategoryRecipeListProps {
    readonly categories: CategoryRecipeDto[];
}

export default function CategoryRecipeList({ categories }: CategoryRecipeListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Recipes</TableHead>
                            <TableHead>Cost & Margin</TableHead>
                            <TableHead>Last Update</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category, index) => (
                            <TableRow key={category.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.code}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    <Badge variant={category.status === "active" ? "default" : "destructive"}>
                                        {category.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{category.recipe_count} Total</p>
                                        <p className="text-sm text-muted-foreground">{category.active_count} Active</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Avg Cost: ${category.avg_cost}</p>
                                        <p className="text-sm text-muted-foreground">Margin: {category.avg_margin}%</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{category.last_update}</p>
                                        <p className="text-sm text-muted-foreground">Last Active: {category.last_active}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="grid gap-4 md:hidden">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium">{category.code}</p>
                                    <Badge variant={category.status === "active" ? "default" : "destructive"}>
                                        {category.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="text-sm font-medium">{category.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm font-medium">{category.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Recipes</p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{category.recipe_count} Total</p>
                                        <p className="text-sm text-muted-foreground">{category.active_count} Active</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Cost & Margin</p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">Avg Cost: ${category.avg_cost}</p>
                                        <p className="text-sm text-muted-foreground">Margin: {category.avg_margin}%</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Last Update</p>
                                    <p className="text-sm font-medium">{category.last_update}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Last Active</p>
                                    <p className="text-sm font-medium">{category.last_active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

