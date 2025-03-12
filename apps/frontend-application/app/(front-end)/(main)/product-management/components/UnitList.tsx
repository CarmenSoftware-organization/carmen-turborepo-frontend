'use client';

import React, { useEffect, useState } from 'react';
import UnitDialog from './UnitDialog';
import { useURL } from '@/hooks/useURL';
import DisplayComponent from '@/components/templates/DisplayComponent';
import { SortQuery } from '@/lib/util/uiConfig';
import { UnitCreateModel } from '@/dtos/unit.dto';
import ErrorCard from '@/components/ui-custom/error/ErrorCard';
import { unitFields } from '@/constants/fields';
import UnitFilter from './UnitFilter';
import { unit } from '@/paraglide/messages.js';
import UnitAction from './UnitAction';
import { formType } from '@/constants/enums';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Comment } from './Comment';
import { useUnit } from '@/hooks/useUnit';

const UnitList = () => {
	const [statusOpen, setStatusOpen] = useState(false);
	const [isCommentOpen, setIsCommentOpen] = useState(false);
	const [search, setSearch] = useURL('search');
	const [status, setStatus] = useURL('status');
	const [page, setPage] = useURL('page');
	const [pages, setPages] = useURL('pages');
	const [sort, setSort] = useURL('sort');

	const { units, isLoading, error, handleSuccess, handleDelete } = useUnit();

	useEffect(() => {
		if (!isLoading && units.length > 0) {
			// This assumes your hook is returning the current page and total pages
			// If not, you'll need to adjust this logic
			setPages(pages);
		}
	}, [isLoading, units]);

	const handleToggleComment = () => {
		setIsCommentOpen(prev => !prev);
	};

	if (error) {
		return <ErrorCard message={error} data-id="unit-list-error-card" />;
	}

	return (
		<div className='p-6'>
			<div className='sticky top-0 z-50 bg-background'>
				<div className="md:flex justify-between items-start">
					<h1 className="text-2xl font-semibold">{unit()}</h1>
					<div className="mt-4 md:mt-0">
						<UnitAction handleSuccess={handleSuccess} data-id="unit-list-action-button" />
					</div>
				</div>
				<UnitFilter
					search={search}
					setSearch={setSearch}
					status={status}
					setStatus={setStatus}
					statusOpen={statusOpen}
					setStatusOpen={setStatusOpen}
					sort={sort}
					setSort={setSort}
					data-id="unit-list-filter"
				/>

				<div className='flex justify-end'>
					<Button
						variant="outline"
						size={'sm'}
						onClick={handleToggleComment}
						onKeyDown={(e) => e.key === 'Enter' && handleToggleComment()}
						tabIndex={0}
						aria-label={isCommentOpen ? "Close comment section" : "Open comment section"}
					>
						{isCommentOpen ? <X /> : "Comment"}
					</Button>
				</div>
			</div>
			<div className="flex w-full">
				<div className={`${isCommentOpen ? 'w-3/4' : 'w-full'} transition-all duration-300`}>
					<DisplayComponent<UnitCreateModel>
						items={units}
						fields={unitFields}
						idField="id"
						onSuccess={handleSuccess}
						onDelete={handleDelete}
						editComponent={({ item, onSuccess }) => (
							<UnitDialog
								mode={formType.EDIT}
								defaultValues={item}
								onSuccess={onSuccess}
							/>
						)}
						page={+page}
						totalPage={+pages}
						setPage={setPage}
						sort={sort}
						onSortChange={(newSort: SortQuery) => {
							setSort(newSort);
						}}
						isLoading={isLoading}
						data-id="unit-list-display-component"
					/>
				</div>

				{isCommentOpen && (
					<div className="w-1/4 border-l flex flex-col" style={{ height: 'calc(80vh - 220px)' }}>
						<Comment />
					</div>
				)}


			</div>
		</div>
	);
};

export default UnitList;
