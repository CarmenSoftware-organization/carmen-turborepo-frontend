'use client';

import React, { useState } from 'react';
import { useURL } from '@/hooks/useURL';
import PoActions from './PoActions';
import PoFilters from './PoFilters';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import PoData from './PoData';
import { poSortFields } from '@/constants/fields';
import { po_title } from '@/paraglide/messages.js';
import { usePOderData } from '@/hooks/usePo';

const PurchaseOrdersList = () => {
	const { poData, setPoData, isLoading, error } = usePOderData();
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');

	if (error) return <ErrorCard message={error} />;

	return (
		<DataDisplayTemplate
			title={po_title()}
			actionButtons={<PoActions />}
			filters={
				<PoFilters
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					poData={poData}
					setPoData={setPoData}
				/>

			}
			content={
				<PoData
					poDatas={poData}
					fields={poSortFields}
					isLoading={isLoading}
				/>
			}
		/>
	);
};

export default PurchaseOrdersList;
