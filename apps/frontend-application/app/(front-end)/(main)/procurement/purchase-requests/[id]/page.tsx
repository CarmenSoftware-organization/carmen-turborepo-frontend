'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import PrDetail from '../components/PrDetail';
import { formType } from '@/constants/enums';

// Define the purchase request data type
interface PurchaseRequestData {
	id: string;
	type: string;
	description: string;
	requestor: string;
	department: string;
	date: string;
	status: string;
	amount: number;
	currentStage: string;
	totalAmount: number;
	currentWorkflowStage: string;
}

const PurchaseRequestIdPage = () => {
	const { id } = useParams() as { id: string };
	const [prData, setPrData] = useState<PurchaseRequestData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchPurchaseRequest = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const response = await fetch(
					`/api/procurement/purchase-requests/${id}`
				);

				if (!response.ok) {
					throw new Error(
						`Failed to fetch purchase request: ${response.statusText}`
					);
				}

				const result = await response.json();

				if (result.data) {
					setPrData({
						...result.data,
						totalAmount: result.data.amount,
						currentWorkflowStage: result.data.currentStage
					});
				} else {
					throw new Error('No data returned from API');
				}
			} catch (err) {
				setError(
					err instanceof Error ? err.message : 'An unknown error occurred'
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (id) {
			fetchPurchaseRequest();
		}
	}, [id]);

	if (error) {
		return (
			<Alert variant="destructive" className="mx-auto max-w-4xl mt-6">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<div className="container mx-auto py-6 max-w-4xl">
				<div className="space-y-4">
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
					<Skeleton className="h-10 w-full" />
				</div>
			</div>
		);
	}

	return (
		<PrDetail
			prData={prData}
			data-id="pr-detail-component"
			formType={formType.VIEW}
		/>
	);
};

export default PurchaseRequestIdPage;