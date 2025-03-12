'use client';

import React from 'react';
import { fetchUnits } from './api';
import { UnitCreateModel } from '@/dtos/unit.dto';
interface Props {
	token: string;
	tenantId: string;
}

const ServerListComponent: React.FC<Props> = async ({ token, tenantId }) => {
	const units = await fetchUnits(token, tenantId);

	console.log('units:', units);

	return (
		<div>
			<h1>Unit List</h1>
			<ul>
				{units.map((unit: UnitCreateModel) => (
					<li key={unit.id}>{unit.name}</li>
				))}
			</ul>
		</div>
	);
};

export default ServerListComponent;
