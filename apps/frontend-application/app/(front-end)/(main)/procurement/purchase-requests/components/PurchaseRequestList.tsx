"use client";
import React, { useState } from 'react';
import { useURL } from '@/hooks/useURL';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import PurchaseDisplay from './PurchaseDisplay';
import { prSortFields } from '@/constants/fields';
import PrActions from './PrActions';
import PrFilter from './PrFilter';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { purchase_request_title } from '@/paraglide/messages.js';
import { usePr } from '@/hooks/usePr';

const PurchaseRequestList = () => {
	const { prList, setPrList, isLoading, error } = usePr();
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');

	if (error) return <ErrorCard message={error} />;

	return (
		<DataDisplayTemplate
			title={purchase_request_title()}
			actionButtons={<PrActions />}
			filters={
				<PrFilter
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					prList={prList}
					setPrList={setPrList}
				/>
			}
			content={
				<PurchaseDisplay
					prData={prList}
					fields={prSortFields}
					isLoading={isLoading}
				/>
			}
		/>
	);
};

export default PurchaseRequestList