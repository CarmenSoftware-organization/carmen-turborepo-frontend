'use client';


import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { useState, MouseEvent } from 'react';
import { Pencil, Trash } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import CategoryDialog from './CategoryDialog';
import { formType } from '@/constants/enums';
import { toastError } from '@/components/ui-custom/Toast';
import { ProductCategoryCreateModel } from '@/dtos/product-category.dto';

interface Props {
	products: ProductCategoryCreateModel[];
	selectedProduct: ProductCategoryCreateModel | null;
	onSelectCategory: (product: ProductCategoryCreateModel) => void;
	onDeleteCategory: (productId: string) => Promise<void>;
	onEditCategory: (
		productId: string,
		formData: ProductCategoryCreateModel
	) => Promise<void>;
}

const CategoryItemList: React.FC<Props> = ({
	products,
	selectedProduct,
	onSelectCategory,
	onDeleteCategory,
	onEditCategory,
}) => {
	const [productToDelete, setProductToDelete] =
		useState<ProductCategoryCreateModel>();
	const [editDialogOpen, setEditDialogOpen] = useState(false);
	const [productToEdit, setProductToEdit] =
		useState<ProductCategoryCreateModel | null>(null);

	const handleDeleteClick = (
		e: MouseEvent,
		product: ProductCategoryCreateModel
	) => {
		e.stopPropagation();
		setProductToDelete(product);
	};

	const handleEditClick = (
		e: MouseEvent,
		product: ProductCategoryCreateModel
	) => {
		e.stopPropagation();
		setProductToEdit(product);
		setEditDialogOpen(true);
	};

	const handleDelete = async () => {
		if (!productToDelete?.id) return;
		try {
			await onDeleteCategory(productToDelete.id);
			setProductToDelete(undefined);
		} catch (error) {
			console.error('Error deleting product:', error);
			toastError({ message: 'Failed to delete product' });
		}
	};

	const handleEdit = async (formData: ProductCategoryCreateModel) => {
		if (!productToEdit?.id) return;
		await onEditCategory(productToEdit.id, formData);
		setEditDialogOpen(false);
	};

	const categoryListItems = products.map((category) => (
		<div key={category.id} className="flex items-center p-1 justify-between">
			<div
				className={cn(
					'cursor-pointer hover:bg-accent rounded-lg p-1 w-full',
					selectedProduct?.id === category.id && 'bg-accent'
				)}
				onClick={() => onSelectCategory(category)}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						onSelectCategory(category);
					}
				}}
				aria-label={`Select ${category.name} category`}
				aria-selected={selectedProduct?.id === category.id}
			>
				<span className="text-xs">{category.name}</span>
			</div>
			<div className="flex">
				<Button
					variant="ghost"
					size={'sm'}
					onClick={(e) => handleEditClick(e, category)}
					aria-label={`Edit ${category.name}`}
				>
					<Pencil />
				</Button>
				<Button
					variant="ghost"
					size={'sm'}
					onClick={(e) => handleDeleteClick(e, category)}
					aria-label={`Delete ${category.name}`}
				>
					<Trash />
				</Button>
			</div>
		</div>
	));

	return (
		<>
			<Card className="">
				<CardContent className="p-2">{categoryListItems}</CardContent>
			</Card>
			<AlertDialog
				open={!!productToDelete}
				onOpenChange={(open) =>
					setProductToDelete(open ? productToDelete : undefined)
				}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This will permanently delete &quot;{productToDelete?.name}&quot;.
							This action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-600 text-white"
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			<CategoryDialog
				open={editDialogOpen}
				onOpenChange={setEditDialogOpen}
				onSubmit={handleEdit}
				initialData={
					productToEdit
						? {
								code: productToEdit.code,
								name: productToEdit.name,
								description: productToEdit.description || '',
								is_active: productToEdit.is_active ?? true,
							}
						: undefined
				}
				mode={formType.EDIT}
			/>
		</>
	);
};

export default CategoryItemList;
