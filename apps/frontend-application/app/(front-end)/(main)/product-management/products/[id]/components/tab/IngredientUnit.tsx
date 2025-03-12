import React, { useState } from 'react'
import { IngredientUnitType, productInfo } from '../../../data';
import { AlertCircle, Pencil, Plus, Scale, TrashIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';


const IngredientUnit = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [units, setUnits] = useState(productInfo.ingredientUnits);

    const handleDefaultChange = (changedUnit: IngredientUnitType) => {
        if (!isEditing) return;

        setUnits(units.map(unit => ({
            ...unit,
            isDefault: unit.ingredientUnit === changedUnit.ingredientUnit ? !unit.isDefault : unit.isDefault
        })));
    };

    const handleDeleteUnit = (unitCode: string) => {
        if (!isEditing) return;
        if (window.confirm('Are you sure you want to delete this unit?')) {
            // Here you would make an API call to delete the unit
            console.log(`Deleting unit: ${unitCode}`);
        }
    };

    return (
			<div className="space-y-6">
				{/* Header */}
				<div className="bg-white rounded-lg shadow-sm">
					<div className="p-4 border-b">
						<div className="flex justify-between items-center">
							<div className="flex items-center space-x-2">
								<Scale className="w-5 h-5 text-gray-500" />
								<h2 className="text-xs font-medium text-gray-900">
									Ingredient Units
								</h2>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-xs text-gray-500">Inventory Unit:</span>
								<span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded">
									{productInfo.inventoryUnit}
								</span>
							</div>
						</div>
					</div>
					<div className="p-4 bg-gray-50">
						<div className="grid grid-cols-2 gap-6">
							<div>
								<label className="text-xs text-gray-500">Product Code</label>
								<div className="mt-1 text-xs font-medium">
									{productInfo.code}
								</div>
							</div>
							<div>
								<label className="text-xs text-gray-500">Product Name</label>
								<div className="mt-1 text-xs font-medium">
									{productInfo.name}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Ingredient Units Table */}
				<div className="bg-white rounded-lg shadow-sm">
					<div className="p-4 border-b flex justify-between items-center">
						<h3 className="text-xs font-medium text-gray-900">
							Ingredient Units
						</h3>
						<div className="flex items-center space-x-4">
							<button className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center">
								<Plus className="w-4 h-4" />
								New Ingredient Unit
							</button>
							<button
								className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
								onClick={() => setIsEditing(!isEditing)}
							>
								{isEditing ? (
									<>
										<X className="w-4 h-4" />
										Cancel
									</>
								) : (
									<>
										<Pencil className="w-4 h-4" />
										Edit
									</>
								)}
							</button>
						</div>
					</div>

					<div className="p-4">
						<table className="w-full">
							<thead>
								<tr className="text-xs text-gray-500 uppercase">
									<th className="px-4 py-2 text-left bg-gray-50">
										Inventory Unit
									</th>

									<th className="px-4 py-2 text-right bg-gray-50">
										Conversion Factor
									</th>
									<th className="px-4 py-2 text-center bg-gray-50">
										Recipe Default
									</th>
									<th className="px-4 py-2 text-right bg-gray-50">Actions</th>
									<th className="px-4 py-2 text-left bg-gray-50">
										Description
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{units.map((unit) => (
									<tr key={unit.ingredientUnit} className="hover:bg-gray-50">
										<td className="px-4 py-3">
											<span className="text-xs font-medium text-gray-900">
												1 KG
											</span>
										</td>

										<td className="px-4 py-3">
											<div className="flex items-center justify-end space-x-1">
												<span className="text-xs tabular-nums text-right">
													to 1000
												</span>
												<span className="text-xs text-gray-500">g</span>
											</div>
										</td>

										<td className="px-4 py-3 text-center">
											<input
												type="checkbox"
												checked={unit.isDefault}
												onChange={() => handleDefaultChange(unit)}
												disabled={!isEditing}
												className="h-4 w-4 rounded text-blue-600 cursor-pointer disabled:cursor-default"
											/>
										</td>
										<td className="px-4 py-3">
											<div className="flex justify-end space-x-2">
												{isEditing && (
													<>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-muted-foreground hover:text-blue-600"
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8 text-muted-foreground hover:text-destructive"
															onClick={() =>
																handleDeleteUnit(unit.ingredientUnit)
															}
														>
															<TrashIcon className="h-4 w-4" />
														</Button>
													</>
												)}
											</div>
										</td>
										<td className="px-4 py-3">
											<span className="text-xs text-gray-500">
												{unit.description}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Quick Calculator */}
				<div className="bg-white rounded-lg shadow-sm">
					<div className="p-4 border-b">
						<h3 className="text-xs font-medium text-gray-900">
							Ingredient Quantity Calculator
						</h3>
					</div>
					<div className="p-4">
						<div className="flex items-center space-x-4">
							<div>
								<label className="text-xs text-gray-500 mb-1 block">
									Ingredient Qty
								</label>
								<input
									type="number"
									className="w-32 p-2 border rounded-lg text-right"
									defaultValue="1"
								/>
							</div>
							<div>
								<label className="text-xs text-gray-500 mb-1 block">
									Ingredient Unit
								</label>
								<select className="w-32 p-2 border rounded-lg">
									{units.map((unit) => (
										<option
											key={unit.ingredientUnit}
											value={unit.ingredientUnit}
										>
											{unit.ingredientUnit}
										</option>
									))}
								</select>
							</div>
							<div className="pt-6">
								<span className="text-gray-500">=</span>
							</div>
							<div>
								<label className="text-xs text-gray-500 mb-1 block">
									Inventory Quantity
								</label>
								<div className="text-lg font-medium tabular-nums">
									2 {productInfo.inventoryUnit}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Notes */}
				<div className="bg-blue-50 rounded-lg p-4">
					<div className="flex items-start space-x-2">
						<AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
						<div>
							<h4 className="text-xs font-medium text-blue-900">
								Ingredient Unit Information
							</h4>
							<ul className="mt-2 text-xs text-blue-700 space-y-1">
								<li>
									• Ingredient units are used for recipes and formulations
								</li>
								<li>• Default unit will be used for recipe calculations</li>
								<li>• Factor shows the conversion rate to inventory units</li>
								<li>• Precision defines decimal places for quantity entry</li>
								<li>• Min Qty sets the smallest allowed quantity</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		);
}

export default IngredientUnit