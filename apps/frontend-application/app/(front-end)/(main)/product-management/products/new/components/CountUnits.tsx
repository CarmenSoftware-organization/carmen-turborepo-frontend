import React from 'react';
import * as Form from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { ProductFormType } from '@/dtos/product.dto';
import { useUnit } from '@/hooks/useUnit';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface CountUnitsProps {
	control: Control<ProductFormType>;
}

const CountUnits = ({ control }: CountUnitsProps) => {
	const { units } = useUnit();

	const { fields, append, remove } = useFieldArray({
		name: 'countUnits.add',
		control: control,
	});

	const handleAddUnit = () => {
		append({
			unit_id: '',
			unit_quantity: 1,
			to_unit_id: '',
			to_unit_quantity: 1,
		});
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Count Units</CardTitle>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddUnit}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Count Unit
				</Button>
			</CardHeader>
			<CardContent className="pt-0">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Unit</TableHead>
							<TableHead>Unit Quantity</TableHead>
							<TableHead>To Unit</TableHead>
							<TableHead>To Unit Quantity</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{fields.map((field, index) => (
							<TableRow key={field.id}>
								<TableCell>
									<Form.FormField
										control={control}
										name={`countUnits.add.${index}.unit_id`}
										render={({ field }) => (
											<Form.FormItem>
												<Form.FormControl>
													<SearchableDropdown
														data={units}
														value={units.find(unit => unit.id === field.value) || null}
														onChange={(selectedUnit) => {
															field.onChange(selectedUnit.id || '');
														}}
														displayValue={(unit) => unit?.name || ''}
														getItemText={(unit) => unit.name}
														getItemId={(unit) => unit.id || ''}
														searchFields={['name', 'description']}
														placeholder="Select a unit"
														searchPlaceholder="Search units..."
														noResultsText="No matching units found"
														noDataText="No units available"
														className="w-full"
													/>
												</Form.FormControl>
											</Form.FormItem>
										)}
									/>
								</TableCell>
								<TableCell>
									<Form.FormField
										control={control}
										name={`countUnits.add.${index}.unit_quantity`}
										render={({ field }) => (
											<Form.FormItem>
												<Form.FormControl>
													<Input
														type="number"
														step="any"
														value={field.value}
														onChange={(e) => {
															const value = e.target.value === '' ? '' : Number(e.target.value);
															field.onChange(value);
														}}
														onBlur={field.onBlur}
														className="w-full"
													/>
												</Form.FormControl>
											</Form.FormItem>
										)}
									/>
								</TableCell>
								<TableCell>
									<Form.FormField
										control={control}
										name={`countUnits.add.${index}.to_unit_id`}
										render={({ field }) => (
											<Form.FormItem>
												<Form.FormControl>
													<SearchableDropdown
														data={units}
														value={units.find(unit => unit.id === field.value) || null}
														onChange={(selectedUnit) => {
															field.onChange(selectedUnit.id || '');
														}}
														displayValue={(unit) => unit?.name || ''}
														getItemText={(unit) => unit.name}
														getItemId={(unit) => unit.id || ''}
														searchFields={['name', 'description']}
														placeholder="Select a unit"
														searchPlaceholder="Search units..."
														noResultsText="No matching units found"
														noDataText="No units available"
														className="w-full"
													/>
												</Form.FormControl>
											</Form.FormItem>
										)}
									/>
								</TableCell>
								<TableCell>
									<Form.FormField
										control={control}
										name={`countUnits.add.${index}.to_unit_quantity`}
										render={({ field }) => (
											<Form.FormItem>
												<Form.FormControl>
													<Input
														type="number"
														step="any"
														value={field.value}
														onChange={(e) => {
															const value = e.target.value === '' ? '' : Number(e.target.value);
															field.onChange(value);
														}}
														onBlur={field.onBlur}
														className="w-full"
													/>
												</Form.FormControl>
											</Form.FormItem>
										)}
									/>
								</TableCell>
								<TableCell>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										onClick={() => remove(index)}
										aria-label="Remove count unit"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
};

export default CountUnits;
