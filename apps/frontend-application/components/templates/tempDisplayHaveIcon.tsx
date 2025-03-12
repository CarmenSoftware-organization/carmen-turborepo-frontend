'use client';

import React, { useEffect, useState } from 'react';
import { Badge } from '../ui-custom/is-active-badge';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Trash } from 'lucide-react';
import * as m from '@/paraglide/messages.js';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import PaginationComponent from '../PaginationComponent';
import { CardsContainerSkeleton } from '../ui-custom/Loading/CardsContainerSkeleton';
import { FieldConfig } from '@/lib/util/uiConfig';
import { TableBodySkeleton } from '../ui-custom/Loading/TableBodySkeleton';

// Type Definitions
export type SortDirection = 'asc' | 'desc';

export type FieldValue =
	| string
	| number
	| boolean
	| null
	| undefined
	| Record<string, string | number | boolean | null | undefined>;

export type SortQuery = `${string}:${SortDirection}`;

export type SuccessCallback<T> = (
	updatedItem: T,
	oldItem: T
) => void | Promise<void>;

export interface DeleteProps {
	title?: string;
	description?: string;
	confirmLabel?: string;
}

export interface DisplayComponentProps<T extends Record<string, FieldValue>> {
	items: T[];
	fields: FieldConfig<T>[];
	idField: keyof T;
	onSuccess?: SuccessCallback<T>;
	onDelete?: (id: string) => void;
	showIndex?: boolean;
	editComponent?: (props: {
		item: T;
		onSuccess: (updatedItem: T) => void;
	}) => React.ReactNode;
	deleteDialogProps?: DeleteProps;
	page: number;
	totalPage: number;
	setPage: (newPage: string) => void;
	pages?: string;
	sort?: string;
	onSortChange?: (sort: SortQuery) => void;
	isLoading?: boolean;
	'data-id'?: string;
}

interface SortButtonProps {
	field: string;
	label: string;
	currentSortField: string | null;
	currentSortDirection: SortDirection;
	onSort: (field: string) => void;
}

const SortButton: React.FC<SortButtonProps> = ({
	field,
	label,
	currentSortField,
	currentSortDirection,
	onSort,
}) => (
	<div className="flex items-center gap-1">
		<span>{label}</span>
		<Button
			variant="ghost"
			size="sm"
			className="h-6 w-6 p-0"
			onClick={() => onSort(field)}
		>
			{currentSortField === field ? (
				currentSortDirection === 'asc' ? (
					<ChevronUp className="h-4 w-4" />
				) : (
					<ChevronDown className="h-4 w-4" />
				)
			) : (
				<div className="flex flex-col -space-y-2">
					<ChevronUp className="h-3 w-3 opacity-50" />
					<ChevronDown className="h-3 w-3 opacity-50" />
				</div>
			)}
		</Button>
	</div>
);

