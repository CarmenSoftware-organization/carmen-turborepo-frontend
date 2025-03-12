'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { Switch } from '@/components/ui/switch';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import { Textarea } from '@/components/ui/textarea';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { formType } from '@/constants/enums';
import * as m from '@/paraglide/messages.js';
import {
	DepartmentCreateModel,
	DepartmentCreateSchema,
} from '@/dtos/department.dto';
import { submitDepartment } from '@/services/department';

export interface DepartmentDialogProps {
	mode: formType;
	defaultValues?: DepartmentCreateModel;
	onSuccess: (department: DepartmentCreateModel) => void;
}

const DepartmentDialog: React.FC<DepartmentDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const defaultDepartmentValues: DepartmentCreateModel = {
		name: '',
		description: '',
		is_active: true,
	};

	const form = useForm<DepartmentCreateModel>({
		resolver: zodResolver(DepartmentCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? { ...defaultValues }
				: defaultDepartmentValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({ ...defaultValues });
		} else {
			form.reset({ ...defaultDepartmentValues });
		}
	}, [mode, defaultValues, form]);

	const onSubmit = async (data: DepartmentCreateModel) => {
		setIsLoading(true);
		try {
			const id = defaultValues?.id || '';
			const result = await submitDepartment(data, mode, token, tenantId, id);

			if (result) {
				const submitData: DepartmentCreateModel = {
					id: result.id,
					...data,
				};
				onSuccess(submitData);
				setOpen(false);
				form.reset();

				toastSuccess({
					message: `${m.department()} ${mode === formType.ADD ? `${m.create_txt()}` : `${m.edit_txt()}`
						} ${m.successfully()}`,
				});
			} else {
				toastError({ message: `Failed to ${mode} department` });
			}
		} catch (error) {
			console.error(`Error ${mode}ing department:`, error);
			toastError({ message: `${m.fail_to_text()} ${mode} ${m.department()}` });
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} data-id="department-dialog">
			<DialogTrigger asChild data-id="department-dialog-trigger">
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					data-id="department-dialog-button"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon
								className="h-4 w-4"
								data-id="department-dialog-add-icon"
							/>
							{m.add_text()} {m.department()}
						</>
					) : (
						<PencilIcon
							className="w-4 h-4"
							data-id="department-dialog-edit-icon"
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent data-id="department-dialog-content">
				<DialogHeader data-id="department-dialog-header">
					<DialogTitle data-id="department-dialog-title">
						{mode === formType.ADD ? `${m.create_txt()}` : `${m.edit_txt()}`}{' '}
						{m.department()}
					</DialogTitle>
				</DialogHeader>
				<Form {...form} data-id="department-form">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-id="department-form-submit"
					>
						<FormField
							control={form.control}
							name="name"
							data-id="department-form-name-field"
							render={({ field }) => (
								<FormItem data-id="department-form-item">
									<FormLabel data-id="department-form-label">
										{m.department_label_name()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.placeholder_department_name()}
											error={!!form.formState.errors.name}
											{...field}
											data-id="department-form-input"
										/>
									</FormControl>
									<FormMessage data-id="department-form-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="description"
							data-id="department-form-description-field"
							render={({ field }) => (
								<FormItem data-id="department-form-description-item">
									<FormLabel data-id="department-form-description-label">
										{m.description()}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={m.placeholder_enter()}
											{...field}
											data-id="department-form-description-input"
										/>
									</FormControl>
									<FormMessage data-id="department-form-description-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="is_active"
							data-id="department-form-active-field"
							render={({ field }) => (
								<FormItem
									className="flex-between rounded-lg border p-4"
									data-id="department-form-active-item"
								>
									<div
										className="space-y-0.5"
										data-id="department-form-active-label-container"
									>
										<FormLabel
											className="text-base"
											data-id="department-form-active-label"
										>
											{m.status_active_text()}
										</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											data-id="department-form-active-switch"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter data-id="department-dialog-footer">
							<div
								className="flex-end gap-2"
								data-id="department-dialog-footer-container"
							>
								<Button
									type="button"
									variant={'outline'}
									onClick={handleClose}
									size={'sm'}
									data-id="department-dialog-footer-cancel-button"
								>
									{m.cancel_text()}
								</Button>
								<LoaderButton
									type="submit"
									disabled={isLoading}
									isLoading={isLoading}
									size={'sm'}
									data-id="department-dialog-footer-submit-button"
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

export default DepartmentDialog;
