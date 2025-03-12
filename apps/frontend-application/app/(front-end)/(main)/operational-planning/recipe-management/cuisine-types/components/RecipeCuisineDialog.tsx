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
	RecipeCuisineCreateModel,
	RecipeCuisineCreateSchema,
} from '@/dtos/cuisine-types.dto';

export interface RecipeCuisineDialogProps {
	mode: formType;
	defaultValues?: RecipeCuisineCreateModel;
	onSuccess: (cuisine: RecipeCuisineCreateModel) => void;
}
const RecipeCuisineDialog: React.FC<RecipeCuisineDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);

	const defaultRecipeCuisineValues: RecipeCuisineCreateModel = {
		name: '',
		code: '',
		description: null,
		region: null,
		status: 'active',
		sortOrder: 0,
		recipeCount: 0,
		activeRecipeCount: 0,
		popularDishes: [],
		keyIngredients: [],
	};

	const form = useForm<RecipeCuisineCreateModel>({
		resolver: zodResolver(RecipeCuisineCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? { ...defaultValues }
				: defaultRecipeCuisineValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({ ...defaultValues });
		} else {
			form.reset({ ...defaultRecipeCuisineValues });
		}
	}, [mode, defaultValues, form]);

	const onSubmit = async (data: RecipeCuisineCreateModel) => {
		setIsLoading(true);
		try {
			const id = defaultValues?.id || '';
			console.log(data, mode, token, tenantId, id);
			const submitData: RecipeCuisineCreateModel = {
				// id: result.id,
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
			console.error(`Error ${mode}ing recipe cuisine:`, err);
			toastError({ message: `${m.fail_to_text()} ${mode} recipe cuisine` });
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} data-id="recipe-cuisine-dialog">
			<DialogTrigger asChild data-id="recipe-cuisine-dialog-trigger">
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					data-id="recipe-cuisine-button"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon className="h-4 w-4" />
							{m.add_text()} {m.recipe_cuisine_types()}
						</>
					) : (
						<PencilIcon
							className="w-4 h-4"
							data-id="recipe-cuisine-pencil-icon"
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="w-full md:w-[500px] rounded-lg"
				data-id="recipe-cuisine-dialog-content"
			>
				<DialogHeader data-id="recipe-cuisine-dialog-header">
					<DialogTitle data-id="recipe-cuisine-dialog-title">
						{mode === formType.ADD
							? 'Create New Recipe Cuisine'
							: 'Edit Recipe Cuisine'}
					</DialogTitle>
				</DialogHeader>
				<Form {...form} data-id="recipe-cuisine-form">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-id="recipe-cuisine-form-submit"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem data-id="recipe-cuisine-form-item">
									<FormLabel data-id="recipe-cuisine-form-label">
										Name
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder="Enter cuisine name"
											error={!!form.formState.errors.name}
											{...field}
											data-id="recipe-cuisine-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-cuisine-form-message" />
								</FormItem>
							)}
							required
						/>

						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem data-id="recipe-cuisine-form-item">
									<FormLabel data-id="recipe-cuisine-form-label">
										{m.code_label()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.code_label()}
											error={!!form.formState.errors.code}
											{...field}
											data-id="recipe-cuisine-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-cuisine-form-message" />
								</FormItem>
							)}
							required
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem data-id="recipe-cuisine-form-item">
									<FormLabel data-id="recipe-cuisine-form-label">
										{m.description()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.description()}
											error={!!form.formState.errors.description}
											{...field}
											data-id="recipe-cuisine-form-input"
										/>
									</FormControl>
									<FormMessage data-id="recipe-cuisine-form-message" />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="status"
							render={({ field }) => (
								<FormItem
									className="flex-between rounded-lg border p-4"
									data-id="recipe-cuisine-form-status-item"
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
											data-id="recipe-cuisine-form-status-switch"
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

export default RecipeCuisineDialog;
