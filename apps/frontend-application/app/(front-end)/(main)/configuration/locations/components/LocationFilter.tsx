import SearchForm from '@/components/ui-custom/SearchForm';
import SortComponent from '@/components/ui-custom/SortComponent';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { locationSortFields } from '@/constants/fields';
import { statusOptions } from '@/lib/statusOptions';
import { Search, store_location } from '@/paraglide/messages';
import React from 'react';

interface LocationFilterProps {
	search: string;
	setSearch: (search: string) => void;
	status: string;
	setStatus: (status: string) => void;
	statusOpen: boolean;
	setStatusOpen: (statusOpen: boolean) => void;
	sort: string;
	setSort: (sort: string) => void;
}

const LocationFilter = ({
	search,
	setSearch,
	status,
	setStatus,
	statusOpen,
	setStatusOpen,
	sort,
	setSort,
}: LocationFilterProps) => {
	return (
		<div className="filter-container" data-id="store-location-filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${Search()} ${store_location()}...`}
				data-id="store-location-search-form"
			/>
			<div
				className="all-center gap-2"
				data-id="store-location-filter-container"
			>
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="store-location-status-search-dropdown"
				/>
				<SortComponent
					fieldConfigs={locationSortFields}
					sort={sort}
					setSort={setSort}
					data-id="store-location-sort-component"
				/>
			</div>
		</div>
	);
};

export default LocationFilter;
