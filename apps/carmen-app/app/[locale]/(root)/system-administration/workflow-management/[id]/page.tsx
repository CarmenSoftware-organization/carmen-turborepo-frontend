'use client';
import React, { useEffect, useState } from 'react';
import WorkflowDetail from '../components/WorkflowDetail';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { WorkflowCreateModel } from '@/dtos/workflows.dto';
import { fetchWorkflow } from '@/services/workflow';
import { formType } from '@/dtos/form.dto';

const WorkflowDetailPage = ({ params }: { params: { id: string } }) => {
	const token = 'mock-token';
	const tenantId = 'mock-tenant-id';
	const [wfData, setWfdata] = useState<WorkflowCreateModel | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefresh, setRefresh] = useState(false);

	const fetchById = async () => {
		if (!params.id || !token) return;
		try {
			const data = await fetchWorkflow(token, tenantId, params.id);
			setWfdata(data);
			setIsLoading(false);
			setRefresh(false);
		} catch (err) {
			console.error('Failed to fetch data:', err);
		}
	};

	useEffect(() => {
		fetchById();
	}, [token, isRefresh]);

	if (isLoading) {
		return (
			<div className="m-4 space-y-4 mt-20">
				<Card>
					<Skeleton className="h-[125px] w-full rounded-xl" />
				</Card>
				<Card>
					<Skeleton className="h-[400px] w-full rounded-xl" />
				</Card>
			</div>
		);
	}

	if (!setWfdata) {
		return null;
	}

	// eslint-disable-next-line react/react-in-jsx-scope
	return (
		<WorkflowDetail
			wfData={wfData}
			mode={formType.EDIT}
			isRefresh={isRefresh}
			setRefresh={setRefresh}
		/>
	);
};

export default WorkflowDetailPage;
