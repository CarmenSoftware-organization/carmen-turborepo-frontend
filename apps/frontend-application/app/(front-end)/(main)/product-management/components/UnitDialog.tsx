'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/app/context/AuthContext';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import { Switch } from '@/components/ui/switch';
import { PencilIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import { LoaderButton } from '@/components/ui-custom/button/LoaderButton';
import { Textarea } from '@/components/ui/textarea';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import * as m from '@/paraglide/messages.js';
import { UnitCreateModel, UnitCreateSchema } from '@/dtos/unit.dto';
import { formType } from '@/constants/enums';
import { submitUnit } from '@/services/unit';

interface UnitDialogProps {
	mode: formType;
	defaultValues?: UnitCreateModel;
	onSuccess: (values: UnitCreateModel) => void;
}

const UnitDialog: React.FC<UnitDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);

	const defaultUnitValues: UnitCreateModel = {
		name: '',
		description: '',
		is_active: true,
	};

	const form = useForm<UnitCreateModel>({
		resolver: zodResolver(UnitCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? { ...defaultValues }
				: defaultUnitValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({ ...defaultValues });
		} else {
			form.reset({ ...defaultUnitValues });
		}
	}, [mode, defaultValues, form]);

	const onSubmit = async (values: UnitCreateModel) => {
		setIsLoading(true);
		try {
			const url = defaultValues?.id || '';
			const result = await submitUnit(
				{
					...values,
					description: values.description || '',
					is_active: values.is_active ?? true,
				},
				mode,
				token,
				tenantId,
				url
			);

			const data: UnitCreateModel = {
				id: result.id,
				...values,
			};

			if (result) {
				onSuccess(data);
				setOpen(false);
				form.reset();
				toastSuccess({ message: `${m.add_unit_success_msg()}` });
			} else {
				toastError({ message: `${m.fail_to_text()} ${mode} ${m.unit()}` });
			}
		} catch (error) {
			toastError({
				message: error instanceof Error ? error.message : String(error),
			});
		} finally {
			setIsLoading(false);
		}
	};
	const handleClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} data-id="unit-dialog">
			<DialogTrigger asChild>
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					data-id="unit-dialog-trigger"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon
								className="h-4 w-4"
								data-id="unit-dialog-trigger-icon"
							/>
							{m.add_unit()}
						</>
					) : (
						<PencilIcon
							className="w-4 h-4"
							data-id="unit-dialog-trigger-icon"
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent data-id="unit-dialog-content">
				<DialogHeader data-id="unit-dialog-header">
					<DialogTitle data-id="unit-dialog-title">
						{mode === formType.ADD ? `${m.create_txt()}` : `${m.edit_txt()}`}
						{m.unit()}
					</DialogTitle>
				</DialogHeader>
				<Form {...form} data-id="unit-dialog-form">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-id="unit-dialog-form-submit"
					>
						<FormField
							control={form.control}
							name="name"
							data-id="unit-dialog-form-name"
							render={({ field }) => (
								<FormItem data-id="unit-dialog-form-name-item">
									<FormLabel data-id="unit-dialog-form-name-label">
										{m.unit_name_label()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.placeholder_unit_name()}
											error={!!form.formState.errors.name}
											{...field}
											data-id="unit-dialog-form-name-input"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="description"
							data-id="unit-dialog-form-description"
							render={({ field }) => (
								<FormItem data-id="unit-dialog-form-description-item">
									<FormLabel data-id="unit-dialog-form-description-label">
										{m.unit_des_label()}
									</FormLabel>
									<FormControl>
										<Textarea
											placeholder={m.placeholder_unit_des()}
											{...field}
											data-id="unit-dialog-form-description-textarea"
										/>
									</FormControl>
									<FormMessage data-id="unit-dialog-form-description-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="is_active"
							data-id="unit-dialog-form-is-active"
							render={({ field }) => (
								<FormItem
									className="flex-between rounded-lg border p-4"
									data-id="unit-dialog-form-is-active-item"
								>
									<FormLabel
										className="text-base"
										data-id="unit-dialog-form-is-active-label"
									>
										{m.status_active_text()}
									</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											data-id="unit-dialog-form-is-active-switch"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<DialogFooter data-id="unit-dialog-footer">
							<div
								className="flex-end gap-2"
								data-id="unit-dialog-footer-button-container"
							>
								<Button
									type="button"
									variant={'outline'}
									onClick={handleClose}
									size={'sm'}
									data-id="unit-dialog-footer-cancel-button"
								>
									{m.cancel_text()}
								</Button>
								<LoaderButton
									type="submit"
									disabled={isLoading}
									isLoading={isLoading}
									size={'sm'}
									data-id="unit-dialog-footer-submit-button"
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

export default UnitDialog;
