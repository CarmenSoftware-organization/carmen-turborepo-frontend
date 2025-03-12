'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { formType } from '@/constants/enums';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import PrHeader from './PrHeader';
import { Button } from '@/components/ui/button';
import { FileDown, Pencil, Printer, Save, Upload, X } from 'lucide-react';
import { print_text } from '@/paraglide/messages';
import { export_text } from '@/paraglide/messages';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import PrItem from './tabs/PrItem';
import PrBudget from './tabs/PrBudget';
import PrWorkFlow from './tabs/PrWorkFlow';
import PrAttachment from './tabs/PrAttachment';
import PrActivity from './tabs/PrActivity';

const requestorSchema = z.object({
	id: z.string(),
	name: z.string(),
	department: z.string(),
});

const purchaseRequestSchema = z
	.object({
		id: z.string().optional(),
		refNumber: z.string().optional(),
		type: z.string().min(1, { message: 'Type is required' }),
		description: z.string().min(1, { message: 'Description is required' }),
		requestor: z.union([
			z.string().min(1, { message: 'Requestor is required' }),
			requestorSchema,
		]),
		requestorId: z.string().optional(),
		department: z.string().min(1, { message: 'Department is required' }),
		date: z.union([z.string(), z.date()]).optional(),
		status: z.string().optional(),
		workflowStatus: z.string().optional(),
		location: z.string().optional(),
		jobCode: z.string().optional(),
		estimatedTotal: z.number().optional(),
		vendor: z.string().optional(),
		vendorId: z.union([z.string(), z.number()]).optional(),
		deliveryDate: z.union([z.string(), z.date()]).optional(),
		currency: z.string().optional(),
		baseCurrencyCode: z.string().optional(),
		baseSubTotalPrice: z.number().optional(),
		subTotalPrice: z.number().optional(),
		baseNetAmount: z.number().optional(),
		netAmount: z.number().optional(),
		baseDiscAmount: z.number().optional(),
		discountAmount: z.number().optional(),
		baseTaxAmount: z.number().optional(),
		taxAmount: z.number().optional(),
		baseTotalAmount: z.number().optional(),

		// Original fields
		amount: z.coerce
			.number()
			.min(0, { message: 'Amount must be a positive number' })
			.optional(),
		currentStage: z.string().optional(),

		// API compatibility fields
		totalAmount: z.coerce
			.number()
			.min(0, { message: 'Amount must be a positive number' })
			.optional(),
		currentWorkflowStage: z.string().optional(),
	})
	.transform((data) => {
		// Ensure both old and new field names work
		return {
			...data,
			amount: data.amount || data.totalAmount || 0,
			totalAmount: data.totalAmount || data.amount || 0,
			currentStage: data.currentStage || data.currentWorkflowStage || '',
			currentWorkflowStage:
				data.currentWorkflowStage || data.currentStage || '',
		};
	});

export type PurchaseRequestData = z.infer<typeof purchaseRequestSchema>;

// Change from const enum to regular enum
enum TAB_PR {
	ITEM = 'item',
	BUDGET = 'budget',
	WORKFLOW = 'workflow',
	ATTACHMENT = 'attachment',
	ACTIVITY = 'activity',
}

interface PrDetailProps {
	prData?: PurchaseRequestData | null;
	'data-id'?: string;
	formType: formType;
}

