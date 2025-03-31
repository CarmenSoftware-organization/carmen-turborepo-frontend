import { RecipeDto } from "@/dtos/operational-planning.dto";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Clock, 
    Users, 
    Utensils, 
    ChefHat, 
    Flame, 
    Star, 
    ArrowLeft, 
    BookOpen, 
    Edit, 
    FileDown,
    Printer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Props {
    readonly recipe: RecipeDto;
}

export default function RecipeDetailsComponent({ recipe }: Props) {
    return (
        <div className="container mx-auto max-w-7xl space-y-6 pb-10">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild className="h-9">
                        <Link href="/operational-planning/recipe-management/recipe">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to recipes
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
                        <FileDown className="h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 h-9">
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>
                </div>
            </div>
            
            <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden">
                            <div className="aspect-square w-full relative">
                                <img 
                                    src={recipe.image} 
                                    alt={recipe.name}
                                    className="w-full h-full object-cover" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                                    <div className="p-4 text-white w-full">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                            <span className="font-semibold text-lg">{recipe.rating}</span>
                                            <span className="text-sm opacity-80">({recipe.reviewCount} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <h1 className="text-2xl font-bold mb-3">{recipe.name}</h1>
                                
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                                        <Clock className="h-5 w-5 mb-2 text-muted-foreground" />
                                        <span className="text-sm font-medium">{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins</span>
                                        <span className="text-xs text-muted-foreground">Total Time</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                                        <Users className="h-5 w-5 mb-2 text-muted-foreground" />
                                        <span className="text-sm font-medium">{recipe.serving}</span>
                                        <span className="text-xs text-muted-foreground">Servings</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                                        <ChefHat className="h-5 w-5 mb-2 text-muted-foreground" />
                                        <span className="text-sm font-medium">{recipe.difficulty}</span>
                                        <span className="text-xs text-muted-foreground">Difficulty</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-lg">
                                        <Flame className="h-5 w-5 mb-2 text-muted-foreground" />
                                        <span className="text-sm font-medium">{recipe.caloriesPerServing}</span>
                                        <span className="text-xs text-muted-foreground">Calories/Serving</span>
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-2">Cuisine</h3>
                                    <Badge variant="outline" className="font-normal">
                                        {recipe.cuisine}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {recipe.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="font-normal">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Utensils className="h-5 w-5" />
                                    Ingredients
                                </CardTitle>
                                <CardDescription>
                                    For {recipe.serving} servings
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <div key={`ingredient-${index}`} className="flex items-start gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                        <span>{ingredient}</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <BookOpen className="h-5 w-5" />
                                    Instructions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {recipe.instructions.map((instruction, index) => (
                                    <div key={`instruction-${index}`} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 pt-1">
                                            <p>{instruction}</p>
                                            {index < recipe.instructions.length - 1 && (
                                                <Separator className="mt-6" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

