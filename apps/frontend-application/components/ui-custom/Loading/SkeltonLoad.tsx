import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const SkeltonLoad = () => {
	return (
		<div className="border border-gray-200 rounded-md">
			<div className="block md:hidden px-4 py-3">
				<div className="grid grid-cols-1 gap-4">
					{Array.from({ length: 6 }).map((_, rowIndex) => (
						<Skeleton key={rowIndex} className="h-[125px] w-full rounded-xl" />
					))}
				</div>
			</div>

			<div className="hidden md:block divide-y divide-gray-200">
				<div className="border border-gray-200 rounded-md p-5">
					<Skeleton className="h-[50px] w-full mb-4" />
					<div className="divide-y divide-gray-200 space-y-4">
						{Array.from({ length: 10 }).map((_, rowIndex) => (
							<div key={rowIndex} className="grid grid-cols-4 gap-4">
								{Array.from({ length: 4 }).map((_, colIndex) => (
									<Skeleton key={colIndex} className="h-4 w-full mt-4" />
								))}
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default SkeltonLoad;
