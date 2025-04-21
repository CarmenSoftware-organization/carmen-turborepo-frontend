'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import * as Form from '@/components/ui/form';
import { Control, useFieldArray, UseFormReturn } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { users } from '../data/mockUser';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import WorkflowStageNotification from './WorkflowStageNotification';
import { enum_sla_unit, WorkflowCreateModel } from '@/dtos/workflows.dto';
import { slaUnitField } from '@/constants/fields';

enum enum_available_actions {
	submit = 'submit',
	approve = 'approve',
	reject = 'reject',
	sendback = 'sendback',
}

interface WorkflowStageProps {
	form: UseFormReturn<WorkflowCreateModel>;
	control: Control<WorkflowCreateModel>;
	isEditing: boolean;
}

const WorkflowStages = ({ form, control, isEditing }: WorkflowStageProps) => {
	const { fields, append, remove } = useFieldArray({
		name: 'data.stages',
		control: control,
	});
	const stages = form.getValues().data?.stages || [];
	const [selectedStageName, setSelectedStageName] = useState<string | null>(
		null
	);
	const [userFilter, setUserFilter] = useState<
		'all' | 'assigned' | 'unassigned'
	>('all');

	const selectedStage = form
		.getValues()
		.data?.stages?.find((stage) => stage.name === selectedStageName);

	const handleStageSelect = (stageName: string) => {
		setSelectedStageName(stageName);
	};

	const handleDeleteStage = (stageName: string) => {
		const index = form
			.getValues()
			.data?.stages?.findIndex((stage) => stage.name === stageName);
		remove(index);
		//onSave(updatedStages);
	};

	const handleAddStage = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		append({
			name: `Stage ${stages.length + 1}`,
			description: '',
			sla: '24',
			sla_unit: enum_sla_unit.hours,
			available_actions: {
				submit: {
					is_active: false,
					recipients: {
						requestor: false,
						current_approve: false,
						next_step: false,
					},
				},
				approve: {
					is_active: false,
					recipients: {
						requestor: false,
						current_approve: false,
						next_step: false,
					},
				},
				reject: {
					is_active: false,
					recipients: {
						requestor: false,
						current_approve: false,
						next_step: false,
					},
				},
				sendback: {
					is_active: false,
					recipients: {
						requestor: false,
						current_approve: false,
						next_step: false,
					},
				},
			},
			hide_fields: {
				price_per_unit: false,
				total_price: false,
			},
			assigned_users: [],
		});

		setSelectedStageName(`Stage ${stages.length + 1}`);
	};

	const handleActionToggle = (action: enum_available_actions) => {
		if (!selectedStage) return;
		const updatedStages = stages.map((stage) => {
			if (stage.name === selectedStage.name) {
				const updatedActions = { ...stage.available_actions };

				if (updatedActions[action]) {
					updatedActions[action] = {
						...updatedActions[action],
						is_active: !updatedActions[action].is_active,
					};
				}

				return {
					...stage,
					available_actions: updatedActions,
				};
			}
			return stage;
		});
		form.setValue('data.stages', updatedStages);
	};

	const handleAssignUser = (user: {
		id: number;
		name: string;
		department: string;
		location: string;
	}) => {
		if (!selectedStage) return;

		const updatedStages = stages.map((stage) => {
			if (stage.name === selectedStage.name) {
				const isUserAssigned = stage.assigned_users.some(
					(u) => u.id === user.id
				);
				const updatedUsers = isUserAssigned
					? stage.assigned_users.filter((u) => u.id !== user.id)
					: [...stage.assigned_users, user];
				return { ...stage, assignedUsers: updatedUsers };
			}
			return stage;
		});
		form.setValue('data.stages', updatedStages);
	};

	const filteredUsers = users.filter((user) => {
		const isAssigned =
			selectedStage?.assigned_users.some((u) => u.id === user.id) ?? false;
		switch (userFilter) {
			case 'assigned':
				return isAssigned;
			case 'unassigned':
				return !isAssigned;
			default:
				return true;
		}
	});

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold">Workflow Stages</h2>
				<p className="text-sm text-muted-foreground">
					Configure workflow stages and their settings
				</p>
			</div>

			<div className="grid grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle>Stages</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							{stages.map((stage) => (
								<li
									key={stage.name}
									className={`p-2 rounded-md cursor-pointer ${selectedStageName === stage.name
										? 'bg-secondary'
										: 'hover:bg-secondary/50'
										}`}
									onClick={() => handleStageSelect(stage.name)}
								>
									{stage.name}
								</li>
							))}
						</ul>
						{isEditing && (
							<Button className="w-full mt-4" onClick={handleAddStage}>
								<UserPlus className="mr-2 h-4 w-4" /> Add Stage
							</Button>
						)}
					</CardContent>
				</Card>

				<Card className="col-span-2">
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Stage Details</CardTitle>

						{selectedStage && isEditing && (
							<div className="flex space-x-2">
								{selectedStage.name !== 'Request Creation' &&
									selectedStage.name !== 'Completed' && (
										<Button
											variant="outline"
											size="sm"
											onClick={() => handleDeleteStage(selectedStageName || '')}
										>
											<Trash2 className="h-4 w-4 mr-2" />
											Delete Stage
										</Button>
									)}
							</div>
						)}
					</CardHeader>
					<CardContent>
						{selectedStage ? (
							<Tabs defaultValue="general" className="space-y-4">
								<TabsList>
									<TabsTrigger value="general">General</TabsTrigger>
									<TabsTrigger value="notifications">Notifications</TabsTrigger>
									<TabsTrigger value="assigned-users">
										Assigned Users
									</TabsTrigger>
								</TabsList>
								<TabsContent value="general">
									{fields.map((field, index) => (
										<div key={field.id}>
											{field.name === selectedStageName && (
												<>
													<Form.FormField
														control={control}
														name={`data.stages.${index}.name`}
														render={({ field }) => (
															<Form.FormItem>
																<Form.FormLabel>Stage Name</Form.FormLabel>
																<Form.FormControl>
																	<Input
																		{...field}
																		placeholder="Enter Stage Name"
																		disabled={!isEditing}
																	/>
																</Form.FormControl>
															</Form.FormItem>
														)}
													/>
													<Form.FormField
														control={control}
														name={`data.stages.${index}.description`}
														render={({ field }) => (
															<Form.FormItem>
																<Form.FormLabel>Description</Form.FormLabel>
																<Form.FormControl>
																	<Input
																		{...field}
																		placeholder="Enter Description"
																		disabled={!isEditing}
																	/>
																</Form.FormControl>
															</Form.FormItem>
														)}
													/>
													<div className="grid grid-cols-2 gap-4">
														<Form.FormField
															control={control}
															name={`data.stages.${index}.sla`}
															render={({ field }) => (
																<Form.FormItem>
																	<Form.FormLabel>SLA</Form.FormLabel>
																	<Form.FormControl>
																		<Input
																			{...field}
																			placeholder="Enter SLA"
																			disabled={!isEditing}
																		/>
																	</Form.FormControl>
																</Form.FormItem>
															)}
														/>
														<Form.FormField
															control={control}
															name={`data.stages.${index}.sla_unit`}
															render={({ field }) => (
																<Form.FormItem>
																	<Form.FormLabel>SLA Unit</Form.FormLabel>
																	<Select
																		onValueChange={field.onChange}
																		defaultValue={field.value}
																		disabled={!isEditing}
																	>
																		<Form.FormControl>
																			<SelectTrigger id="sla_unit">
																				<SelectValue placeholder="Select SLA Unit" />
																			</SelectTrigger>
																		</Form.FormControl>
																		<SelectContent>
																			{slaUnitField.map(({ label, value }) => (
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
														<Label>Available Actions</Label>
														<div className="flex flex-wrap gap-2 mt-2">
															{(
																Object.keys(enum_available_actions) as Array<
																	keyof typeof enum_available_actions
																>
															).map((action) => (
																<Button
																	key={action}
																	variant={
																		selectedStage.available_actions[
																			enum_available_actions[action]
																		]?.is_active
																			? 'default'
																			: 'outline'
																	}
																	size="sm"
																	onClick={() =>
																		handleActionToggle(
																			enum_available_actions[action]
																		)
																	}
																	disabled={!isEditing}
																>
																	{action}
																</Button>
															))}
														</div>
													</div>

													<div className="space-y-3 mt-2">
														<Label>Hidden Fields</Label>
														<Form.FormField
															control={control}
															name={`data.stages.${index}.hide_fields.price_per_unit`}
															render={({ field }) => (
																<Form.FormItem>
																	<div className="flex items-center justify-between">
																		<Form.FormLabel>
																			Price Per Unit
																		</Form.FormLabel>
																		<Form.FormControl>
																			<Switch
																				checked={field.value}
																				onCheckedChange={field.onChange}
																				disabled={!isEditing}
																			/>
																		</Form.FormControl>
																	</div>
																	<Form.FormMessage />
																</Form.FormItem>
															)}
														/>
														<Form.FormField
															control={control}
															name={`data.stages.${index}.hide_fields.total_price`}
															render={({ field }) => (
																<Form.FormItem>
																	<div className="flex items-center justify-between">
																		<Form.FormLabel>Total Price</Form.FormLabel>
																		<Form.FormControl>
																			<Switch
																				checked={field.value}
																				onCheckedChange={field.onChange}
																				disabled={!isEditing}
																			/>
																		</Form.FormControl>
																	</div>
																	<Form.FormMessage />
																</Form.FormItem>
															)}
														/>
													</div>
												</>
											)}
										</div>
									))}
								</TabsContent>

								<TabsContent value="notifications">
									{fields.map((field, index) => (
										<div key={field.id}>
											{field.name === selectedStageName && (
												<WorkflowStageNotification
													selectedStage={selectedStage}
													index={index}
													control={control}
													isEditing={isEditing}
												/>
											)}
										</div>
									))}
								</TabsContent>

								<TabsContent value="assigned-users">
									<div className="space-y-6">
										<div className="flex justify-between items-center">
											<div>
												<h2 className="text-lg font-semibold">Stage Users</h2>
												<p className="text-sm text-muted-foreground">
													Manage users assigned to this stage
												</p>
											</div>
										</div>

										<div className="flex space-x-4">
											<Input
												className="flex-grow"
												placeholder="Search users..."
												onChange={(e) => console.log('Search:', e.target.value)}
												disabled={!isEditing}
											/>
											<Select
												value={userFilter}
												onValueChange={(
													value: 'all' | 'assigned' | 'unassigned'
												) => setUserFilter(value)}
												disabled={!isEditing}
											>
												<SelectTrigger className="w-[180px]">
													<SelectValue placeholder="Filter by status" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="all">All Users</SelectItem>
													<SelectItem value="assigned">Assigned</SelectItem>
													<SelectItem value="unassigned">Unassigned</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<Card>
											<CardContent className="p-6">
												<div className="flex justify-between items-center mb-4">
													<span className="font-semibold">
														Total Users: {selectedStage.assigned_users.length} /{' '}
														{users.length}
													</span>
												</div>

												<div className="space-y-4">
													{filteredUsers.map((user) => {
														const isAssigned =
															selectedStage.assigned_users.some(
																(u) => u.id === user.id
															);
														return (
															<Card
																key={user.id}
																className={`p-4 hover:bg-gray-50 ${isAssigned ? 'border-primary' : ''}`}
															>
																<div className="flex items-center space-x-4">
																	<Avatar>
																		<AvatarImage
																			src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.name}`}
																		/>
																		<AvatarFallback>
																			{user.name
																				.split(' ')
																				.map((n) => n[0])
																				.join('')}
																		</AvatarFallback>
																	</Avatar>
																	<div className="flex-grow">
																		<h4 className="font-semibold">
																			{user.name}
																		</h4>
																		<p className="text-sm text-gray-500">
																			{user.department} • {user.location}
																		</p>
																	</div>
																	<Button
																		variant={isAssigned ? 'default' : 'outline'}
																		size="sm"
																		onClick={() => handleAssignUser(user)}
																		disabled={!isEditing}
																	>
																		{isAssigned ? 'Assigned' : 'Assign'}
																	</Button>
																</div>
															</Card>
														);
													})}
												</div>
											</CardContent>
										</Card>

										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-500">
												Showing all users
											</span>
											<div className="flex space-x-2">
												<Button variant="outline" size="sm" disabled>
													Previous
												</Button>
												<Button variant="outline" size="sm" disabled>
													Next
												</Button>
											</div>
										</div>
									</div>
								</TabsContent>
							</Tabs>
						) : (
							<p className="text-muted-foreground">
								Select a stage to view or edit details
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default WorkflowStages;
