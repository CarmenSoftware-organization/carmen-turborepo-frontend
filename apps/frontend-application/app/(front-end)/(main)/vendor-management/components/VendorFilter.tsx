import SearchForm from '@/components/ui-custom/SearchForm';
import SortComponent from '@/components/ui-custom/SortComponent';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { vendorSortFields } from '@/constants/fields';
import { statusOptions } from '@/lib/statusOptions';
import { Search, Vendor } from '@/paraglide/messages';
import React from 'react';

interface Props {
	search: string;
	setSearch: (value: string) => void;
	status: string;
	setStatus: (value: string) => void;
	statusOpen: boolean;
	setStatusOpen: (value: boolean) => void;
	sort: string;
	setSort: (value: string) => void;
}

const VendorFilter = ({
	setSearch,
	search,
	setStatus,
	status,
	setStatusOpen,
	statusOpen,
	sort,
	setSort,
}: Props) => {
	return (
		<div className="filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${Search()} ${Vendor()}...`}
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
				/>
				<SortComponent
					fieldConfigs={vendorSortFields}
					sort={sort}
					setSort={setSort}
				/>
			</div>
		</div>
	);
};

export default VendorFilter;
