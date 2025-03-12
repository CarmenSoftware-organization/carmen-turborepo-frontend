'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { Pencil, Trash } from 'lucide-react';
import ItemGroupDialog from './ItemGroupDialog';
import { useAuth } from '@/app/context/AuthContext';
import { cn } from '@/lib/utils';
import { formType } from '@/constants/enums';
import { deleteItemGroup } from '../actions/item_group';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { ProductItemGroupCreateModel } from '@/dtos/product-item-group.dto';

interface Props {
	data: ProductItemGroupCreateModel[];
	setData: React.Dispatch<React.SetStateAction<ProductItemGroupCreateModel[]>>;
	subCategoryId: string;
	subCategoryName: string;
	onSelectItemGroup: (itemGroup: ProductItemGroupCreateModel) => void;
}

const ItemGroupList: React.FC<Props> = ({
	data,
	setData,
	subCategoryId,
	subCategoryName,
	onSelectItemGroup,
}) => {
	const { accessToken } = useAuth();
	const token = accessToken || '';
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [itemGroup, setItemGroup] =
		useState<ProductItemGroupCreateModel | null>(null);
	const [idToDelete, setIdToDelete] = useState<string | null>(null);
	const [selectedItemGroupId, setSelectedItemGroupId] = useState<string | null>(
		null
	);

	useEffect(() => {
		setSelectedItemGroupId(null);
		setItemGroup(null);
		onSelectItemGroup({
			id: '',
			name: '',
			code: '',
			description: '',
			is_active: true,
			product_subcategory_id: '',
		});
	}, [subCategoryId, onSelectItemGroup]);

	const handleEditClick = (itemGroup: ProductItemGroupCreateModel) => {
		setItemGroup(itemGroup);
		setIsEditDialogOpen(true);
	};

	const handleDeleteItemGroup = async () => {
		if (!idToDelete) return;
		try {
			const response = await deleteItemGroup(token, idToDelete);
			if (!response.ok) {
				throw new Error('Failed to delete item group.');
			}

			setData((prev) =>
				prev.filter((itemGroup) => itemGroup.id !== idToDelete)
			);
			toastSuccess({ message: 'Item group deleted successfully' });
			setIdToDelete(null);
		} catch (error) {
			console.log('Error deleting item group:', error);
			toastError({ message: 'Failed to delete item group' });
		}
	};

	const itemGroupListItems = data.map((itemGroup) => (
		<div key={itemGroup.id} className="flex items-center p-1 justify-between">
			<div
				className={cn(
					'cursor-pointer hover:bg-accent rounded-lg p-1 w-full',
					selectedItemGroupId === itemGroup.id && 'bg-accent'
				)}
				onClick={() => {
					setSelectedItemGroupId(itemGroup.id || null);
					setItemGroup(itemGroup);
					onSelectItemGroup(itemGroup);
				}}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (['Enter', ' '].includes(e.key)) {
						setSelectedItemGroupId(itemGroup.id || null);
						setItemGroup(itemGroup);
						onSelectItemGroup(itemGroup);
					}
				}}
				aria-label={`Select ${itemGroup.name} item group`}
				aria-selected={selectedItemGroupId === itemGroup.id}
			>
				<span className="text-xs">{itemGroup.name}</span>
			</div>
			<div className="flex">
				<Button
					variant="ghost"
					size={'sm'}
					aria-label="Edit item group"
					onClick={() => handleEditClick(itemGroup)}
				>
					<Pencil />
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button
							variant="ghost"
							size={'sm'}
							aria-label="Delete item group"
							onClick={() => setIdToDelete(itemGroup.id || '')}
						>
							<Trash />
						</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete the
								item group &quot;{data.find((sc) => sc.id === idToDelete)?.name}
								&quot;.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={handleDeleteItemGroup}
								className="bg-red-500 hover:bg-red-600 text-white"
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	));

	return (
		<>
			<Card>
				<CardContent className="p-2">{itemGroupListItems}</CardContent>
			</Card>
			<ItemGroupDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				mode={formType.EDIT}
				itemGroup={itemGroup}
				setItemGroup={setData}
				subcategory_id={subCategoryId}
				subcategory_name={subCategoryName}
			/>
		</>
	);
};

export default ItemGroupList;
