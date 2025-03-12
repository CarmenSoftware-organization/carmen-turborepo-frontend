import SearchForm from '@/components/ui-custom/SearchForm';
import SortDropDown from '@/components/ui-custom/SortDropDown';
import StatusSearchDropdown from '@/components/ui-custom/StatusSearchDropdown';
import { prSortFields } from '@/constants/fields';
import { statusOptions } from '@/lib/statusOptions';
import { PrType } from '@/lib/types';
import { Search } from '@/paraglide/messages';
import React from 'react'

interface Props {
    search: string;
    setSearch: (value: string) => void;
    status: string;
    setStatus: (value: string) => void;
    statusOpen: boolean;
    setStatusOpen: (value: boolean) => void;
    prList: PrType[];
    setPrList: (data: PrType[]) => void;
}

const PrFilter: React.FC<Props> = ({
    search,
    setSearch,
    status,
    setStatus,
    statusOpen,
    setStatusOpen,
    prList,
    setPrList
}) => {
    return (
        <div className="filter-container">
            <SearchForm
                defaultValue={search}
                onSearch={setSearch}
                placeholder={`${Search()}..`}
            />
            <div className="all-center gap-2">
                <StatusSearchDropdown
                    options={statusOptions}
                    value={status}
                    onChange={setStatus}
                    open={statusOpen}
                    onOpenChange={setStatusOpen}
                />
                <SortDropDown
                    fieldConfigs={prSortFields}
                    items={prList}
                    onSort={setPrList}
                />
            </div>
        </div>
    );
}

export default PrFilter