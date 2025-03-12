'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import { Switch } from '@/components/ui/switch';
import { zodResolver } from '@hookform/resolvers/zod';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/app/context/AuthContext';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { formType } from '@/constants/enums';
import * as m from '@/paraglide/messages.js';
import {
	RecipeCategoryCreateModel,
	RecipeCategoryCreateSchema,
} from '@/dtos/recipe-category.dto';

export interface RecipeCategoryDialogProps {
	mode: formType;
	defaultValues?: RecipeCategoryCreateModel;
	onSuccess: (category: RecipeCategoryCreateModel) => void;
}

const RecipeCategoryDialog: React.FC<RecipeCategoryDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);

	const defaultRecipeCategoryValues: RecipeCategoryCreateModel = {
		name: '',
		code: '',
		description: null,
		parentId: null,
		level: 0,
		status: 'active',
		sortOrder: 0,
		recipeCount: 0,
		activeRecipeCount: 0,
		averageCost: 0,
		averageMargin: 0,
		lastUpdated: '',
		defaultCostSettings: {
			laborCostPercentage: 0,
			overheadPercentage: 0,
			targetFoodCostPercentage: 0,
		},
		defaultMargins: {
			minimumMargin: 0,
			targetMargin: 0,
		},
	};

	const form = useForm<RecipeCategoryCreateModel>({
		resolver: zodResolver(RecipeCategoryCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? { ...defaultValues }
				: defaultRecipeCategoryValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({ ...defaultValues });
		} else {
			form.reset({ ...defaultRecipeCategoryValues });
		}
	}, [mode, defaultValues, form]);

	const onSubmit = async (data: RecipeCategoryCreateModel) => {
		setIsLoading(true);
		try {
			const id = defaultValues?.id || '';
			console.log(data, mode, token, tenantId, id);
			const submitData: RecipeCategoryCreateModel = {
				...data,
			};
			onSuccess(submitData);
			setOpen(false);
			form.reset();
			toastSuccess({
				message: `${m.delivery_point()} ${
					mode === formType.ADD ? `${m.create_txt()}` : `${m.edit_txt()}`
				} ${m.successfully()}`,
			});
		} catch (err) {
			console.error(`Error ${mode}ing recipe category:`, err);
			toastError({ message: `${m.fail_to_text()} ${mode} recipe category` });
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} data-id="recipe-category-dialog">
			<DialogTrigger asChild data-id="recipe-category-dialog-trigger">
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					data-id="recipe-category-button"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon className="h-4 w-4" />
							{m.add_text()}
						</>
					) : (
						<PencilIcon
							className="w-4 h-4"
							data-id="recipe-category-pencil-icon"
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="w-full md:w-[500px] rounded-lg"
				data-id="recipe-category-dialog-content"
			>
				<DialogHeader data-id="recipe-category-dialog-header">
					<DialogTitle data-id="recipe-category-dialog-title">
						{mode === formType.ADD
							? 'Create New Recipe Category'
							: 'Edit Recipe Category'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form} data-id="recipe-category-form">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-id="recipe-category-form-submit"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem data-id="recipe-category-form-item">
									<FormLabel data-id="recipe-category-form-label">
										Name
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder="Enter category name"
											error={!!form.formState.errors.name}
											{...field}
											data-id="recipe-category-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-category-form-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem data-id="recipe-category-form-item">
									<FormLabel data-id="recipe-category-form-label">
										{m.code_label()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.code_label()}
											error={!!form.formState.errors.code}
											{...field}
											data-id="recipe-category-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-category-form-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem data-id="recipe-category-form-item">
									<FormLabel data-id="recipe-category-form-label">
										{m.description()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.description()}
											error={!!form.formState.errors.description}
											{...field}
											data-id="recipe-category-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-category-form-message" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem
									className="flex-between rounded-lg border p-4"
									data-id="recipe-category-form-status-item"
								>
									<div className="space-y-0.5">
										<FormLabel className="text-base">
											{m.status_active_text()}
										</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value === 'active'}
											onCheckedChange={(checked) =>
												field.onChange(checked ? 'active' : 'inactive')
											}
											data-id="recipe-category-form-status-switch"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter data-id="delivery-point-dialog-footer">
							<div
								className="flex-end gap-2"
								data-id="delivery-point-dialog-footer-container"
							>
								<Button
									type="button"
									variant={'outline'}
									onClick={handleClose}
									size={'sm'}
									data-id="delivery-point-dialog-footer-cancel-button"
								>
									{m.cancel_text()}
								</Button>
								<LoaderButton
									type="submit"
									disabled={isLoading}
									isLoading={isLoading}
									size={'sm'}
									data-id="delivery-point-dialog-footer-submit-button"
								>
									{isLoading
										? `${m.saving()}...`
										: mode === formType.EDIT
											? `${m.save_change_text()}`
											: `${m.add_text()}`}
								</LoaderButton>
							</div>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default RecipeCategoryDialog;
