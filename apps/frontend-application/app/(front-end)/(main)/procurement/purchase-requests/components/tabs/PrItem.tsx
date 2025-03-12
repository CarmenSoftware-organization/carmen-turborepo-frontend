import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PurchaseRequestItem } from '@/lib/types';
import { CheckCircle, Edit2Icon, Eye, ImageIcon, Plus, RotateCcw, Split, Trash2Icon, X, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ItemDetailsEditForm from './item-details/ItemDetailsEditForm';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { toastError, toastSuccess } from '@/components/ui-custom/Toast';
import { formType } from '@/constants/enums';

// Define table header structure
type TableHeaderConfig = {
	key: string;
	label: string | React.ReactNode;
	className?: string;
	width?: string;
};

interface Props {
	mode: formType;
}

const PrItem = ({ mode }: Props) => {
	const [items, setItems] = useState<PurchaseRequestItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedItem, setSelectedItem] = useState<PurchaseRequestItem | null>(
		null
	);
	const [isEditFormOpen, setIsEditFormOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<string[]>([]);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<string | null>(null);

	// Define the function before using it in tableHeaders
	const handleSelectAllItems = () => {
		setSelectedItems((prev) =>
			prev.length === items.length ? [] : items.map((item) => item.id ?? '')
		);
	};

	// Now define table headers configuration
	const tableHeaders: TableHeaderConfig[] = [
		...(mode !== formType.VIEW
			? [
					{
						key: 'checkbox',
						label: (
							<Checkbox
								checked={
									selectedItems.length === items.length && items.length > 0
								}
								onCheckedChange={handleSelectAllItems}
								aria-label={
									selectedItems.length === items.length
										? 'Deselect all items'
										: 'Select all items'
								}
								tabIndex={0}
							/>
						),
						className: 'w-[40px] h-fit align-center',
					},
				]
			: []),
		{ key: 'location', label: 'Location', className: 'align-center' },
		{ key: 'product', label: 'Product', className: 'align-center' },
		{
			key: 'unit',
			label: (
				<div className="text-xs flex-col gap-2 justify-between items-center">
					<div className="text-center">Order Unit</div>
					<Separator />
					<div className="text-nowrap text-center">Inv. Unit</div>
				</div>
			),
			className: 'text-xs flex-col gap-2 justify-between items-center',
		},
		{
			key: 'request',
			label: (
				<div className="text-xs flex-col gap-2 justify-between items-center">
					<div className="text-center">Request</div>
					<Separator /> <div className="text-center">On Order</div>
				</div>
			),
			className: 'text-xs flex-col gap-2 justify-between items-center',
		},
		{
			key: 'approve',
			label: (
				<div className="text-xs flex-col gap-2 justify-between items-center">
					<div className="text-center">Approve</div>
					<Separator />
					<div className="text-nowrap text-center">On Hand</div>
				</div>
			),
			className: 'text-xs flex-col gap-2 justify-between items-center',
		},
		{
			key: 'currency',
			label: (
				<div className="text-xs flex-col gap-2 justify-between items-center">
					<div className="text-center">Curr.</div>
					<Separator />
					<div className="text-nowrap text-center">Base</div>
				</div>
			),
			className: 'text-xs flex-col gap-2 justify-between items-center',
		},
		{
			key: 'price',
			label: (
				<div className="text-xs flex-col gap-2 justify-between items-center">
					<div className="text-center">Price</div>
					<Separator />
					<div className="text-nowrap text-center">Last Price</div>
				</div>
			),
			className: 'text-xs flex-col gap-2 justify-between items-center',
		},
		{ key: 'total', label: 'Total', className: 'align-center' },
		{ key: 'status', label: 'Status', className: 'align-center' },
		{ key: 'actions', label: 'Actions', className: 'text-right align-center' },
	];

	useEffect(() => {
		const fetchItems = async () => {
			try {
				setIsLoading(true);
				const response = await fetch(
					'/api/procurement/purchase-requests/item-detail'
				);

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}

				const result = await response.json();
				setItems(result.data);
			} catch (err) {
				console.error('Error fetching items:', err);
				toastError({ message: 'Error fetching items' });
			} finally {
				setIsLoading(false);
			}
		};

		fetchItems();
	}, []);

	const handleSelectItem = (itemId: string) => {
		setSelectedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((id) => id !== itemId)
				: [...prev, itemId]
		);
	};

	const handleOpenItemForm = (item: PurchaseRequestItem | null) => {
		setSelectedItem(item);
		setIsEditFormOpen(true);
	};

	const handleCloseItemForm = () => {
		setSelectedItem(null);
		setIsEditFormOpen(false);
	};

	const handleSaveItem = (formData: PurchaseRequestItem) => {
		handleCloseItemForm();
		setItems((prevItems) => {
			if (formData.id) {
				// Update existing item
				return prevItems.map((item) =>
					item.id === formData.id ? formData : item
				);
			} else {
				// Add new item
				const newItem = { ...formData, id: Date.now().toString() };
				toastSuccess({ message: 'Item added successfully' });
				return [...prevItems, newItem];
			}
		});
	};

	const handleBulkAction = (action: 'Accepted' | 'Rejected' | 'Review') => {
		if (selectedItems.length === 0) {
			toastError({
				message: 'Please select at least one item to perform this action.',
			});
			return;
		}

		const updatedItems = items.map((item) =>
			selectedItems.includes(item.id ?? '') ? { ...item, status: action } : item
		);
		setItems(updatedItems);
		setSelectedItems([]);

		toastSuccess({
			message: `${selectedItems.length} items have been marked as ${action}.`,
		});
	};

	const handleSplitItems = () => {
		if (selectedItems.length === 0) {
			toastError({ message: 'Please select at least one item to split.' });
			return;
		}

		console.log('Splitting items:', selectedItems);
		toastError({ message: 'This feature is not yet implemented.' });
	};

	const handleOpenDeleteDialog = (itemId: string) => {
		setItemToDelete(itemId);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteItem = () => {
		if (!itemToDelete) return;

		setItems((prevItems) =>
			prevItems.filter((item) => item.id !== itemToDelete)
		);
		setIsDeleteDialogOpen(false);
		setItemToDelete(null);

		toastSuccess({ message: 'The item has been removed successfully.' });
	};

	const renderItemCell = (item: PurchaseRequestItem, columnKey: string) => {
		switch (columnKey) {
			case 'checkbox':
				return mode !== formType.VIEW ? (
					<Checkbox
						checked={selectedItems.includes(item.id ?? '')}
						onCheckedChange={() => handleSelectItem(item.id ?? '')}
						aria-label={`Select item ${item.name}`}
						tabIndex={0}
					/>
				) : null;
			case 'location':
				return item.location;
			case 'product':
				return (
					<>
						<div>{item.name}</div>
						<div className="text-xs text-muted-foreground mt-1">
							{item.description}
						</div>
					</>
				);
			case 'unit':
				return (
					<div className="text-right align-top">
						<div>{item.unit}</div>
						<div className="text-xs text-muted-foreground">
							{item.inventoryInfo?.inventoryUnit || item.unit}
						</div>
					</div>
				);
			case 'request':
				return (
					<div className="text-right align-top">
						<div>{item.quantityRequested.toLocaleString()}</div>
						<div className="text-xs text-muted-foreground">
							{item.inventoryInfo.onOrdered.toLocaleString()}
						</div>
					</div>
				);
			case 'approve':
				return (
					<div className="text-right align-top">
						<div>{item.quantityApproved.toLocaleString()}</div>
						<div className="text-xs text-muted-foreground">
							{item.inventoryInfo.onHand.toLocaleString()}
						</div>
					</div>
				);
			case 'currency':
				return (
					<div className="text-right align-top">
						<div>{item.currency}</div>
						<div className="text-xs text-muted-foreground">
							{item.currency || 'THB'}
						</div>
					</div>
				);
			case 'price':
				return (
					<div className="text-right align-top">
						<div>{item.price.toFixed(2)}</div>
						<div className="text-xs text-muted-foreground">
							{item.inventoryInfo.lastPrice.toFixed(2)}
						</div>
					</div>
				);
			case 'total':
				return (
					<div className="text-right align-top">
						<div>
							{item.totalAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</div>
						<div className="text-xs text-muted-foreground">
							{item.baseTotalAmount.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</div>
					</div>
				);
			case 'status':
				return (
					<Badge
						className={
							item.status === 'Accepted'
								? 'bg-green-100 text-green-800'
								: item.status === 'Rejected'
									? 'bg-red-100 text-red-800'
									: 'bg-yellow-100 text-yellow-800'
						}
					>
						{item.status ?? 'Pending'}
					</Badge>
				);
			case 'actions':
				return (
					<div className="flex justify-end space-x-2">
						{mode === formType.EDIT && selectedItem?.id === item.id ? (
							<>
								<Button
									variant="default"
									size="icon"
									onClick={() => {
										if (selectedItem) handleSaveItem(selectedItem);
									}}
									aria-label="Save changes"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											if (selectedItem) handleSaveItem(selectedItem);
										}
									}}
								>
									<CheckCircle className="h-4 w-4" />
								</Button>
								<Button
									variant="outline"
									size="icon"
									onClick={handleCloseItemForm}
									aria-label="Cancel editing"
									tabIndex={0}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											handleCloseItemForm();
										}
									}}
								>
									<X className="h-4 w-4" />
								</Button>
							</>
						) : (
							<>
								{mode !== formType.VIEW && (
									<>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="outline"
														size="icon"
														onClick={() => handleOpenItemForm(item)}
														aria-label={`Edit item ${item.name}`}
														tabIndex={0}
														onKeyDown={(e) => {
															if (e.key === 'Enter' || e.key === ' ') {
																e.preventDefault();
																handleOpenItemForm(item);
															}
														}}
													>
														<Edit2Icon className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Edit item</TooltipContent>
											</Tooltip>
										</TooltipProvider>

										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														variant="outline"
														size="icon"
														onClick={(e) => {
															e.preventDefault();
															handleOpenDeleteDialog(item.id ?? '');
														}}
														aria-label={`Delete item ${item.name}`}
														tabIndex={0}
													>
														<Trash2Icon className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>Delete item</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</>
								)}

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												onClick={(e) => {
													e.preventDefault();
													handleOpenItemForm(item);
												}}
												aria-label={`View item ${item.name} details`}
												tabIndex={0}
											>
												<Eye className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>View details</TooltipContent>
									</Tooltip>
								</TooltipProvider>

								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												aria-label={`View images for ${item.name}`}
												tabIndex={0}
											>
												<ImageIcon className="h-4 w-4" />
											</Button>
										</TooltipTrigger>
										<TooltipContent>View images</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	if (isLoading) {
		return (
			<div className="space-y-3 p-3">
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
				<Skeleton className="h-8 w-full" />
			</div>
		);
	}

	return (
		<div className="p-3">
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-lg font-semibold">Item Details</h2>
				{mode !== formType.VIEW && (
					<Button
						onClick={(e) => {
							e.preventDefault();
							handleOpenItemForm(null);
						}}
						size="sm"
						aria-label="Add new item"
						tabIndex={0}
					>
						<Plus />
						Add Item
					</Button>
				)}
			</div>

			{selectedItems.length > 0 && mode !== formType.VIEW && (
				<div className="flex flex-wrap gap-2 mb-4 p-2 bg-muted/20 rounded-md">
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleBulkAction('Accepted');
									}}
									size="sm"
									aria-label="Accept selected items"
									tabIndex={0}
								>
									<CheckCircle />
									Accept Selected
								</Button>
							</TooltipTrigger>
							<TooltipContent>Mark selected items as accepted</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleBulkAction('Rejected');
									}}
									size="sm"
									variant="destructive"
									aria-label="Reject selected items"
									tabIndex={0}
								>
									<XCircle />
									Reject Selected
								</Button>
							</TooltipTrigger>
							<TooltipContent>Mark selected items as rejected</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleBulkAction('Review');
									}}
									size="sm"
									variant="outline"
									aria-label="Review selected items"
									tabIndex={0}
								>
									<RotateCcw />
									Review Selected
								</Button>
							</TooltipTrigger>
							<TooltipContent>Mark selected items for review</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									onClick={(e) => {
										e.preventDefault();
										handleSplitItems();
									}}
									size="sm"
									variant="outline"
									aria-label="Split selected items"
									tabIndex={0}
								>
									<Split />
									Split Selected
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								Split selected items into multiple requests
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>

					<div className="ml-auto flex items-center text-xs text-muted-foreground">
						{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}{' '}
						selected
					</div>
				</div>
			)}

			<div className="rounded-md border overflow-hidden">
				<Table>
					<TableHeader>
						<TableRow className="h-6">
							{tableHeaders.map((header) => (
								<TableHead key={header.key} className={header.className}>
									{header.label}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>

					<TableBody>
						{items.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={tableHeaders.length}
									className="h-24 text-center"
								>
									No items found. Click &quot;Add Item&quot; to create a new
									item.
								</TableCell>
							</TableRow>
						) : (
							items.map((item) => (
								<TableRow key={item.id}>
									{tableHeaders.map((header) => (
										<TableCell key={`${item.id}-${header.key}`}>
											{renderItemCell(item, header.key)}
										</TableCell>
									))}
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
				<DialogContent className="sm:max-w-[80vw] max-w-[80vw] p-0 border-none overflow-y-auto [&>button]:hidden">
					<div className="rounded-lg overflow-y-auto">
						<ItemDetailsEditForm
							onSave={handleSaveItem}
							onCancel={handleCloseItemForm}
							initialData={selectedItem || undefined}
							mode={mode}
						/>
					</div>
				</DialogContent>
			</Dialog>

			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Confirm Deletion</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this item? This action cannot be
							undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="flex space-x-2 justify-end">
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button variant="destructive" onClick={handleDeleteItem}>
							Delete
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default PrItem;