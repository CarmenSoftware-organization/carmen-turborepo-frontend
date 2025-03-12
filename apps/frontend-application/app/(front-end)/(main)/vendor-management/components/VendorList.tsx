'use client';

import React from 'react';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import VendorDisplay from './VendorDisplay';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import VendorFilter from './VendorFilter';
import VendorAction from './VendorAction';
import { vendors_title } from '@/paraglide/messages.js';
import { useVendor } from '@/hooks/useVendor';

const VendorList = () => {
	const {
		vendors,
		isLoading,
		error,
		search,
		setSearch,
		status,
		setStatus,
		statusOpen,
		setStatusOpen,
		page,
		totalPages,
		sort,
		setSort,
		handlePageChange,
		handleSortChange,
	} = useVendor();

	if (error) {
		return <ErrorCard message={error} />;
	}

	return (
		<DataDisplayTemplate
			title={vendors_title()}
			actionButtons={<VendorAction />}
			filters={
				<VendorFilter
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					sort={sort}
					setSort={setSort}
				/>
			}
			content={
				<VendorDisplay
					vendors={vendors}
					page={page}
					totalPage={totalPages}
					handlePageChange={handlePageChange}
					sort={sort}
					onSortChange={handleSortChange}
					isLoading={isLoading}
				/>
			}
		/>
	);
};

export default VendorList;
