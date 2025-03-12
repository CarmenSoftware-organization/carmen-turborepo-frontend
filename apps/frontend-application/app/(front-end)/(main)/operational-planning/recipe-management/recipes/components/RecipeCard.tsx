import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { RecipeCreateModel } from '@/dtos/recipe.dto';
import { CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/lib/i18n';

interface RecipeCardCompactProps {
	recipe: RecipeCreateModel;
}

const RecipeCard: React.FC<RecipeCardCompactProps> = ({ recipe }) => {
	return (
		<Card className="overflow-hidden transition-all hover:ring-2 hover:ring-primary/50 group-hover:shadow-lg">
			<Link
				href={`/operational-planning/recipe-management/recipes/${recipe.id}`}
			>
				<div className="relative">
					<Image
						src={recipe.image}
						alt={recipe.name}
						width={300}
						height={300}
						priority={false}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
					<Badge
						variant={recipe.status === 'published' ? 'default' : 'secondary'}
						className="absolute top-2 right-2"
					>
						{recipe.status === 'published' ? (
							<CheckCircle2 className="h-3 w-3 mr-1" />
						) : (
							<XCircle className="h-3 w-3 mr-1" />
						)}
						{recipe.status}
					</Badge>
				</div>
				<div className="p-4">
					<h3 className="font-semibold truncate group-hover:text-primary transition-colors">
						{recipe.name}
					</h3>
					<div className="mt-2 text-sm text-muted-foreground">
						<div className="flex justify-between">
							<span>Cost/Portion</span>
							<span className="font-medium">
								${recipe.costPerPortion.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Selling Price</span>
							<span className="font-medium">
								${recipe.sellingPrice.toFixed(2)}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Margin</span>
							<span className="font-medium">
								{recipe.grossMargin.toFixed(1)}%
							</span>
						</div>
						<div className="text-sm text-muted-foreground">
							<div className="flex items-center gap-2">
								<span>CO₂eq per Portion:</span>
								<span className="font-medium">{recipe.carbonFootprint} kg</span>
							</div>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
						<Badge variant="secondary" className="font-normal">
							{recipe.category}
						</Badge>
						{recipe.cuisine && (
							<Badge variant="secondary" className="font-normal">
								{recipe.cuisine}
							</Badge>
						)}
					</div>
				</div>
			</Link>
		</Card>
	);
};

export default RecipeCard;
