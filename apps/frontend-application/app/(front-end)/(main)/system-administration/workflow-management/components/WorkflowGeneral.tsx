'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Workflow } from '../types/workflow';

interface WorkflowGeneralProps {
	workflow: Workflow;
	isEditing: boolean;
	onSave: (updatedWorkflow: Workflow) => void;
}

const WorkflowGeneral: React.FC<WorkflowGeneralProps> = ({
	workflow,
	isEditing,
	onSave,
}) => {
	const [editedWorkflow, setEditedWorkflow] = useState({ ...workflow });

	// Reset form when workflow prop changes or edit mode is disabled
	useEffect(() => {
		setEditedWorkflow(workflow);
	}, [workflow, isEditing]);

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const updatedWorkflow = {
			...workflow,
			...editedWorkflow,
			[e.target.id]: e.target.value,
		};
		setEditedWorkflow(updatedWorkflow);
		onSave(updatedWorkflow);
	};

	const handleSelectChange = (value: string) => {
		const updatedWorkflow = {
			...editedWorkflow,
			type: value,
		};
		setEditedWorkflow(updatedWorkflow);
		onSave(updatedWorkflow);
	};

	const handleStatusChange = (checked: boolean) => {
		const updatedWorkflow = {
			...editedWorkflow,
			status: checked ? 'Active' : 'Inactive',
		};
		setEditedWorkflow(updatedWorkflow);
		onSave(updatedWorkflow);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>General Information</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
					<div>
						<Label htmlFor="name">Workflow Name</Label>
						<Input
							id="name"
							value={editedWorkflow.name}
							onChange={handleInputChange}
							disabled={!isEditing}
						/>
					</div>
					<div>
						<Label htmlFor="type">Type</Label>
						<Select
							value={editedWorkflow.workflow_type}
							onValueChange={handleSelectChange}
							disabled={!isEditing}
						>
							<SelectTrigger id="type">
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Purchase Request">
									Purchase Request
								</SelectItem>
								<SelectItem value="Store Requisition">
									Store Requisition
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor="status">Status</Label>
						<div className="flex items-center space-x-2">
							<Switch
								id="status"
								checked={editedWorkflow.is_active}
								onCheckedChange={handleStatusChange}
								disabled={!isEditing}
							/>
							<Label htmlFor="status" className="text-sm text-muted-foreground">
								{editedWorkflow.is_active ? 'Active' : 'Inactive'}
							</Label>
						</div>
					</div>
					<div>
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							value={editedWorkflow.description}
							onChange={handleInputChange}
							disabled={!isEditing}
						/>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default WorkflowGeneral;
