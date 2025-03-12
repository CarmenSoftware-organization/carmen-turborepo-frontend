'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	enum_location_type,
	LocationsModel,
	LocationSchema,
	UserLocationModel,
	LocationState,
	LocationPayload,
	LocationPayloadSchema,
} from '@/dtos/location.dto';
import { Form } from '@/components/ui-custom/FormCustom';
import { useAuth } from '@/app/context/AuthContext';
import LocationsInfo from './LocationsInfo';
import UserTable from './UserTable';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formType } from '@/constants/enums';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { useRouter } from '@/lib/i18n';
import { submitStoreLocation } from '@/services/location';

type Props = {
	defaultValues?: Partial<
		LocationsModel & {
			users: {
				active: UserLocationModel[];
				inactive: UserLocationModel[];
			};
		}
	>;
	type: formType;
};

const enum formWatchedFields {
	name = 'name',
	location_type = 'location_type',
	delivery_point = 'delivery_point',
}

const LocationForm = ({ defaultValues, type }: Props) => {
	const router = useRouter();
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const [isEdit, setIsEdit] = useState(type === formType.ADD ? true : false);

	const [originalValues, setOriginalValues] = useState<LocationState>(
		defaultValues
			? {
				id: defaultValues.id || '',
				name: defaultValues.name || '',
				description: defaultValues.description || '',
				is_active: defaultValues.is_active ?? true,
				location_type:
					(defaultValues.location_type as enum_location_type) ||
					enum_location_type.inventory,
				delivery_point: defaultValues.delivery_point || { id: '', name: '' },
				users: defaultValues.users || { active: [], inactive: [] },
			}
			: {
				id: '',
				name: '',
				description: '',
				is_active: true,
				location_type: enum_location_type.inventory,
				delivery_point: { id: '', name: '' },
				users: { active: [], inactive: [] },
			}
	);

	const [selectedUsersToDelete, setSelectedUsersToDelete] = useState<string[]>(
		[]
	);
	const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<string[]>([]);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const form = useForm<LocationState>({
		resolver: zodResolver(LocationSchema),
		defaultValues: originalValues,
		mode: 'onChange',
	});

	const watchedFields = {
		name: form.watch(formWatchedFields.name),
		locationType: form.watch(formWatchedFields.location_type),
		deliveryPoint: form.watch(formWatchedFields.delivery_point),
	};

	const isFormIncomplete =
		!watchedFields.name ||
		!watchedFields.locationType ||
		!watchedFields.deliveryPoint?.id;

	const onCancel = async () => {
		if (type === formType.ADD) {
			await router.back();
			return;
		}

		form.reset(originalValues);
		setSelectedUsersToDelete([]);
		setSelectedUsersToAdd([]);
		setIsEdit(false);
		setOriginalValues(
			defaultValues
				? {
					id: defaultValues.id || '',
					name: defaultValues.name || '',
					description: defaultValues.description || '',
					is_active: defaultValues.is_active ?? true,
					location_type:
						(defaultValues.location_type as enum_location_type) ||
						enum_location_type.inventory,
					delivery_point: defaultValues.delivery_point || {
						id: '',
						name: '',
					},
					users: defaultValues.users || { active: [], inactive: [] },
				}
				: {
					id: '',
					name: '',
					description: '',
					is_active: true,
					location_type: enum_location_type.inventory,
					delivery_point: { id: '', name: '' },
					users: { active: [], inactive: [] },
				}
		);
	};

	const onSubmit = async (formData: LocationState) => {
		try {
			const payload: LocationPayload = {
				name: formData.name,
				description: formData.description,
				is_active: formData.is_active,
				location_type: formData.location_type,
				deliveryPointId: formData.delivery_point.id,
				user: {
					add: formData.users.active.map((user) => ({
						user_id: user.id,
					})),
					remove: formData.users.inactive.map((user) => ({
						user_id: user.id,
					})),
				},
				...(type === formType.ADD ? {} : { id: formData.id }),
			};

			const validationResult = LocationPayloadSchema.safeParse(payload);
			if (!validationResult.success) {
				console.log(
					'Payload validation failed:',
					validationResult.error.errors
				);
				return;
			}

			const result = await submitStoreLocation(
				payload,
				type,
				token,
				tenantId,
				formData.id
			);

			if (result) {
				const updatedFormData = {
					...formData,
					id: type === formType.ADD ? result.id : formData.id,
				};
				setOriginalValues(updatedFormData);
				form.setValue('id', updatedFormData.id);
				setIsEdit(false);

				if (type === formType.ADD) {
					router.replace(`/configuration/locations/${result.id}`);
				}

				toastSuccess({ message: 'Location submitted successfully' });
			}
		} catch (error) {
			console.error('Submit error:', error);
			toastError({ message: 'Failed to submit location' });
		}
	};

	const handleUserChange = (userId: string) => {
		setSelectedUsersToDelete((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	const handleAddUserChange = (userId: string) => {
		setSelectedUsersToAdd((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId]
		);
	};

	const handleMoveRight = () => {
		const selectedUsers = originalValues.users.inactive.filter((user) =>
			selectedUsersToDelete.includes(user.id)
		);
		const updatedInactiveUsers = originalValues.users.inactive.filter(
			(user) => !selectedUsersToDelete.includes(user.id)
		);
		const updatedActiveUsers = [
			...originalValues.users.active,
			...selectedUsers,
		];
		form.setValue('users.active', updatedActiveUsers, { shouldValidate: true });
		form.setValue('users.inactive', updatedInactiveUsers, {
			shouldValidate: true,
		});

		setOriginalValues((prev) => ({
			...prev,
			users: {
				active: updatedActiveUsers,
				inactive: updatedInactiveUsers,
			},
		}));
		setSelectedUsersToDelete([]);
		setShowDeleteDialog(false);
	};

	const handleMoveLeftConfirm = () => {
		const selectedUsers = originalValues.users.active.filter((user) =>
			selectedUsersToAdd.includes(user.id)
		);
		const updatedActiveUsers = originalValues.users.active.filter(
			(user) => !selectedUsersToAdd.includes(user.id)
		);
		const updatedInactiveUsers = [
			...originalValues.users.inactive,
			...selectedUsers,
		];
		form.setValue('users.active', updatedActiveUsers, { shouldValidate: true });
		form.setValue('users.inactive', updatedInactiveUsers, {
			shouldValidate: true,
		});
		setOriginalValues((prev) => ({
			...prev,
			users: {
				active: updatedActiveUsers,
				inactive: updatedInactiveUsers,
			},
		}));
		setSelectedUsersToAdd([]);
		setShowDeleteDialog(false);
	};

	const handleCheckAll = (
		checked: boolean,
		tableType: 'active' | 'inactive'
	) => {
		if (tableType === 'inactive') {
			if (checked) {
				const allUserIds = originalValues.users.inactive.map((user) => user.id);
				setSelectedUsersToDelete(allUserIds);
			} else {
				setSelectedUsersToDelete([]);
			}
		} else {
			if (checked) {
				const allUserIds = originalValues.users.active.map((user) => user.id);
				setSelectedUsersToAdd(allUserIds);
			} else {
				setSelectedUsersToAdd([]);
			}
		}
	};

	return (
		<Form {...form} data-id="location-form">
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					console.log('Form submit event triggered');
					await onSubmit(form.getValues());
				}}
				data-id="location-form-form"
				className="w-full flex justify-center items-center"
			>
				<div
					className="p-3 flex flex-col space-y-3 w-full lg:max-w-4xl"
					data-id="location-form-div"
				>
					<LocationsInfo
						control={form.control}
						token={token}
						tenantId={tenantId}
						isEdit={isEdit}
						setIsEdit={setIsEdit}
						onCancel={onCancel}
						defaultValues={originalValues}
						isFormIncomplete={isFormIncomplete}
						data-id="location-info"
					/>
					<Card>
						<CardHeader className="p-3">
							<CardTitle className="text-lg font-semibold">
								Assign Users
							</CardTitle>
						</CardHeader>
						<CardContent className="px-3 pt-0 pb-3 flex flex-col lg:flex-row items-center lg:items-start gap-2 w-full">
							<UserTable
								users={originalValues.users.inactive}
								selectedUsers={selectedUsersToDelete}
								isEdit={isEdit}
								onUserChange={handleUserChange}
								title="Available Users"
								data-id="location-form-user-table"
								onCheckAll={(checked) => handleCheckAll(checked, 'inactive')}
							/>
							<div className="flex items-center h-10 lg:h-40">
								<div className="p-2 h-fit">
									<Button
										variant={'outline'}
										type="button"
										size={'sm'}
										onClick={(e) => {
											e.preventDefault();
											handleMoveRight();
										}}
										disabled={!isEdit || selectedUsersToDelete.length === 0}
										data-id="location-form-user-table-button"
										className="mr-1 lg:mr-0 lg:mb-1"
									>
										<ChevronDown className="block lg:hidden" />
										<ChevronRight className="hidden lg:block" />
									</Button>
									<Button
										variant={'outline'}
										type="button"
										size={'sm'}
										onClick={(e) => {
											e.preventDefault();
											setShowDeleteDialog(true);
										}}
										disabled={!isEdit || selectedUsersToAdd.length === 0}
										data-id="location-form-user-table-button"
										className="ml-1 lg:ml-0 lg:mt-1"
									>
										<ChevronUp className="block lg:hidden" />
										<ChevronLeft className="hidden lg:block" />
									</Button>
								</div>
							</div>
							<UserTable
								users={originalValues.users.active}
								selectedUsers={selectedUsersToAdd}
								isEdit={isEdit}
								onUserChange={handleAddUserChange}
								title="Assign Users"
								data-id="location-form-user-table"
								onCheckAll={(checked) => handleCheckAll(checked, 'active')}
							/>
						</CardContent>
					</Card>
				</div>
			</form>

			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
				data-id="location-form-alert-dialog"
			>
				<AlertDialogContent data-id="location-form-alert-dialog-content">
					<AlertDialogHeader data-id="location-form-alert-dialog-header">
						<AlertDialogTitle data-id="location-form-alert-dialog-title">
							Are you sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This will add the selected users to the active users list.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter data-id="location-form-alert-dialog-footer">
						<AlertDialogCancel data-id="location-form-alert-dialog-cancel">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleMoveLeftConfirm}
							data-id="location-form-alert-dialog-action"
						>
							Continue
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</Form>
	);
};

export default LocationForm;
