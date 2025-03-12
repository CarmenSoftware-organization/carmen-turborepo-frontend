'use client';

import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PencilIcon, Trash, Save, X } from 'lucide-react';
import { useRouter } from '@/lib/i18n';
import { useAuth } from '@/app/context/AuthContext';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import VendorInfo from './sections/VendorInfo';
import AddressesSection from './sections/AddressesSection';
import ContactsSection from './sections/ContactsSection';
import CertificationsSection from './sections/CertificationsSection';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import SkeltonVendorDetail from '@/components/ui-custom/Loading/SkeltonVendorDetail';
import * as m from '@/paraglide/messages.js';
import { VendorCreateModel, VendorCreateSchema } from '@/dtos/vendor.dto';
import { formType } from '@/constants/enums';
import { handleDelete, handleSubmit } from '@/services/vendor';
interface Props {
	vendor: VendorCreateModel | null;
	mode: formType;
}

const VendorDetails: React.FC<Props> = ({ vendor, mode }) => {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);

	const form = useForm<VendorCreateModel>({
		resolver: zodResolver(VendorCreateSchema),
		defaultValues:
			mode === formType.EDIT && vendor
				? { ...vendor }
				: { name: '', description: '', is_active: true },
	});

	useEffect(() => {
		if (mode === formType.EDIT && vendor) {
			form.reset({ ...vendor });
		} else if (mode === formType.ADD) {
			form.reset({ name: '', description: '', is_active: true });
		}
	}, [mode, vendor, form]);

	const handleEdit = () => {
		setIsEditing(true);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		if (vendor) {
			form.reset({ ...vendor });
		}
	};

	const onSubmit = async (values: VendorCreateModel) => {
		try {
			const submissionValues = {
				...values,
				description: values.description || '',
				is_active: values.is_active ?? true,
			};
			const result = await handleSubmit(
				submissionValues,
				token,
				tenantId,
				mode
			);
			if (result) {
				form.reset();
				toastSuccess({
					message:
						mode === formType.ADD
							? 'Vendor created successfully'
							: 'Vendor updated successfully',
				});

				if (mode === formType.ADD && result.id) {
					router.replace(`/vendor-management/vendors/${result.id}`);
					setIsEditing(true);
				}
			}
		} catch (error) {
			console.error('Error saving vendor:', error);
			toastError({ message: 'Failed to save vendor' });
		}
	};

	const onDelete = async (id: string) => {
		const success = await handleDelete(id, token, tenantId);
		if (success) {
			toastSuccess({ message: 'Vendor deleted successfully' });
			router.push('/vendor-management/vendors');
		} else {
			toastError({ message: 'Failed to delete vendor' });
		}
	};

	if (!vendor && mode === formType.EDIT) return <SkeltonVendorDetail />;

	const isInputDisabled = mode === formType.EDIT && !isEditing;

	const title = (
		<h1 className="text-2xl font-bold text-center md:text-left">
			{mode === formType.ADD ? 'Create New Vendor' : vendor?.name}
		</h1>
	);

	const actionsButton = (
		<div className="flex justify-center">
			{mode === formType.EDIT ? (
				isEditing ? (
					<>
						<Button
							variant="default"
							onClick={form.handleSubmit(onSubmit)}
							size={'sm'}
						>
							<Save className="h-4 w-4" />
							{m.save_text()}
						</Button>
						<Button variant="outline" onClick={handleCancelEdit} size={'sm'}>
							<X className="h-4 w-4" />
							{m.cancel_text()}
						</Button>
					</>
				) : (
					<>
						<Button size={'sm'} variant={'ghost'} onClick={handleEdit}>
							<PencilIcon />
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button size={'sm'} variant={'ghost'}>
									<Trash />
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>{m.are_you_sure()}</AlertDialogTitle>
									<AlertDialogDescription>
										{m.delete_dialog_des()}
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>{m.cancel_text()}</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => vendor?.id && onDelete(vendor.id)}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										{m.delete_text()}
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</>
				)
			) : (
				<Button onClick={form.handleSubmit(onSubmit)} size={'sm'}>
					<Save />
					{m.save_text()}
				</Button>
			)}
		</div>
	);

	return (
		<div className="container p-6 space-y-6">
			<Card className="flex flex-col md:flex-row justify-center md:justify-between p-4">
				{title}
				{actionsButton}
			</Card>
			<Card className="p-4 space-y-4">
				<h1 className="text-base font-bold">{m.infomation()}</h1>
				<VendorInfo
					form={form}
					isInputDisabled={isInputDisabled}
					onSubmit={onSubmit}
				/>
			</Card>

			<Card className="p-4">
				<AddressesSection isEdit={isEditing} />
			</Card>

			<Card className="p-4">
				<ContactsSection isEdit={isEditing} />
			</Card>

			<Card className="p-4">
				<CertificationsSection isEdit={isEditing} />
			</Card>
		</div>
	);
};

export default VendorDetails