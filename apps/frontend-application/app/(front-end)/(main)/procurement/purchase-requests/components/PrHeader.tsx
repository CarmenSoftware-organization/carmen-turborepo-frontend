'use client';

import React from 'react';
import { Control } from 'react-hook-form';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PurchaseRequestData } from './PrDetail';
import { Card } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface PrHeaderProps {
	control: Control<PurchaseRequestData>;
	isCreate: boolean;
	isViewMode: boolean;
	isReadOnly: boolean;
}

const PrHeader: React.FC<PrHeaderProps> = ({
	control,
	isCreate,
	isViewMode,
	isReadOnly,
}) => {
	// Array of PR types for the dropdown
	const prTypes = ['General Purchase', 'Market List', 'Asset Purchase'];

	return (
		<Card className="p-3">
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
				{!isCreate && (
					<FormField
						control={control}
						name="id"
						render={({ field }) => (
							<FormItem>
								<FormLabel>PR ID</FormLabel>
								<FormControl>
									<Input
										{...field}
										readOnly
										aria-readonly="true"
										disabled={isViewMode}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={control}
					name="type"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Type</FormLabel>
							<FormControl>
								{isReadOnly ? (
									<Input
										{...field}
										readOnly={isReadOnly}
										aria-readonly={isReadOnly ? 'true' : 'false'}
										disabled={isViewMode}
									/>
								) : (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
										disabled={isViewMode}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select PR Type" />
										</SelectTrigger>
										<SelectContent>
											{prTypes.map((type) => (
												<SelectItem key={type} value={type}>
													{type}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="requestor"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Requestor</FormLabel>
							<FormControl>
								<Input
									{...field}
									readOnly={isReadOnly}
									aria-readonly={isReadOnly ? 'true' : 'false'}
									disabled={isViewMode}
									value={
										typeof field.value === 'object'
											? field.value.name
											: field.value
									}
									onChange={(e) => {
										if (typeof field.value === 'object') {
											field.onChange({ ...field.value, name: e.target.value });
										} else {
											field.onChange(e.target.value);
										}
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={control}
					name="department"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Department</FormLabel>
							<FormControl>
								<Input
									{...field}
									readOnly={isReadOnly}
									aria-readonly={isReadOnly ? 'true' : 'false'}
									disabled={isViewMode}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!isCreate && (
					<FormField
						control={control}
						name="date"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Date</FormLabel>
								<FormControl>
									<Input
										{...field}
										readOnly
										aria-readonly="true"
										disabled={isViewMode}
										value={
											typeof field.value === 'object' && field.value !== null
												? field.value instanceof Date
													? field.value.toLocaleDateString()
													: String(field.value)
												: field.value
										}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				{!isCreate && (
					<FormField
						control={control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<FormControl>
									<Input
										{...field}
										readOnly
										aria-readonly="true"
										disabled={isViewMode}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={control}
					name="totalAmount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<Input
									{...field}
									type={isReadOnly ? 'text' : 'number'}
									step="0.01"
									readOnly={isReadOnly}
									aria-readonly={isReadOnly ? 'true' : 'false'}
									value={
										isReadOnly
											? `$${Number(field.value).toFixed(2)}`
											: field.value
									}
									onChange={isReadOnly ? undefined : field.onChange}
									disabled={isViewMode}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{!isCreate && (
					<FormField
						control={control}
						name="currentWorkflowStage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Current Stage</FormLabel>
								<FormControl>
									<Input
										{...field}
										readOnly
										aria-readonly="true"
										disabled={isViewMode}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}

				<FormField
					control={control}
					name="description"
					render={({ field }) => (
						<FormItem className="col-span-1 md:col-span-2">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									readOnly={isReadOnly}
									aria-readonly={isReadOnly ? 'true' : 'false'}
									className="min-h-[100px]"
									disabled={isViewMode}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</Card>
	);
};

export default PrHeader;