const DisplayComponent = <T extends Record<string, FieldValue>>({
	items,
	fields,
	idField,
	onSuccess,
	onDelete,
	showIndex = true,
	editComponent,
	deleteDialogProps = {
		title: `${m.are_you_sure()}`,
		description: `${m.delete_dialog_des()}`,
		confirmLabel: `${m.delete_text()}`,
	},
	page,
	totalPage,
	setPage,
	pages,
	sort,
	onSortChange,
	isLoading = false,
	'data-id': dataId,
}: DisplayComponentProps<T>): React.ReactElement => {
	const [sortField, setSortField] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

	useEffect(() => {
		if (sort) {
			const [field, direction] = sort.split(':');
			setSortField(field);
			setSortDirection((direction as SortDirection) || 'asc');
		}
	}, [sort]);

	const renderField = (field: FieldConfig<T>, item: T): React.ReactNode => {
		const value = item[field.key];

		if (field.render) {
			return field.render(value, item);
		}

		switch (field.type) {
			case 'badge':
				if (typeof value === 'boolean') {
					return (
						<Badge variant={value ? 'default' : 'destructive'}>
							{value ? `${m.status_active()}` : `${m.status_inactive()}`}
						</Badge>
					);
				}
				return <Badge>{String(value)}</Badge>;

			default:
				return (
					<span className={`text-xs ${field.className || ''}`}>
						{String(value)}
					</span>
				);
		}
	};

	const renderActions = (item: T): React.ReactNode => (
		<div className="flex grow-0 justify-center">
			{editComponent &&
				editComponent({
					item,
					onSuccess: (updatedItem: T) => onSuccess?.(updatedItem, item),
				})}
			{onDelete && (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="ghost" size="sm">
							<Trash className="h-4 w-4" />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>{deleteDialogProps.title}</AlertDialogTitle>
							<AlertDialogDescription>
								{deleteDialogProps.description}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() => onDelete(String(item[idField]))}
								className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
							>
								{deleteDialogProps.confirmLabel}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			)}
		</div>
	);

	const handleSort = (field: string) => {
		const newDirection: SortDirection =
			sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

		setSortField(field);
		setSortDirection(newDirection);
		onSortChange?.(`${field}:${newDirection}` as SortQuery);
	};

	const handlePageChange = (newPage: number) => {
		const numericTotalPages = Number(pages);
		if (newPage < 1 || newPage > numericTotalPages) return;
		setPage(newPage.toString());
	};

	return (
		<div data-id={dataId}>
			{/* Mobile */}
			<div className="block md:hidden">
				<div className="flex items-center gap-2 mb-4 overflow-x-auto">
					{fields.map((field) => (
						<Button
							key={String(field.key)}
							variant="outline"
							size="sm"
							onClick={() => handleSort(String(field.key))}
						>
							{field.label}
							{sortField === field.key &&
								(sortDirection === 'asc' ? (
									<ChevronUp className="ml-1 h-4 w-4" />
								) : (
									<ChevronDown className="ml-1 h-4 w-4" />
								))}
						</Button>
					))}
				</div>
				<div className="grid grid-cols-1 gap-4">
					{isLoading ? (
						<CardsContainerSkeleton
							fields={fields.length}
							cards={5}
							withAction
						/>
					) : (
						<div className="grid grid-cols-1 gap-4">
							{items.map((item) => (
								<Card
									key={String(item[idField])}
									className="hover:shadow-md transition-all"
								>
									<CardContent className="p-4">
										<div className="space-y-4">
											{fields.map((field) => (
												<div
													key={String(field.key)}
													className="flex items-center"
												>
													<span className="w-[30%] text-xs font-medium">
														{field.label}:
													</span>
													<div className="w-[70%]">
														{renderField(field, item)}
													</div>
												</div>
											))}
										</div>
									</CardContent>
									<CardFooter className="flex justify-start gap-2 pt-0 pb-2 px-2">
										{renderActions(item)}
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Desktop */}
			<div className="hidden md:block">
				<Table>
					<TableHeader>
						<TableRow>
							{showIndex && <TableHead className="w-10">#</TableHead>}
							{fields.map((field) => (
								<TableHead
									key={String(field.key)}
									style={{ width: field.width }}
									className="text-xs"
								>
									<SortButton
										field={String(field.key)}
										label={field.label}
										currentSortField={sortField}
										currentSortDirection={sortDirection}
										onSort={handleSort}
									/>
								</TableHead>
							))}
							<TableHead className="text-center">{m.action_text()}</TableHead>
						</TableRow>
					</TableHeader>
					{isLoading ? (
						<TableBodySkeleton columns={fields.length} rows={10} withAction />
					) : (
						<TableBody>
							{items.map((item, index) => (
								<TableRow key={String(item[idField])}>
									{showIndex && <TableCell>{index + 1}</TableCell>}
									{fields.map((field) => (
										<TableCell
											key={String(field.key)}
											className={`text-${field.align || 'left'} ${
												field.className || ''
											}`}
										>
											{renderField(field, item)}
										</TableCell>
									))}
									<TableCell className="text-center w-1">
										{renderActions(item)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					)}
				</Table>
			</div>
			<PaginationComponent
				currentPage={page}
				totalPages={totalPage}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default DisplayComponent;
