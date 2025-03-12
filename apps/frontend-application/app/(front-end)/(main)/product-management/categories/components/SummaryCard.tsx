import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as m from '@/paraglide/messages.js';
interface SummaryCardProps {
	title: string;
	count: number;
	icon: React.ReactNode;
	onAddData: () => void;
	disabled?: boolean;
	nameSelect?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
	title,
	count,
	icon,
	onAddData,
	disabled,
	nameSelect
}) => {
	return (
		<Card className="min-h-40">
			<CardHeader className="flex flex-row items-center justify-between pb-0">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Button
					onClick={onAddData}
					variant="ghost"
					size="icon"
					className={cn('h-8 w-8', disabled && 'cursor-not-allowed opacity-50')}
					disabled={disabled}
					aria-label={`${m.add_new_title()} ${title}`}
				>
					<Plus className="h-4 w-4" />
				</Button>
			</CardHeader>
			<CardContent className="py-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{icon}
						<span className="text-xl font-bold">{count}</span>
					</div>
				</div>
				<span className="text-xl font-bold">{nameSelect}</span>
			</CardContent>
		</Card>
	);
};

export default SummaryCard;
