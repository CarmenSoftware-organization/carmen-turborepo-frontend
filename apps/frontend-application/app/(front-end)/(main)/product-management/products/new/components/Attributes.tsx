import React from 'react';
import * as Form from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { ProductFormType } from '@/dtos/product.dto';

interface AttributesProps {
	control: Control<ProductFormType>;
}

const Attributes = ({ control }: AttributesProps) => {
	const { fields, append, remove } = useFieldArray({
		name: 'info.0.attribute',
		control: control,
	});

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Attributes</CardTitle>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={() => append({ label: '', value: '' })}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Attribute
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				{fields.map((field, index) => (
					<div
						key={field.id}
						className="grid grid-cols-[1fr_1fr_auto] gap-3 items-start"
					>
						<Form.FormField
							control={control}
							name={`info.0.attribute.${index}.label`}
							render={({ field }) => (
								<Form.FormItem>
									<Form.FormLabel>Label</Form.FormLabel>
									<Form.FormControl>
										<Input {...field} />
									</Form.FormControl>
								</Form.FormItem>
							)}
						/>
						<Form.FormField
							control={control}
							name={`info.0.attribute.${index}.value`}
							render={({ field }) => (
								<Form.FormItem>
									<Form.FormLabel>Value</Form.FormLabel>
									<Form.FormControl>
										<Input {...field} />
									</Form.FormControl>
								</Form.FormItem>
							)}
						/>
						<Button
							type="button"
							variant="destructive"
							size="icon"
							className="mt-8"
							onClick={() => remove(index)}
							aria-label="Remove attribute"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				))}
				{fields.length === 0 && (
					<div className="text-center py-4 text-muted-foreground text-xs">
						No attributes added. Click &quot;Add Attribute&quot; to add an attribute.
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default Attributes;
