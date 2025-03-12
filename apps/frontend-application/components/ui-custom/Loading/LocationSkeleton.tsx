import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

const LocationSkeleton = () => {
	return (
		<Card>
			<CardContent className="p-6">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Location Name</TableHead>
							<TableHead>Location Type</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 3 }).map((_, index) => (
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-[150px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[100px]" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default LocationSkeleton;
