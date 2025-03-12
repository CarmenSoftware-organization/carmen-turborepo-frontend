import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const ProductLoading = () => {
	return (
		<div className="m-4 space-y-4">
			<Card>
				<Skeleton className="h-[125px] w-full rounded-xl" />
			</Card>
			<div className="flex w-full gap-4">
				<Card className="w-1/2">
					<Skeleton className="h-[500px] rounded-xl" />
				</Card>
				<Card className="w-1/2">
					<Skeleton className="h-[500px] rounded-xl" />
				</Card>
			</div>
		</div>
	);
};

export default ProductLoading;
