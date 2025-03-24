'use client';
import React from 'react';
import * as Form from '@/components/ui/form';
import { Control } from 'react-hook-form';
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
import { WorkflowCreateModel, workflowTypeField } from '@/dtos/workflows.dto';

interface WorkflowGeneralProps {
	control: Control<WorkflowCreateModel>;
	isEditing: boolean;
}

const WorkflowGeneral = ({ control, isEditing }: WorkflowGeneralProps) => {
	return (
		<Card>
			<CardHeader className="px-6 py-4">
				<CardTitle>General Information</CardTitle>
			</CardHeader>
			<CardContent className="px-6 py-4">
				<Form.FormField
					control={control}
					name="name"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Workflow Name</Form.FormLabel>
							<Form.FormControl>
								<Input
									{...field}
									value={String(field.value || '')}
									placeholder="Enter workflow name"
									disabled={!isEditing}
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<div>
					<Form.FormField
						control={control}
						name="workflow_type"
						render={({ field }) => (
							<Form.FormItem>
								<Form.FormLabel>Type</Form.FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={!isEditing}
								>
									<Form.FormControl>
										<SelectTrigger id="workflow_type">
											<SelectValue placeholder="Select Workflow Type" />
										</SelectTrigger>
									</Form.FormControl>
									<SelectContent>
										{workflowTypeField.map(({ label, value }) => (
											<SelectItem
												key={value}
												value={value}
												className="cursor-pointer"
											>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Form.FormMessage />
							</Form.FormItem>
						)}
					/>
				</div>
				<div>
					<Form.FormField
						control={control}
						name="is_active"
						render={({ field }) => (
							<Form.FormItem>
								<Form.FormLabel>Status</Form.FormLabel>
								<div className="flex items-center space-x-2">
									<Form.FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											disabled={!isEditing}
										/>
									</Form.FormControl>
									<Label className="text-sm text-muted-foreground">
										{field.value ? 'Active' : 'Inactive'}
									</Label>
								</div>
								<Form.FormMessage />
							</Form.FormItem>
						)}
					/>
					{/* <div className="flex items-center space-x-2"></div> */}
				</div>
				<div>
					<Form.FormField
						control={control}
						name="description"
						render={({ field }) => (
							<Form.FormItem>
								<Form.FormLabel>Description</Form.FormLabel>
								<Form.FormControl>
									<Textarea
										{...field}
										value={String(field.value || '')}
										placeholder="Enter description"
										disabled={!isEditing}
									/>
								</Form.FormControl>
								<Form.FormMessage />
							</Form.FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	);
};

export default WorkflowGeneral;
