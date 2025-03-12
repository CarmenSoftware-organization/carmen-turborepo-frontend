import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import SearchForm from '@/components/ui-custom/SearchForm';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import { Filter } from 'lucide-react';
import { FilterBuilder } from './FilterBuilder';
import { statusOptions } from '@/lib/statusOptions';
import * as m from '@/paraglide/messages.js';
import { GoodsReceiveNote } from '@/lib/types';
import { grnSortFields } from '@/constants/fields';

interface GRNFiltersProps {
	search: string;
	setSearch: (value: string) => void;
	status: string;
	setStatus: (value: string) => void;
	statusOpen: boolean;
	setStatusOpen: (value: boolean) => void;
	grnData: GoodsReceiveNote[];
	setGrnData: (data: GoodsReceiveNote[]) => void;
}

export const GRNFilters: React.FC<GRNFiltersProps> = ({
	search,
	setSearch,
	status,
	setStatus,
	statusOpen,
	setStatusOpen,
	grnData,
	setGrnData,
}) => {
	return (
		<div className="filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${m.Search()} Goods Receive Note...`}
			/>
			<div className="all-center gap-2">
				<StatusSearchDropdown
					options={statusOptions}
					value={status}
					onChange={setStatus}
					open={statusOpen}
					onOpenChange={setStatusOpen}
				/>
				<Dialog>
					<DialogTrigger asChild>
						<Button variant="outline" size={'sm'} className="text-xs">
							<Filter className="h-4 w-4" />
							More Filters
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:w-[70vw] max-w-[60vw]">
						<FilterBuilder
							fields={grnSortFields.map(({ key, label }) => ({ value: key, label }))}
							onFilterChange={(filters) => {
								console.log(filters);
							}}
						/>
					</DialogContent>
				</Dialog>
				<SortDropDown
					fieldConfigs={grnSortFields}
					items={grnData}
					onSort={setGrnData}
				/>
			</div>
		</div>
	);
};
