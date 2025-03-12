import { DeliveryPointCreateModel } from '@/dtos/delivery-point.dto';
import { enum_location_type, UserLocationModel } from '@/dtos/location.dto';
import React, { useCallback, useEffect, useState } from 'react';
import { Control } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui-custom/FormCustom';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { InputCustom } from '@/components/ui-custom/InputCustom';
import {
	description,
	location_type_label,
	placeholder_store_location_name,
	store_location_name_label,
	delivery_point,
	placeholder_enter,
	save_text,
	cancel_text,
	status_text,
} from '@/paraglide/messages';
import { Textarea } from '@/components/ui/textarea';
import DeliveryPointSelect from '../../components/DeliveryPointSelect ';
import { Button } from '@/components/ui/button';
import { Pen, Save, X } from 'lucide-react';
import { Badge } from '@/components/ui-custom/is-active-badge';
import { Switch } from '@/components/ui/switch';
import { locationField } from '@/constants/fields';
import { fetchListDP } from '@/services/delivery_point';

interface LocationFormState {
	id: string;
	name: string;
	description: string;
	is_active: boolean;
	location_type: enum_location_type;
	delivery_point: {
		id: string;
		name: string;
	};
	users: {
		active: UserLocationModel[];
		inactive: UserLocationModel[];
	};
}

interface LocationsInfoProps {
	control: Control<LocationFormState>;
	token: string;
	tenantId: string;
	isEdit: boolean;
	setIsEdit: (value: boolean) => void;
	onCancel: () => void;
	defaultValues: LocationFormState;
	isFormIncomplete: boolean;
}

const LocationsInfo = ({
	control,
	token,
	tenantId,
	isEdit,
	setIsEdit,
	onCancel,
	defaultValues,
	isFormIncomplete,
}: LocationsInfoProps) => {
	const [deliveryPoints, setDeliveryPoints] = useState<
		DeliveryPointCreateModel[]
	>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [selectedDeliveryPoint, setSelectedDeliveryPoint] =
		useState<DeliveryPointCreateModel | null>(
			defaultValues?.delivery_point
				? {
					id: defaultValues.delivery_point.id,
					name: defaultValues.delivery_point.name,
				}
				: null
		);

	const fetchData = useCallback(async () => {
		if (!token) return;

		try {
			setIsLoading(true);
			const data = await fetchListDP(token, tenantId);
			setDeliveryPoints(data.data);
		} catch (err) {
			console.error(err instanceof Error ? err.message : 'An error occurred');
		} finally {
			setIsLoading(false);
		}
	}, [token, tenantId]);

	useEffect(() => {
		fetchData();
	}, []);

	const handleCancel = (e: React.MouseEvent) => {
		e.preventDefault();
		setIsEdit(false);
		onCancel();
	};

	return (
		<Card className="p-3">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-4">
					{isEdit ? (
						<FormField
							control={control}
							name="name"
							data-id="store-location-dialog-form-name-field"
							render={({ field }) => (
								<FormItem data-id="store-location-dialog-form-name-item">
									<FormLabel data-id="store-location-dialog-form-name-label">
										{store_location_name_label()}
									</FormLabel>
									<FormControl>
										<InputCustom
											placeholder={placeholder_store_location_name()}
											{...field}
											maxLength={50}
											data-id="store-location-dialog-form-name-input"
										/>
									</FormControl>
									<FormMessage data-id="store-location-dialog-form-name-message" />
								</FormItem>
							)}
							required
						/>
					) : (
						<div className="">
							<p className="text-xl font-bold">{defaultValues?.name}</p>
						</div>
					)}

					{isEdit ? (
						<FormField
							control={control}
							name="is_active"
							data-id="store-location-dialog-form-active-field"
							render={({ field }) => (
								<FormItem
									data-id="store-location-dialog-form-active-item"
									className="flex flex-col items-center space-y-0"
								>
									<FormLabel className="text-xs font-medium">
										{status_text()}
									</FormLabel>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
											aria-label="Toggle active status"
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					) : (
						<Badge
							variant={defaultValues?.is_active ? 'default' : 'destructive'}
						>
							{defaultValues?.is_active ? 'Active' : 'Inactive'}
						</Badge>
					)}
				</div>

				<div>
					{isEdit ? (
						<div className="hidden md:flex items-center gap-2">
							<Button
								type="submit"
								size="sm"
								disabled={isLoading || isFormIncomplete}
								data-id="store-location-dialog-footer-submit-button"
							>
								<Save />
								{save_text()}
							</Button>
							<Button
								size="sm"
								variant="outline"
								type="button"
								onClick={handleCancel}
							>
								<X />
								{cancel_text()}
							</Button>
						</div>
					) : (
						<Button
							size="sm"
							variant="outline"
							type="button"
							onClick={(e) => {
								e.preventDefault();
								setIsEdit(true);
							}}
							disabled={isLoading}
						>
							<Pen />
						</Button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
				<FormField
					control={control}
					name="location_type"
					render={({ field }) => (
						<FormItem data-id="store-location-dialog-form-location-type-item">
							<FormLabel data-id="store-location-dialog-form-location-type-label">
								{location_type_label()}
							</FormLabel>
							{isEdit ? (
								<Select
									onValueChange={field.onChange}
									value={field.value}
									disabled={isLoading}
								>
									<FormControl>
										<SelectTrigger data-id="store-location-dialog-form-location-type-select-trigger">
											<SelectValue placeholder="Select type" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{locationField.map(({ label, value }) => (
											<SelectItem
												key={value}
												value={value}
												className="cursor-pointer"
											>
												{label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<p className="text-xs">
									{locationField.find(
										(item) => item.value === defaultValues?.location_type
									)?.label || defaultValues?.location_type}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
					required={isEdit}
				/>

				<FormField
					control={control}
					name="delivery_point"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{delivery_point()}</FormLabel>
							{isEdit ? (
								<FormControl>
									<DeliveryPointSelect
										value={field.value?.id || ''}
										onValueChange={(value) => {
											const selectedDP = deliveryPoints.find(
												(dp) => dp.id === value
											);
											if (selectedDP) {
												field.onChange({
													id: selectedDP.id,
													name: selectedDP.name,
												});
												setSelectedDeliveryPoint(selectedDP);
											}
										}}
										items={deliveryPoints}
										disabled={isLoading}
									/>
								</FormControl>
							) : (
								<p className="text-xs">
									{selectedDeliveryPoint?.name ||
										defaultValues?.delivery_point?.name}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
					required={isEdit}
				/>
			</div>

			<div className="mt-2">
				<FormField
					control={control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{description()}</FormLabel>
							{isEdit ? (
								<FormControl>
									<Textarea
										placeholder={placeholder_enter()}
										className="resize-none"
										{...field}
										maxLength={200}
									/>
								</FormControl>
							) : (
								<p className="text-xs whitespace-pre-wrap">
									{defaultValues?.description}
								</p>
							)}
							<FormMessage />
						</FormItem>
					)}
					required={isEdit}
				/>
			</div>
			<div className="flex md:hidden items-center justify-end gap-2 mt-4">
				{isEdit && (
					<>
						<Button
							type="submit"
							size="sm"
							disabled={isLoading || isFormIncomplete}
							data-id="store-location-dialog-footer-submit-button"
						>
							<Save />
							{save_text()}
						</Button>
						<Button
							size="sm"
							variant="outline"
							type="button"
							onClick={handleCancel}
						>
							<X />
							{cancel_text()}
						</Button>
					</>
				)}
			</div>
		</Card>
	);
};

export default LocationsInfo;
