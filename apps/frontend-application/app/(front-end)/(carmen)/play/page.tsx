'use client';

import { useUnit } from '@/hooks/useUnit';
import React, { useState, useEffect } from 'react';
import { SearchableDropdown } from '@/components/ui/searchable-dropdown';

// Define the Unit type that satisfies Record<string, unknown>
type Unit = {
	id?: string;
	name: string;
	description?: string;
	is_active?: boolean;
	created_at?: string;
	created_by_id?: string | null;
	updated_at?: string;
	updated_by_id?: string | null;
};

const PlayPage = () => {
	const { units: initialUnits } = useUnit();
	const [selectedLargeUnit, setSelectedLargeUnit] = useState<Unit | null>(null);
	const [largeDataset, setLargeDataset] = useState<Unit[]>([]);

	// Generate a large dataset for scroll demonstration
	useEffect(() => {
		// Start with initial units
		const baseUnits = initialUnits || [];

		// Create a large initial dataset by duplicating and modifying the base units
		const initialLargeDataset = Array.from({ length: 50 }, (_, index) => {
			const sourceUnit = baseUnits[index % baseUnits.length] || {
				name: 'Default Unit',
				description: 'Default description'
			};

			return {
				...sourceUnit,
				id: `${index}`,
				name: `${sourceUnit.name} ${index + 1}`,
				description: `${sourceUnit.description || 'Description'} ${index + 1}`
			};
		});

		setLargeDataset(initialLargeDataset);
	}, [initialUnits]);

	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-bold mb-4">Unit Selection Example</h1>

			{/* Demo with infinite scroll */}
			<div className="max-w-sm mt-8">
				<h2 className="text-xl font-semibold mb-2">Infinite Scroll Example</h2>
				<p className="text-sm text-gray-500 mb-2">
					This example shows scrolling through a large dataset with 5 items per batch
				</p>
				<SearchableDropdown<Unit>
					data={largeDataset}
					value={selectedLargeUnit}
					onChange={setSelectedLargeUnit}
					displayValue={(unit) => unit ? `${unit.name}` : ''}
					getItemText={(unit) => `${unit.name} - ${unit.description || 'No description'}`}
					getItemId={(unit) => unit.id || ''}
					searchFields={['name', 'description']}
					placeholder="Select with infinite scroll"
					searchPlaceholder="Search large dataset..."
					itemsPerBatch={5}
					className="mt-2"
				/>
			</div>

			{/* Status display for debugging */}
			{selectedLargeUnit && (
				<div className="max-w-sm mt-8 p-4 bg-gray-100 rounded-md">
					<h3 className="font-medium mb-2">Selected Item:</h3>
					<div>
						<div><span className="font-semibold">ID:</span> {selectedLargeUnit.id}</div>
						<div><span className="font-semibold">Name:</span> {selectedLargeUnit.name}</div>
						<div><span className="font-semibold">Description:</span> {selectedLargeUnit.description}</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PlayPage;
