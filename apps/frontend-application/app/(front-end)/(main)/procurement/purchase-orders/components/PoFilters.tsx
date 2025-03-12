import { FilterBuilder } from '@/components/ui-custom/FilterBuilder';
import SearchForm from '@/components/ui-custom/SearchForm';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PoField } from '@/constants/enums';
import { poSortFields } from '@/constants/fields';
import { statusOptions } from '@/lib/statusOptions';
import { PurchaseOrderType } from '@/lib/types';
import { Search } from '@/paraglide/messages';
import { Filter } from 'lucide-react';
import React from 'react';

interface Props {
	search: string;
	setSearch: (value: string) => void;
	status: string;
	setStatus: (value: string) => void;
	statusOpen: boolean;
	setStatusOpen: (value: boolean) => void;
	poData: PurchaseOrderType[];
	setPoData: (data: PurchaseOrderType[]) => void;
}

const PoFilters: React.FC<Props> = ({
	search,
	setSearch,
	status,
	setStatus,
	statusOpen,
	setStatusOpen,
	poData,
	setPoData,
}) => {
	return (
		<div className="filter-container">
			<SearchForm
				onSearch={setSearch}
				defaultValue={search}
				placeholder={`${Search()} Goods Receive Note...`}
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
							fields={[
								{ value: PoField.Number, label: 'Number' },
								{ value: PoField.VendorName, label: 'Vendor Name' },
								{ value: PoField.OrderDate, label: 'Order Date' },
								{ value: PoField.Status, label: 'Status' },
							]}
							onFilterChange={(filters) => {
								console.log(filters);
							}}
						/>
					</DialogContent>
				</Dialog>
				<SortDropDown
					fieldConfigs={poSortFields}
					items={poData}
					onSort={setPoData}
				/>
			</div>
		</div>
	);
};
export default PoFilters;
