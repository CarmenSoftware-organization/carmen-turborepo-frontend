'use client';
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WorkflowHeader from './WorkflowHeader';
import WorkflowGeneral from './WorkflowGeneral';
import WorkflowStages from './WorkflowStages';
import WorkflowRouting from './WorkflowRouting';
import WorkflowProducts from './WorkflowProducts';
import { sampleWorkflows } from '../data/mockData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Workflow } from '../types/workflow';

interface WorkflowDetailProps {
	workflowId: string;
}

const WorkflowDetail: React.FC<WorkflowDetailProps> = ({ workflowId }) => {
	const [workflow, setWorkflow] = useState<Workflow | undefined>(
		sampleWorkflows.find((w) => w.id === workflowId)
	);
	const [isEditing, setIsEditing] = useState(false);

	if (!workflow) {
		return (
			<Alert variant="destructive">
				<AlertCircle className="h-4 w-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					Workflow not found. Please check the provided workflow ID:{' '}
					{workflowId}
				</AlertDescription>
			</Alert>
		);
	}

	const handleEditToggle = () => {
		setIsEditing(!isEditing);
	};

	const handleSave = (updatedWorkflow: Workflow) => {
		setWorkflow(updatedWorkflow);
		setIsEditing(false);
	};

	const stageNames = workflow.data.stages.map((stage) => stage.name);

	return (
		<div className="container mx-auto py-6">
			<Button variant="ghost" asChild className="mb-4">
				<Link href="/system-administration/workflow-management">
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Workflows
				</Link>
			</Button>
			<WorkflowHeader
				workflow={workflow}
				isEditing={isEditing}
				onEditToggle={handleEditToggle}
				onSave={handleSave}
			/>
			<Tabs defaultValue="general">
				<TabsList className="grid w-full grid-cols-4 mt-2">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="stages">Stages</TabsTrigger>
					<TabsTrigger value="routing">Routing</TabsTrigger>
					<TabsTrigger value="products">Products</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
					<WorkflowGeneral
						workflow={workflow}
						isEditing={isEditing}
						onSave={(updatedWorkflow: Workflow) =>
							handleSave({ ...workflow, ...updatedWorkflow })
						}
					/>
				</TabsContent>
				<TabsContent value="stages">
					<WorkflowStages
						stages={workflow.data.stages}
						isEditing={isEditing}
						onSave={(stages) =>
							handleSave({ ...workflow, data: { ...workflow.data, stages } })
						}
					/>
				</TabsContent>
				<TabsContent value="routing">
					<WorkflowRouting
						rules={workflow.data.routingRules || []}
						stages={stageNames}
						isEditing={isEditing}
						onSave={(routingRules) =>
							handleSave({
								...workflow,
								data: { ...workflow.data, routingRules },
							})
						}
					/>
				</TabsContent>
				<TabsContent value="products">
					<WorkflowProducts
						products={workflow.data.products || []}
						isEditing={isEditing}
						onSave={(products) =>
							handleSave({ ...workflow, data: { ...workflow.data, products } })
						}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default WorkflowDetail;
