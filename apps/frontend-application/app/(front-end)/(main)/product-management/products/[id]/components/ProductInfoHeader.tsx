import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Save, Trash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import PrimaryUnitField from './PrimaryUnitField';
import { fetchItemGroup } from '@/services/item_group';
import { getProductGroup } from '@/services/products';

interface ProductInfo {
	price?: string;
	tax_type?: string;
	tax_rate?: string;
	price_deviation_limit?: string;
}

interface ProductData {
	id?: string;
	name?: string;
	code?: string;
	description?: string;
	product_status_type?: string;
	product_category?: { name: string; id: string };
	product_subcategory?: { name: string; id: string };
	product_item_group?: { name: string; id: string };
	product_primary_unit?: { name: string; id: string };
	product_info?: ProductInfo;
}

interface Props {
	product?: ProductData;
	isEditing: boolean;
	token: string;
	tenantId: string;
	handleChange: (path: string, value: string | number) => void;
	handleSave: () => void;
	handleCancel: () => void;
	handleEdit: () => void;
	handleDelete?: () => void;
}

const ProductInfoHeader = ({
	product,
	isEditing,
	token,
	tenantId,
	handleChange,
	handleSave,
	handleCancel,
	handleEdit,
	handleDelete,
}: Props) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [itemGroups, setItemGroups] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [selectedItemGroup, setSelectedItemGroup] = useState<any>(null);

	const fetchItemGroups = async () => {
		try {
			setLoading(true);
			const result = await fetchItemGroup(token, tenantId);
			if (result?.data) {
				setItemGroups(result.data.data || []);
			}
		} catch (error) {
			console.error('Error fetching item groups:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleItemGroupSelect = async (itemGroupId: string) => {
		try {
			setLoading(true);
			const result = await getProductGroup(token, tenantId, itemGroupId);
			if (result?.data) {
				setSelectedItemGroup(result.data);
			}
		} catch (error) {
			console.error('Error fetching item group details:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (isEditing) {
			fetchItemGroups();
		}
	}, [isEditing]);

	const handleInputChange = (path: string, value: string) => {
		console.log('Input change:', path, value);
		handleChange(`data.${path}`, value);
	};

	const ActionButtons = () => (
		<div className="flex items-center gap-2">
			{isEditing ? (
				<>
					<Button
						onClick={handleSave}
						size="sm"
						variant="ghost"
						aria-label="Save changes"
					>
						<Save className="h-4 w-4" />
					</Button>
					<Button
						onClick={handleCancel}
						variant="outline"
						size="sm"
						aria-label="Cancel editing"
					>
						Cancel
					</Button>
				</>
			) : (
				<>
					<Button
						onClick={handleEdit}
						size="sm"
						variant="ghost"
						aria-label="Edit product"
					>
						<Pencil className="h-4 w-4" />
					</Button>
					{handleDelete && (
						<Button
							onClick={handleDelete}
							size="sm"
							variant="ghost"
							aria-label="Delete product"
						>
							<Trash className="h-4 w-4" />
						</Button>
					)}
				</>
			)}
		</div>
	);

	return (
		<Card>
			<CardContent className="py-4">
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								{isEditing ? (
									<Input
										className="text-xl font-bold w-64"
										value={product?.name || ''}
										onChange={(e) => {
											console.log('Name input change:', e.target.value);
											handleInputChange('name', e.target.value);
										}}
										aria-label="Product name"
									/>
								) : (
									<div
										className="text-xl font-bold"
										role="heading"
										aria-level={1}
									>
										{product?.name}
									</div>
								)}
								<Badge>{product?.product_status_type}</Badge>
							</div>
							<p className="text-muted-foreground text-xs">{product?.code}</p>
						</div>
						<ActionButtons />
					</div>
					<div className="border-t grid grid-cols-3 gap-4 py-4 text-xs">
						<div>
							<p className="text-muted-foreground">Category</p>
							{loading ? (
								<Skeleton className="h-4 w-[200px]" />
							) : (
								<p>
									{selectedItemGroup?.category?.name ||
										product?.product_category?.name ||
										'N/A'}
								</p>
							)}
						</div>
						<div>
							<p className="text-muted-foreground">Sub Category</p>
							{loading ? (
								<Skeleton className="h-4 w-[200px]" />
							) : (
								<p>
									{selectedItemGroup?.sub_category?.name ||
										product?.product_subcategory?.name ||
										'N/A'}
								</p>
							)}
						</div>
						<div>
							<p className="text-muted-foreground">Item Group</p>
							{loading ? (
								<Skeleton className="h-4 w-[200px]" />
							) : isEditing ? (
								<Select
									disabled={loading}
									value={
										selectedItemGroup?.id ||
										product?.product_item_group?.id ||
										''
									}
									onValueChange={(itemGroupId) =>
										handleItemGroupSelect(itemGroupId)
									}
								>
									<SelectTrigger className="text-xs">
										<SelectValue placeholder="Select item group" />
									</SelectTrigger>
									<SelectContent>
										{itemGroups.map((group) => (
											<SelectItem key={group.id} value={group.id}>
												{group.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							) : (
								<p>{product?.product_item_group?.name || 'N/A'}</p>
							)}
						</div>
						<div>
							<p className="text-muted-foreground">Description</p>
							{isEditing ? (
								<Textarea
									className="min-h-[60px] text-xs"
									value={product?.description || ''}
									onChange={(e) => {
										console.log('Description change:', e.target.value);
										handleInputChange('description', e.target.value);
									}}
									aria-label="Description"
								/>
							) : (
								<p>{product?.description}</p>
							)}
						</div>
						<div>
							<p className="text-muted-foreground">Primary Unit</p>
							<PrimaryUnitField
								unitName={product?.product_primary_unit?.name}
								isEditing={isEditing}
								token={token}
								tenantId={tenantId}
								handleChange={handleChange}
							/>

						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default ProductInfoHeader;
