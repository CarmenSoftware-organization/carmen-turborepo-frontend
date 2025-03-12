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
	DeliveryPointCreateModel,
	DeliveryPointCreateSchema,
} from '@/dtos/delivery-point.dto';
import { submitDeliveryPoint } from '@/services/delivery_point';

export interface DeliveryPointDialogProps {
	mode: formType;
	defaultValues?: DeliveryPointCreateModel;
	onSuccess: (point: DeliveryPointCreateModel) => void;
}

export const DeliveryPointDialog: React.FC<DeliveryPointDialogProps> = ({
	mode,
	defaultValues,
	onSuccess,
}) => {
	const [open, setOpen] = useState(false);
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [isLoading, setIsLoading] = useState(false);

	const defaultDeliveryPointValues: DeliveryPointCreateModel = {
		name: '',
		is_active: true,
	};

	const form = useForm<DeliveryPointCreateModel>({
		resolver: zodResolver(DeliveryPointCreateSchema),
		defaultValues:
			mode === formType.EDIT && defaultValues
				? { ...defaultValues }
				: defaultDeliveryPointValues,
	});

	useEffect(() => {
		if (mode === formType.EDIT && defaultValues) {
			form.reset({ ...defaultValues });
		} else {
			form.reset({ ...defaultDeliveryPointValues });
		}
	}, [mode, defaultValues, form]);

	const onSubmit = async (data: DeliveryPointCreateModel) => {
		setIsLoading(true);
		try {
			const id = defaultValues?.id || '';
			const result = await submitDeliveryPoint(data, mode, token, tenantId, id);

			const submitData: DeliveryPointCreateModel = {
				id: result.id,
				...data,
			};

			onSuccess(submitData);
			setOpen(false);
			form.reset();
			toastSuccess({
				message: `${m.delivery_point()} ${mode === formType.ADD ? `${m.create_txt()}` : `${m.edit_txt()}`
					} ${m.successfully()}`,
			});
		} catch (err) {
			console.error(`Error ${mode}ing delivery point:`, err);
			toastError({ message: `${m.fail_to_text()} ${mode} delivery point` });
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		form.reset();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen} data-id="delivery-point-dialog">
			<DialogTrigger asChild data-id="delivery-point-trigger">
				<Button
					variant={mode === formType.ADD ? 'default' : 'ghost'}
					size={'sm'}
					data-id="delivery-point-button"
				>
					{mode === formType.ADD ? (
						<>
							<PlusIcon className="h-4 w-4" />
							{m.add_text()} {m.delivery_point()}
						</>
					) : (
						<PencilIcon
							className="w-4 h-4"
							data-id="delivery-point-pencil-icon"
						/>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="w-full md:w-[500px] rounded-lg"
				data-id="delivery-point-dialog-content"
			>
				<DialogHeader data-id="delivery-point-dialog-header">
					<DialogTitle data-id="delivery-point-dialog-title">
						{mode === formType.ADD
							? `${m.create_new_delvery_point()}`
							: `${m.edit_delivery_point()}`}
					</DialogTitle>
				</DialogHeader>
				<Form {...form} data-id="delivery-point-form">
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-id="delivery-point-form-submit"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem data-id="delivery-point-form-item">
									<FormLabel data-id="delivery-point-form-label">
										{m.delivery_point_name_label()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={m.placeholder_delivery_point_name()}
											error={!!form.formState.errors.name}
											{...field}
											data-id="delivery-point-form-input"
										/>
									</FormControl>
									<FormMessage data-id="delivery-point-form-message" />
								</FormItem>
							)}
							required
						/>
						<FormField
							control={form.control}
							name="is_active"
							data-id="delivery-point-form-active-field"
							render={({ field }) => (
								<FormItem
									className="flex-between rounded-lg border p-4"
									data-id="delivery-point-form-active-item"
								>
									<div
										className="space-y-0.5"
										data-id="delivery-point-form-active-label-container"
									>
										<FormLabel
											className="text-base"
											data-id="delivery-point-form-active-label"
										>
											{m.status_active_text()}
										</FormLabel>
									</div>
									<FormControl data-id="delivery-point-form-active-control">
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											data-id="delivery-point-form-active-switch"
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
