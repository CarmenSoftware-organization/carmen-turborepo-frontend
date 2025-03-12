'use client';

import React from 'react';
import { store_location } from '@/paraglide/messages';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import DataDisplayTemplate from '@/components/templates/DataDisplayTemplate';
import LocationList from './LocationList';
import LocationActions from './LocationActions';
import { locationSortFields } from '@/constants/fields';
import LocationFilter from './LocationFilter';
import { useLocation } from '@/hooks/useLocation';

const LocationComponents = () => {
	const {
		locations,
		isLoading,
		error,
		search,
		setSearch,
		status,
		setStatus,
		page,
		pages,
		sort,
		statusOpen,
		setStatusOpen,
		handleDelete,
		handlePageChange,
		handleFilterSortChange,
	} = useLocation();

	if (error) {
		return <ErrorCard message={error} data-id="store-location-error-card" />;
	}

	return (
		<DataDisplayTemplate
			title={store_location()}
			actionButtons={<LocationActions />}
			filters={
				<LocationFilter
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					sort={sort}
					setSort={handleFilterSortChange}
				/>
			}
			content={
				<LocationList
					locations={locations}
					fields={locationSortFields}
					page={+page}
					totalPage={+pages}
					handlePageChange={handlePageChange}
					sort={sort}
					onSortChange={handleFilterSortChange}
					isLoading={isLoading}
					handleDelete={handleDelete}
					data-id="product-list-product-display"
				/>
			}
			data-id="store-location-data-display-template"
		/>
	);
};

export default LocationComponents;
