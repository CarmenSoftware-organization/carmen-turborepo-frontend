import { PriceDTO } from '@/dtos/product.dto';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Props {
	data: PriceDTO;
	isEditing: boolean;
	handleChange: (field: string, value: string | number) => void;
}

const PricingField: React.FC<{
	label: string;
	value: string;
	field: string;
	type?: 'text' | 'number';
	step?: string;
	isEditing: boolean;
	onChange: (field: string, value: string | number) => void;
}> = ({
	label,
	value,
	field,
	type = 'text',
	step = '0.01',
	isEditing,
	onChange,
}) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue =
			type === 'number'
				? e.target.value === ''
					? ''
					: Number(parseFloat(e.target.value).toFixed(2))
				: e.target.value;
		onChange(field, newValue);
	};

	return (
		<div>
			<label className="text-xs font-medium text-muted-foreground">
				{label}
			</label>
			{isEditing ? (
				<Input
					className="text-xs"
					value={value || ''}
					onChange={handleInputChange}
					type={type}
					step={type === 'number' ? step : undefined}
					min="0"
					aria-label={label}
				/>
			) : (
				<p className="text-xs">{value || '-'}</p>
			)}
		</div>
	);
};

const PricingInformation: React.FC<Props> = ({
	data,
	isEditing,
	handleChange,
}) => {
	return (
		<Card className="py-2">
			<CardHeader className="py-2">
				<CardTitle>Pricing Information</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 py-2">
				<div className="grid grid-cols-2 gap-4">
					<PricingField
						label="Price"
						value={data.price}
						field="data.product_info.price"
						type="number"
						step="0.01"
						isEditing={isEditing}
						onChange={handleChange}
					/>
					<PricingField
						label="Tax Type"
						value={data.tax_type}
						field="data.product_info.tax_type"
						isEditing={isEditing}
						onChange={handleChange}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<PricingField
						label="Tax Rate"
						value={data.tax_rate}
						field="data.product_info.tax_rate"
						type="number"
						step="0.01"
						isEditing={isEditing}
						onChange={handleChange}
					/>
					<PricingField
						label="Price Deviation Limit"
						value={data.price_deviation_limit}
						field="data.product_info.price_deviation_limit"
						type="number"
						step="0.01"
						isEditing={isEditing}
						onChange={handleChange}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="text-xs font-medium text-muted-foreground">
							Last Cost (mock)
						</label>
						<p className="text-xs">29.75 THB</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default PricingInformation;
