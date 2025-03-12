'use client';

import React, { useState } from 'react';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { useURL } from '@/hooks/useURL';
import GoodsReceiveDisplay from './GoodsReceiveDisplay';
import { GRNFilters } from './GRNFilters';
import { goodsReceiveNoteFields } from '@/constants/fields';
import { grn_title } from '@/paraglide/messages.js';
import GrnActions from './GrnActions';
import { useGrn } from '@/hooks/useGrn';

const GoodsReceiveNoteList = () => {
	const { grnData, setGrnData, isLoading, error } = useGrn();
	const [statusOpen, setStatusOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');

	if (error) return <ErrorCard message={error} />;

	return (
		<DataDisplayTemplate
			title={grn_title()}
			actionButtons={<GrnActions />}
			filters={
				<GRNFilters
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					grnData={grnData}
					setGrnData={setGrnData}
				/>
			}
			content={
				<GoodsReceiveDisplay
					grnDatas={grnData}
					fields={goodsReceiveNoteFields}
					isLoading={isLoading}
				/>
			}
		/>
	);
};

export default GoodsReceiveNoteList;
