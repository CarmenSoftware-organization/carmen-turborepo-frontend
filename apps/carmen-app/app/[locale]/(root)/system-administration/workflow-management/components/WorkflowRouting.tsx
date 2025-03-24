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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { WorkflowCreateModel } from '@/dtos/workflows.dto';

interface WorkflowRoutingProps {
	form: UseFormReturn<WorkflowCreateModel>;
	control: Control<WorkflowCreateModel>;
	stagesName: string[];
	isEditing: boolean;
}

const WorkflowRouting = ({
	form,
	control,
	stagesName,
	isEditing,
}: WorkflowRoutingProps) => {
	const { fields, append, remove } = useFieldArray({
		name: 'data.routing_rules',
		control: control,
	});
	const rules = form.getValues().data?.routing_rules || [];
	const [selectedRuleName, setSelectedRuleName] = useState<string | null>(null);
	const selectedRule = rules.find((rule) => rule.name === selectedRuleName);

	const handleRuleSelect = (ruleName: string) => {
		setSelectedRuleName(ruleName);
	};

	const handleAddRule = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();

		append({
			name: `rule ${rules.length + 1}`,
			description: '',
			triggerStage: stagesName[0] || '',
			condition: { field: '', operator: 'eq', value: '' },
			action: { type: 'NEXT_STAGE', target_stage: '' },
		});

		setSelectedRuleName(`rule ${rules.length + 1}`);
	};

	const handleDeleteRule = (ruleName: string) => {
		const index = form
			.getValues()
			.data?.routing_rules.findIndex((rule) => rule.name === ruleName);
		remove(index);
	};

	return (
		<div className="grid grid-cols-3 gap-6">
			<Card className="col-span-1">
				<CardHeader>
					<CardTitle>Routing Rules</CardTitle>
				</CardHeader>
				<CardContent>
					<ul className="space-y-2">
						{rules.map((rule) => (
							<li
								key={rule.name}
								className={`p-2 rounded-md cursor-pointer ${selectedRuleName === rule.name
										? 'bg-secondary'
										: 'hover:bg-secondary/50'
									}`}
								onClick={() => handleRuleSelect(rule.name)}
							>
								{rule.name || 'Unnamed Rule'}
							</li>
						))}
					</ul>
					{isEditing && (
						<Button className="w-full mt-4" onClick={handleAddRule}>
							<Plus className="mr-2 h-4 w-4" /> Add Rule
						</Button>
					)}
				</CardContent>
			</Card>

			<Card className="col-span-2">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle>Rule Details</CardTitle>

					{selectedRule && isEditing && (
						<div className="flex space-x-2">
							{rules.length > 1 && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => handleDeleteRule(selectedRuleName || '')}
								>
									<Trash2 className="h-4 w-4 mr-2" />
									Delete Rule
								</Button>
							)}
						</div>
					)}
				</CardHeader>
				<CardContent>
					{selectedRule ? (
						<div className="space-y-4">
							{fields.map((field, index) => (
								<div key={field.id}>
									{field.name === selectedRuleName && (
										<>
											<Form.FormField
												control={control}
												name={`data.routing_rules.${index}.name`}
												render={({ field }) => (
													<Form.FormItem>
														<Form.FormLabel>Rule Name</Form.FormLabel>
														<Form.FormControl>
															<Input
																{...field}
																placeholder="Enter rule name"
																disabled={!isEditing}
															/>
														</Form.FormControl>
														<Form.FormMessage />
													</Form.FormItem>
												)}
											/>
											<Form.FormField
												control={control}
												name={`data.routing_rules.${index}.description`}
												render={({ field }) => (
													<Form.FormItem>
														<Form.FormLabel>Description</Form.FormLabel>
														<Form.FormControl>
															<Textarea
																{...field}
																placeholder="Enter rule description"
																disabled={!isEditing}
															/>
														</Form.FormControl>
														<Form.FormMessage />
													</Form.FormItem>
												)}
											/>
											<Form.FormField
												control={control}
												name={`data.routing_rules.${index}.triggerStage`}
												render={({ field }) => (
													<Form.FormItem>
														<Form.FormLabel>Trigger Stage</Form.FormLabel>
														<Select
															onValueChange={field.onChange}
															defaultValue={field.value}
															disabled={!isEditing}
														>
															<Form.FormControl>
																<SelectTrigger id="triggerStage">
																	<SelectValue placeholder="Select Trigger Stage" />
																</SelectTrigger>
															</Form.FormControl>
															<SelectContent>
																{stagesName.map((stage) => (
																	<SelectItem key={stage} value={stage}>
																		{stage}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<Form.FormMessage />
													</Form.FormItem>
												)}
											/>
											<div>
												<Label>Condition</Label>
												<div className="flex flex-col space-y-2 mt-2">
													<Form.FormField
														control={control}
														name={`data.routing_rules.${index}.condition.field`}
														render={({ field }) => (
															<Form.FormItem>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	disabled={!isEditing}
																>
																	<Form.FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select field" />
																		</SelectTrigger>
																	</Form.FormControl>
																	<SelectContent>
																		<SelectItem value="amount">
																			Amount
																		</SelectItem>
																		<SelectItem value="department">
																			Department
																		</SelectItem>
																		<SelectItem value="category">
																			Category
																		</SelectItem>
																	</SelectContent>
																</Select>
																<Form.FormMessage />
															</Form.FormItem>
														)}
													/>
													<Form.FormField
														control={control}
														name={`data.routing_rules.${index}.condition.operator`}
														render={({ field }) => (
															<Form.FormItem>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	disabled={!isEditing}
																>
																	<Form.FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select operator" />
																		</SelectTrigger>
																	</Form.FormControl>
																	<SelectContent>
																		<SelectItem value="eq">Equals</SelectItem>
																		<SelectItem value="gt">
																			Greater than
																		</SelectItem>
																		<SelectItem value="lt">
																			Less than
																		</SelectItem>
																		<SelectItem value="gte">
																			Greater than or equal
																		</SelectItem>
																		<SelectItem value="lte">
																			Less than or equal
																		</SelectItem>
																	</SelectContent>
																</Select>
																<Form.FormMessage />
															</Form.FormItem>
														)}
													/>
													<Form.FormField
														control={control}
														name={`data.routing_rules.${index}.condition.value`}
														render={({ field }) => (
															<Form.FormItem>
																<Form.FormControl>
																	<Input
																		{...field}
																		placeholder="Enter value"
																		disabled={!isEditing}
																	/>
																</Form.FormControl>
																<Form.FormMessage />
															</Form.FormItem>
														)}
													/>
												</div>
											</div>
											<div>
												<Label>Action</Label>
												<div className="space-y-2 mt-2">
													<Form.FormField
														control={control}
														name={`data.routing_rules.${index}.action.type`}
														render={({ field }) => (
															<Form.FormItem>
																<Select
																	onValueChange={field.onChange}
																	defaultValue={field.value}
																	disabled={!isEditing}
																>
																	<Form.FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select type" />
																		</SelectTrigger>
																	</Form.FormControl>
																	<SelectContent>
																		<SelectItem value="SKIP_STAGE">
																			Skip Stage
																		</SelectItem>
																		<SelectItem value="NEXT_STAGE">
																			Next Stage
																		</SelectItem>
																	</SelectContent>
																</Select>
																<Form.FormMessage />
															</Form.FormItem>
														)}
													/>
													<Form.FormField
														control={control}
														name={`data.routing_rules.${index}.action.target_stage`}
														render={({ field }) => (
															<Form.FormItem>
																<Select
																	onValueChange={field.onChange}
																	disabled={!isEditing}
																>
																	<Form.FormControl>
																		<SelectTrigger>
																			<SelectValue placeholder="Select target stage" />
																		</SelectTrigger>
																	</Form.FormControl>
																	<SelectContent>
																		{stagesName.map((stage) => (
																			<SelectItem key={stage} value={stage}>
																				{stage}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
																<Form.FormMessage />
															</Form.FormItem>
														)}
													/>
												</div>
											</div>
										</>
									)}
								</div>
							))}
						</div>
					) : (
						<p className="text-muted-foreground">
							Select a rule to view or edit details
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default WorkflowRouting;
