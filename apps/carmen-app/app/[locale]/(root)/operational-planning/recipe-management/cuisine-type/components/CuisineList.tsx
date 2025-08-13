import { CuisineTypeDto } from "@/dtos/operational-planning.dto";
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

interface CuisineListProps {
    readonly cuisineTypes: CuisineTypeDto[];
}

export default function CuisineList({ cuisineTypes }: CuisineListProps) {
    return (
        <div className="space-y-4">
            <div className="hidden md:block">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 text-center">#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Recipes</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cuisineTypes.map((cuisine, index) => (
                            <TableRow key={cuisine.id}>
                                <TableCell className="text-center w-10">{index + 1}</TableCell>
                                <TableCell className="font-medium">{cuisine.name}</TableCell>
                                <TableCell>{cuisine.code}</TableCell>
                                <TableCell>{cuisine.region}</TableCell>
                                <TableCell>{cuisine.description}</TableCell>
                                <TableCell>
                                    <Badge variant={cuisine.status === "active" ? "default" : "destructive"}>
                                        {cuisine.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{cuisine.recipe_count} Total</p>
                                        <p className="text-sm text-muted-foreground">{cuisine.active_count} Active</p>
                                    </div>
                                </TableCell>
                                <TableCell>{cuisine.last_active}</TableCell>
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
                {cuisineTypes.map((cuisine) => (
                    <Card key={cuisine.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="fxr-c gap-2">
                                    <p className="text-sm font-medium">{cuisine.code}</p>
                                    <Badge variant={cuisine.status === "active" ? "default" : "destructive"}>
                                        {cuisine.status}
                                    </Badge>
                                </div>
                                <div className="fxr-c gap-1">
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
                                    <p className="text-sm font-medium">{cuisine.name}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Region</p>
                                    <p className="text-sm font-medium">{cuisine.region}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p className="text-sm font-medium">{cuisine.description}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Recipes</p>
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{cuisine.recipe_count} Total</p>
                                        <p className="text-sm text-muted-foreground">{cuisine.active_count} Active</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Last Active</p>
                                    <p className="text-sm font-medium">{cuisine.last_active}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

