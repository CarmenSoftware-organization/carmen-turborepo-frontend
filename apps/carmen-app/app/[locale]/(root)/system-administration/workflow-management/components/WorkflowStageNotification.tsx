'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as Form from '@/components/ui/form';
import { Control, ControllerRenderProps } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { Stage, WorkflowCreateModel } from '@/dtos/workflows.dto';

interface WorkflowStageNotificationProps {
	selectedStage: Stage;
	index: number;
	control: Control<WorkflowCreateModel>;
	isEditing: boolean;
}

const WorkflowStageNotification = ({
	selectedStage,
	index,
	control,
	isEditing,
}: WorkflowStageNotificationProps) => {
	const FieldForm = ({
		value,
		onChange,
		label,
		disabled,
	}: ControllerRenderProps & { label: string; disabled: boolean }) => (
		<Form.FormItem>
			<div className="fxr-c space-x-2">
				<Form.FormControl>
					<Switch
						checked={value}
						onCheckedChange={onChange}
						disabled={disabled}
					/>
				</Form.FormControl>
				<Form.FormLabel>{label}</Form.FormLabel>
			</div>
			<Form.FormMessage />
		</Form.FormItem>
	);

	return (
		<div className="space-y-6">
			<div className="grid gap-6">
				{selectedStage.available_actions.submit.is_active && (
					<Card>
						<CardHeader>
							<CardTitle>Submit Notification</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Recipients</Label>
								<div className="grid gap-2 mt-2">
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.submit.recipients.requestor`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Requester"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
									{selectedStage.available_actions.approve.is_active && (
										<div className="fxr-c space-x-2">
											<Form.FormField
												control={control}
												name={`data.stages.${index}.available_actions.submit.recipients.next_step`}
												render={({ field }) => (
													<FieldForm
														{...field}
														label="Next Stage Approver"
														disabled={!isEditing}
													/>
												)}
											/>
										</div>
									)}
								</div>
							</div>
							<div>
								<Label>Template</Label>
								<Select disabled={!isEditing}>
									<SelectTrigger>
										<SelectValue placeholder="Select template" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">Request Submitted</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				)}

				{selectedStage.available_actions.approve.is_active && (
					<Card>
						<CardHeader>
							<CardTitle>Approve Notification</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Recipients</Label>
								<div className="grid gap-2 mt-2">
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.approve.recipients.requestor`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Requestor"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.approve.recipients.current_approve`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Current Approver"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
									{selectedStage.available_actions.approve.is_active && (
										<div className="fxr-c space-x-2">
											<Form.FormField
												control={control}
												name={`data.stages.${index}.available_actions.approve.recipients.next_step`}
												render={({ field }) => (
													<FieldForm
														{...field}
														label="Next Stage Approver"
														disabled={!isEditing}
													/>
												)}
											/>
										</div>
									)}
								</div>
							</div>
							<div>
								<Label>Template</Label>
								<Select disabled={!isEditing}>
									<SelectTrigger>
										<SelectValue placeholder="Select template" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="2">Request Approved</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				)}

				{selectedStage.available_actions.reject.is_active && (
					<Card>
						<CardHeader>
							<CardTitle>Reject Notification</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Recipients</Label>
								<div className="grid gap-2 mt-2">
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.reject.recipients.requestor`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Requestor"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.reject.recipients.next_step`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Previous Stage Approver"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
								</div>
							</div>
							<div>
								<Label>Template</Label>
								<Select disabled={!isEditing}>
									<SelectTrigger>
										<SelectValue placeholder="Select template" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="3">Request Rejected</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				)}

				{selectedStage.available_actions.sendback.is_active && (
					<Card>
						<CardHeader>
							<CardTitle>Send Back Notification</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<Label>Recipients</Label>
								<div className="grid gap-2 mt-2">
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.sendback.recipients.requestor`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Requestor"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
									<div className="fxr-c space-x-2">
										<Form.FormField
											control={control}
											name={`data.stages.${index}.available_actions.sendback.recipients.next_step`}
											render={({ field }) => (
												<FieldForm
													{...field}
													label="Previous Stage Approver"
													disabled={!isEditing}
												/>
											)}
										/>
									</div>
								</div>
							</div>
							<div>
								<Label>Template</Label>
								<Select disabled={!isEditing}>
									<SelectTrigger>
										<SelectValue placeholder="Select template" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="4">Request Sent Back</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</CardContent>
					</Card>
				)}

				<Card>
					<CardHeader>
						<CardTitle>SLA Warning Notification</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label>Recipients</Label>
							<div className="grid gap-2 mt-2">
								<div className="fxr-c space-x-2">
									<Switch id="sla-requestor" disabled={!isEditing} />
									<Label htmlFor="sla-requestor" className="cursor-pointer">
										Requestor
									</Label>
								</div>
								<div className="fxr-c space-x-2">
									<Switch id="sla-current-approver" disabled={!isEditing} />
									<Label
										htmlFor="sla-current-approver"
										className="cursor-pointer"
									>
										Current Approver
									</Label>
								</div>
							</div>
						</div>
						<div>
							<Label>Template</Label>
							<Select disabled={!isEditing}>
								<SelectTrigger>
									<SelectValue placeholder="Select template" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="5">SLA Warning</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default WorkflowStageNotification;
