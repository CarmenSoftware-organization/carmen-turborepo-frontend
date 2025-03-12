import SearchForm from '@/components/ui-custom/SearchForm';
import SortComponent from '@/components/ui-custom/SortComponent';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { unitSortFields } from '@/constants/fields';
import { statusOptions } from '@/lib/statusOptions';
import { placeholder_search_unit } from '@/paraglide/messages';
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

const UnitFilter = ({
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
		<div className="filter-container" data-id="unit-list-filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={placeholder_search_unit()}
				data-id="unit-list-search-form"
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
					data-id="unit-list-status-search-dropdown"
				/>
				<SortComponent
					fieldConfigs={unitSortFields}
					sort={sort}
					setSort={setSort}
				/>
			</div>
		</div>
	);
};

export default UnitFilter;
