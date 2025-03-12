'use client';

import React from 'react';
import { Badge } from '../ui-custom/is-active-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { TrashIcon } from 'lucide-react';
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
import SkeltonCardLoading from '@/components/ui-custom/Loading/SkeltonCardLoading';

type FieldValue = string | number | boolean | null | undefined;

export type RenderFunction<T> = (value: T[keyof T]) => React.ReactNode;

type SuccessCallback<T> = (updatedItem: T, oldItem: T) => void | Promise<void>;

export interface FieldConfig<T> {
	key: keyof T;
	label: string;
	type?: 'text' | 'badge' | 'custom';
	render?: RenderFunction<T>;
}

interface DeleteDialogProps {
	title?: string;
	description?: string;
	confirmLabel?: string;
}

interface DataCardProps<T extends Record<string, FieldValue>> {
	items: T[];
	fields: FieldConfig<T>[];
	idField: keyof T;
	onSuccess?: SuccessCallback<T>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onDelete?: (id: any) => void;
	isLoading?: boolean;
	loadingCount?: number;
	editComponent?: (props: {
		item: T;
		onSuccess: (updatedItem: T) => void;
	}) => React.ReactNode;
	deleteDialogProps?: DeleteDialogProps;
}

const DataCard = <T extends Record<string, FieldValue>>({
	items,
	fields,
	idField,
	onSuccess,
	onDelete,
	isLoading = false,
	loadingCount = 6,
	editComponent,
	deleteDialogProps = {
		title: 'Are you sure?',
		description: 'This action cannot be undone. This will permanently delete this item.',
		confirmLabel: 'Delete',
	},
}: DataCardProps<T>): React.ReactElement => {
	const renderLoadingSkeleton = (): React.ReactElement => (
		<div className="grid grid-cols-1 gap-4">
			{[...Array(loadingCount)].map((_, index) => (
				<SkeltonCardLoading key={index} />
			))}
		</div>
	);

	const renderField = (field: FieldConfig<T>, item: T): React.ReactNode => {
		const value = item[field.key];

		if (field.render) {
			return field.render(value);
		}

		switch (field.type) {
			case 'badge':
				if (typeof value === 'boolean') {
					return (
						<Badge variant={value ? 'default' : 'destructive'}>
							{value ? 'Active' : 'Inactive'}
						</Badge>
					);
				}
				return <Badge>{String(value)}</Badge>;

			default:
				return (
					<span className="text-sm font-medium">
						{String(value)}
					</span>
				);
		}
	};

	const handleDelete = (id: string): void => {
		if (onDelete) {
			onDelete(id);
		}
	};

	const handleSuccess = (updatedItem: T, originalItem: T): void => {
		if (onSuccess) {
			onSuccess(updatedItem, originalItem);
		}
	};

	if (isLoading) {
		return renderLoadingSkeleton();
	}

	return (
		<div className="grid grid-cols-1 gap-4">
			{items?.map((item) => (
				<Card
					key={String(item[idField])}
					className="hover:shadow-md transition-all"
				>
					<CardContent className="p-4">
						<div className="space-y-3">
							{fields.map((field) => (
								<div
									key={String(field.key)}
									className="grid grid-cols-10 gap-4"
								>
									<span className="text-sm text-muted-foreground col-span-3">
										{field.label}
									</span>
									<div className="col-span-7">
										{renderField(field, item)}
									</div>
								</div>
							))}
						</div>
					</CardContent>
					<CardFooter className="flex justify-end gap-2 pt-0 pb-2 px-2">
						{editComponent && editComponent({
							item,
							onSuccess: (updatedItem: T) => handleSuccess(updatedItem, item)
						})}
						{onDelete && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button variant="ghost" size="sm">
										<TrashIcon />
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
											onClick={() => handleDelete(String(item[idField]))}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											{deleteDialogProps.confirmLabel}
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</CardFooter>
				</Card>
			))}
		</div>
	);
};

export default DataCard;