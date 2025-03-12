import React from 'react';
import * as Form from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Control, useWatch } from 'react-hook-form';
import { ProductFormType } from '@/dtos/product.dto';
import { PRODUCT_STATUS_FILTER } from '@/lib/util/status';
import {
	status_active,
	status_discontinued,
	status_inactive,
} from '@/paraglide/messages';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import { useUnit } from '@/hooks/useUnit';

interface BasicInformationProps {
	control: Control<ProductFormType>;
	token: string;
	tenantId: string;
	selectedUnit: { id: string; name: string } | null;
	setSelectedUnit: React.Dispatch<React.SetStateAction<{ id: string; name: string } | null>>;
}

const statusOptions = [
	{ label: `${status_active()}`, value: PRODUCT_STATUS_FILTER.ACTIVE },
	{ label: `${status_inactive()}`, value: PRODUCT_STATUS_FILTER.IN_ACTIVE },
	{
		label: `${status_discontinued()}`,
		value: PRODUCT_STATUS_FILTER.DISCONTINUED,
	},
];

const BasicInformation = ({ control, selectedUnit, setSelectedUnit }: BasicInformationProps) => {
	const { units } = useUnit();

	// Watch field values to know when they change
	const watchedValues = useWatch({
		control,
		name: ['primary_unit_id', 'tax_type', 'product_status_type'],
	});

	// Handle immediate effects when a field is selected
	const handleValueChange = (
		fieldName: 'primary_unit_id' | 'tax_type' | 'product_status_type',
		value: string
	) => {
		// Apply immediate effects based on selected values
		if (fieldName === 'tax_type' && value === 'non_vat') {
			// If tax_type is set to non_vat, automatically set tax_rate to 0
			control._formValues.tax_rate = 0;
		}
	};

	return (
		<Card>
			<CardContent className="grid grid-cols-1 sm:grid-cols-4 gap-4">
				<Form.FormField
					control={control}
					name="name"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Product Name</Form.FormLabel>
							<Form.FormControl>
								<Input
									{...field}
									value={String(field.value || '')}
									placeholder="Enter product name"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="local_name"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Local Name</Form.FormLabel>
							<Form.FormControl>
								<Input
									{...field}
									value={String(field.value || '')}
									placeholder="Enter local name"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="primary_unit_id"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Inventory Unit</Form.FormLabel>
							<Form.FormControl>
								<SearchableDropdown
									data={units}
									value={selectedUnit}
									onChange={(selectedUnit) => {
										field.onChange(selectedUnit?.id || '');
										if (selectedUnit?.id) {
											handleValueChange('primary_unit_id', selectedUnit.id);
											setSelectedUnit({ id: selectedUnit.id, name: selectedUnit.name });
										} else {
											setSelectedUnit(null);
										}
									}}
									displayValue={(unit) => unit?.name || ''}
									getItemText={(unit) => unit.name}
									getItemId={(unit) => unit.id || ''}
									searchFields={['name', 'description']}
									placeholder="Select an inventory unit"
									searchPlaceholder="Search units..."
									noResultsText="No matching units found"
									noDataText="No units available"
									className="w-full"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="product_item_group_id"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Product Group ID มีอีก 3 select</Form.FormLabel>
							<Form.FormControl>
								<Input
									{...field}
									value={String(field.value || '')}
									placeholder="Enter product group ID"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="price"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Price</Form.FormLabel>
							<Form.FormControl>
								<Input
									type="number"
									step="any"
									value={field.value === undefined ? '' : field.value}
									onChange={(e) => {
										const value = e.target.value === '' ? undefined : Number(e.target.value);
										field.onChange(value);
									}}
									onBlur={field.onBlur}
									placeholder="Enter price"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="tax_type"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Tax Type</Form.FormLabel>
							<Form.FormControl>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										handleValueChange('tax_type', value);
									}}
									defaultValue={String(field.value || '')}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select tax type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="vat">VAT</SelectItem>
										<SelectItem value="non_vat">Non-VAT</SelectItem>
									</SelectContent>
								</Select>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="tax_rate"
					render={({ field }) => {
						// Make the tax rate field readonly if tax_type is non_vat
						const taxType = watchedValues[1];
						const isNonVat = taxType === 'non_vat';

						return (
							<Form.FormItem>
								<Form.FormLabel>Tax Rate</Form.FormLabel>
								<Form.FormControl>
									<Input
										type="number"
										step="any"
										value={isNonVat ? 0 : (field.value === undefined ? '' : field.value)}
										onChange={(e) => {
											if (!isNonVat) {
												const value = e.target.value === '' ? undefined : Number(e.target.value);
												field.onChange(value);
											}
										}}
										onBlur={field.onBlur}
										placeholder="Enter tax rate"
										readOnly={isNonVat}
										className={isNonVat ? "bg-muted" : ""}
									/>
								</Form.FormControl>
								{isNonVat && (
									<Form.FormDescription className="text-xs text-muted-foreground mt-1">
										Tax rate is fixed at 0 for Non-VAT items
									</Form.FormDescription>
								)}
								<Form.FormMessage />
							</Form.FormItem>
						);
					}}
				/>

				<Form.FormField
					control={control}
					name="price_deviation_limit"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Price Deviation Limit</Form.FormLabel>
							<Form.FormControl>
								<Input
									type="number"
									step="any"
									value={field.value === undefined ? '' : field.value}
									onChange={(e) => {
										const value = e.target.value === '' ? undefined : Number(e.target.value);
										field.onChange(value);
									}}
									onBlur={field.onBlur}
									placeholder="Enter price deviation limit"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="product_status_type"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Status</Form.FormLabel>
							<Form.FormControl>
								<Select
									onValueChange={(value) => {
										field.onChange(value);
										handleValueChange('product_status_type', value);
									}}
									defaultValue={String(field.value || '')}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>

				<Form.FormField
					control={control}
					name="description"
					render={({ field }) => (
						<Form.FormItem>
							<Form.FormLabel>Description</Form.FormLabel>
							<Form.FormControl>
								<Textarea
									{...field}
									value={String(field.value || '')}
									placeholder="Enter description"
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>
				<Form.FormField
					control={control}
					name="is_ingredients"
					render={({ field }) => (
						<Form.FormItem className='flex flex-col mt-4'>
							<Form.FormLabel>Is Ingredient</Form.FormLabel>
							<Form.FormControl>
								<Switch
									checked={Boolean(field.value)}
									onCheckedChange={field.onChange}
								/>
							</Form.FormControl>
							<Form.FormMessage />
						</Form.FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
};

export default BasicInformation;