const PrDetail: React.FC<PrDetailProps> = ({
	prData,
	'data-id': dataId,
	formType: initialFormType,
}) => {
	console.log(prData);
	// Add state to track current form type
	const [currentFormType, setCurrentFormType] =
		useState<formType>(initialFormType);

	// Add state to track submission status
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Add state to store the updated data after submission
	const [updatedData, setUpdatedData] = useState<PurchaseRequestData | null>(
		prData || null
	);

	// Use the most up-to-date data for display
	const displayData = updatedData || prData;

	// Use the current form type for all checks
	const isReadOnly = currentFormType === formType.VIEW;
	const isCreate = currentFormType === formType.ADD;
	const isViewMode = currentFormType === formType.VIEW;
	const isEditMode = currentFormType === formType.EDIT;

	const form = useForm<PurchaseRequestData>({
		resolver: zodResolver(purchaseRequestSchema),
		defaultValues: displayData
			? {
					...displayData,
					date: displayData.date
						? format(new Date(displayData.date), 'yyyy-MM-dd')
						: '',
				}
			: {
					id: '',
					type: '',
					description: '',
					requestor: '',
					department: '',
					date: '',
					status: isCreate ? 'Draft' : '',
					amount: 0,
					currentStage: isCreate ? 'Initial' : '',
				},
		mode: 'onChange',
	});

	// Get form state to track validity
	const { isValid, isDirty } = form.formState;

	useEffect(() => {
		if (displayData) {
			form.reset({
				...displayData,
				date: displayData.date
					? format(new Date(displayData.date), 'yyyy-MM-dd')
					: '',
			});
		}
	}, [displayData, form]);

	const handleEditMode = () => {
		setCurrentFormType(formType.EDIT);
	};

	const handleCancelEdit = () => {
		if (prData) {
			form.reset({
				...prData,
				date: prData.date ? format(new Date(prData.date), 'yyyy-MM-dd') : '',
			});
		}
		setCurrentFormType(formType.VIEW);
	};

	const handleSubmit = async (data: PurchaseRequestData) => {
		try {
			setIsSubmitting(true);

			console.log('Submitting data:', data);

			setUpdatedData({
				...data,
				status: data.status || (isCreate ? 'Draft' : updatedData?.status || ''),
				currentStage:
					data.currentStage ||
					(isCreate ? 'Initial' : updatedData?.currentStage || ''),
				date: data.date || format(new Date(), 'yyyy-MM-dd'),
			});

			setCurrentFormType(formType.VIEW);
			toastSuccess({
				message: isCreate
					? 'Purchase Request Created'
					: 'Purchase Request Updated',
			});
		} catch (error) {
			console.error('Error submitting form:', error);

			toastError({
				message: `Failed to ${isCreate ? 'create' : 'update'} the purchase request. Please try again.`,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderActionButtons = () => {
		if (isViewMode) {
			return (
				<Button
					variant="outline"
					size="sm"
					onClick={handleEditMode}
					className="ml-auto"
					aria-label="Edit purchase request"
				>
					<Pencil />
					Edit
				</Button>
			);
		}

		if (isEditMode) {
			return (
				<>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCancelEdit}
						disabled={isSubmitting}
						aria-label="Cancel editing"
					>
						<X />
						Cancel
					</Button>

					<Button
						size="sm"
						type="submit"
						disabled={isSubmitting}
						aria-label={
							isCreate ? 'Create purchase request' : 'Update purchase request'
						}
					>
						<Save />
						{isSubmitting ? (
							<span>{isCreate ? 'Creating...' : 'Updating...'}</span>
						) : isCreate ? (
							'Create Purchase Request'
						) : (
							'Update Purchase Request'
						)}
					</Button>
				</>
			);
		}

		if (isCreate) {
			return (
				<Button
					type="submit"
					size="sm"
					disabled={isSubmitting || !(isValid && isDirty)}
					aria-label="Create purchase request"
				>
					<Save />
					{isSubmitting ? 'Creating...' : 'Create Purchase Request'}
				</Button>
			);
		}

		return null;
	};

	return (
		<Card data-id={dataId} className="m-3 p-3">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
					<div className="flex justify-between mb-2">
						<p className="text-lg font-bold">Purchase Request</p>
						<div className="flex flex-row gap-2">
							{renderActionButtons()}
							<Button
								variant="outline"
								size="sm"
								aria-label="Export purchase request"
							>
								<FileDown className="mr-1 h-4 w-4" />
								{export_text()}
							</Button>

							<Button
								variant="outline"
								size="sm"
								aria-label="Print purchase request"
							>
								<Printer className="mr-1 h-4 w-4" />
								{print_text()}
							</Button>

							<Button
								variant="outline"
								size="sm"
								aria-label="Share purchase request"
							>
								<Upload className="mr-1 h-4 w-4" />
								Share
							</Button>
						</div>
					</div>
					<PrHeader
						control={form.control}
						isCreate={isCreate}
						isViewMode={isViewMode}
						isReadOnly={isReadOnly}
					/>

					<Tabs defaultValue={TAB_PR.ITEM} className="w-full">
						<TabsList className="grid w-full grid-cols-5">
							{Object.values(TAB_PR).map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab}
									className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
								>
									{tab.charAt(0).toUpperCase() + tab.slice(1)}
								</TabsTrigger>
							))}
						</TabsList>
						<ScrollArea className="h-[400px] w-full rounded-md border mt-4">
							<TabsContent value={TAB_PR.ITEM}>
								<PrItem mode={currentFormType} />
							</TabsContent>
							<TabsContent value={TAB_PR.BUDGET}>
								<PrBudget />
							</TabsContent>
							<TabsContent value={TAB_PR.WORKFLOW}>
								<PrWorkFlow />
							</TabsContent>
							<TabsContent value={TAB_PR.ATTACHMENT}>
								<PrAttachment />
							</TabsContent>
							<TabsContent value={TAB_PR.ACTIVITY}>
								<PrActivity />
							</TabsContent>
						</ScrollArea>
					</Tabs>
				</form>
			</Form>
		</Card>
	);
};

export default PrDetail;
