import React, { useMemo, useState } from 'react';
import * as Form from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { ProductFormType } from '@/dtos/product.dto';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useLocation } from '@/hooks/useLocation';
import { Badge } from '@/components/ui/badge';

interface LocationsProps {
	control: Control<ProductFormType>;
}

const Locations: React.FC<LocationsProps> = ({ control }) => {
	const { locations } = useLocation();
	const [editingIndex, setEditingIndex] = useState<number | null>(null);

	const { fields, append, remove, update } = useFieldArray({
		name: 'locations.add',
		control,
	});

	const getLocationById = useMemo(
		() => (id: string) => locations.find((loc) => loc.id === id),
		[locations]
	);

	const handleLocationSelect = (value: string, index: number) => {
		const selectedLocation = getLocationById(value);
		if (!selectedLocation) return;

		update(index, {
			location_id: selectedLocation.id || '',
			name: selectedLocation.name,
			location_type: selectedLocation.location_type,
			is_active: Boolean(selectedLocation.is_active),
		});
		setEditingIndex(null);
	};

	const handleAddLocation = () => {
		append({
			location_id: '',
			name: '',
			location_type: '',
			is_active: false,
		});
		setEditingIndex(fields.length);
	};

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle>Locations</CardTitle>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={handleAddLocation}
					className="flex items-center gap-1"
				>
					<Plus className="h-4 w-4" />
					Add Location
				</Button>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Location</TableHead>
								<TableHead>Type</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="w-[50px]"></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{fields.map((field, index) => {
								const location = getLocationById(field.location_id);

								return (
									<TableRow key={field.id}>
										<TableCell>
											<Form.FormField
												control={control}
												name={`locations.add.${index}.location_id`}
												render={({ field: formField }) => (
													<Form.FormItem>
														<Form.FormControl>
															{editingIndex === index ? (
																<SearchableDropdown
																	data={locations}
																	value={location || null}
																	onChange={(selectedLocation) => {
																		if (selectedLocation?.id) {
																			formField.onChange(selectedLocation.id);
																			handleLocationSelect(selectedLocation.id, index);
																		}
																	}}
																	displayValue={(loc) => loc?.name || ''}
																	getItemText={(loc) => loc.name || 'Unnamed Location'}
																	getItemId={(loc) => loc.id || ''}
																	searchFields={['name', 'location_type']}
																	placeholder="Select a location"
																	searchPlaceholder="Search locations..."
																	noResultsText="No matching locations found"
																	noDataText="No locations available"
																	className="w-full"
																/>
															) : (
																<div
																	className="flex items-center cursor-pointer text-sm"
																	onClick={() => setEditingIndex(index)}
																>
																	{location?.name || 'Select a location'}
																</div>
															)}
														</Form.FormControl>
													</Form.FormItem>
												)}
											/>
										</TableCell>
										<TableCell>
											{location ? (
												<Badge variant="secondary" className="font-normal">
													{location.location_type?.toUpperCase() || 'N/A'}
												</Badge>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											{location ? (
												<Badge
													variant={location.is_active ? 'default' : 'destructive'}
													className={`font-normal ${location.is_active ? 'bg-green-100 text-green-700' : ''}`}
												>
													{location.is_active ? 'Active' : 'Inactive'}
												</Badge>
											) : (
												<span className="text-muted-foreground">-</span>
											)}
										</TableCell>
										<TableCell>
											<Button
												type="button"
												variant="destructive"
												size="icon"
												onClick={() => remove(index)}
												aria-label={`Remove ${location?.name || 'location'}`}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								);
							})}
							{fields.length === 0 && (
								<TableRow>
									<TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
										No locations added. Click &quot;Add Location&quot; to add a location.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
};

export default Locations;