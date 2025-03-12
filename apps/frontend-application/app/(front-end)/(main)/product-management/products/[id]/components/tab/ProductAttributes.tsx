import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AttributesDTO } from '@/dtos/product.dto';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Props {
	info: AttributesDTO;
	isEditing: boolean;
	handleChange: (field: string, value: unknown) => void;
}

const ProductAttributes: React.FC<Props> = ({
	info,
	isEditing,
	handleChange,
}) => {
	const attributes = info?.info?.attribute ?? [];

	const handleAttributeChange = (
		index: number,
		field: 'label' | 'value',
		value: string
	) => {
		handleChange(`data.product_info.info.attribute[${index}].${field}`, value);
	};

	const handleAddAttribute = () => {
		handleChange(`data.product_info.info.attribute`, [
			...attributes,
			{ label: '', value: '' },
		]);
	};

	return (
		<Card className="py-2">
			<CardHeader className="py-2">
				<CardTitle className="flex justify-between items-center">
					<p>Product Attributes</p>
					{isEditing && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleAddAttribute}
							className="h-8 w-8 p-0"
							aria-label="Add attribute"
						>
							<Plus className="h-4 w-4" />
						</Button>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className="grid gap-2 py-2">
				{attributes.length === 0 ? (
					<p className="text-xs text-muted-foreground">Empty data</p>
				) : (
					<div className="grid grid-cols-2 gap-4">
						{attributes.map((item, index) => (
							<div key={index} className='space-y-1'>
								{isEditing ? (
									<div className='space-y-1'>
										<p className="text-xs font-medium text-muted-foreground">
											Label
										</p>
										<Input
											className="text-xs font-medium text-muted-foreground"
											value={item?.label ?? ''}
											onChange={(e) =>
												handleAttributeChange(index, 'label', e.target.value)
											}
											placeholder="Enter label"
											aria-label={`Attribute label ${index}`}
										/>
									</div>
								) : (
									<p className="text-xs font-medium text-muted-foreground">
										{item?.label ?? ''}
									</p>
								)}
								{isEditing ? (
									<div className='space-y-1'>
										<p className="text-xs">
											Value
										</p>
										<Input
											className="text-xs"
											value={item?.value ?? ''}
											onChange={(e) =>
												handleAttributeChange(index, 'value', e.target.value)
											}
											placeholder="Enter value"
											aria-label={`Attribute value ${index}`}
										/>
									</div>
								) : (
									<p className="text-xs">{item?.value ?? ''}</p>
								)}
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default ProductAttributes;