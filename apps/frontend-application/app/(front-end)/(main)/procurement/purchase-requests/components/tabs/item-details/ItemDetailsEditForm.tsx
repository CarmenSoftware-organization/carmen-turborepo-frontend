import React, { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PurchaseRequestItem } from '@/lib/types';
import { Edit, X } from 'lucide-react';
import { formType } from '@/constants/enums';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form } from '@/components/ui/form';
import PricingInformation from './PricingInformation';
import QuantityAndDelivery from './QuantityAndDelivery';
import VendorInformation from './VendorInformation';
import BasicInformation from './BasicInformation';
import { useLocation } from '@/hooks/useLocation';
import { useUnit } from '@/hooks/useUnit';
import { useVendor } from '@/hooks/useVendor';
import { useProduct } from '@/hooks/useProduct';
import { useCurrency } from '@/hooks/useCurrency';

interface ItemDetailsFormProps {
	onSave: (formData: PurchaseRequestItem) => void;
	onCancel: () => void;
	onDelete?: () => void;
	initialData?: Partial<PurchaseRequestItem>;
	mode: formType.ADD | formType.EDIT | formType.VIEW;
}

const itemDetailsSchema = z.object({
	id: z.string().optional(),
	status: z.string().default('Pending'),
	location: z.string().min(1, { message: 'Location is required' }),
	name: z.string().min(1, { message: 'Product name is required' }),
	description: z.string().optional(),
	unit: z.string().min(1, { message: 'Unit is required' }),
	quantityRequested: z
		.number()
		.min(0, { message: 'Quantity must be 0 or greater' }),
	quantityApproved: z
		.number()
		.min(0, { message: 'Quantity must be 0 or greater' })
		.optional(),
	deliveryDate: z.date(),
	deliveryPoint: z.string().optional(),
	currency: z.string().optional(),
	currencyRate: z.number().default(1),
	price: z.number().min(0).default(0),
	foc: z.number().min(0).default(0),
	netAmount: z.number().min(0).default(0),
	adjustments: z.object({
		discount: z.boolean().default(false),
		tax: z.boolean().default(false),
	}),
	taxIncluded: z.boolean().default(false),
	discountRate: z.number().min(0).default(0),
	discountAmount: z.number().min(0).default(0),
	taxRate: z.number().min(0).default(0),
	taxAmount: z.number().min(0).default(0),
	totalAmount: z.number().min(0).default(0),
	vendor: z.string().optional(),
	pricelistNumber: z.string().optional(),
	comment: z.string().optional(),
	createdBy: z.string().optional(),
	createdDate: z.date().optional(),
	updatedBy: z.string().optional(),
	updatedDate: z.date().optional(),
	itemCategory: z.string().optional(),
	itemSubcategory: z.string().optional(),
	inventoryInfo: z.object({
		onHand: z.number().default(0),
		onOrdered: z.number().default(0),
		reorderLevel: z.number().default(0),
		restockLevel: z.number().default(0),
		averageMonthlyUsage: z.number().default(0),
		lastPrice: z.number().default(0),
		lastOrderDate: z.date().optional(),
		lastVendor: z.string().optional(),
		inventoryUnit: z.string().optional(),
	}),
	accountCode: z.string().optional(),
	jobCode: z.string().optional(),
	baseSubTotalPrice: z.number().default(0),
	subTotalPrice: z.number().default(0),
	baseNetAmount: z.number().default(0),
	baseDiscAmount: z.number().default(0),
	baseTaxAmount: z.number().default(0),
	baseTotalAmount: z.number().default(0),
});

type ItemDetailsFormValues = z.infer<typeof itemDetailsSchema>;

const defaultValue: PurchaseRequestItem = {
	id: '',
	status: 'Pending',
	location: '',
	name: '',
	description: '',
	unit: '',
	quantityRequested: 0,
	quantityApproved: 0,
	deliveryDate: new Date(),
	deliveryPoint: '',
	currency: '',
	currencyRate: 1,
	price: 0,
	foc: 0,
	netAmount: 0,
	adjustments: {
		discount: false,
		tax: false,
	},
	taxIncluded: false,
	discountRate: 0,
	discountAmount: 0,
	taxRate: 0,
	taxAmount: 0,
	totalAmount: 0,
	vendor: '',
	pricelistNumber: '',
	comment: '',
	createdBy: '',
	createdDate: new Date(),
	updatedBy: '',
	updatedDate: new Date(),
	itemCategory: '',
	itemSubcategory: '',
	inventoryInfo: {
		onHand: 0,
		onOrdered: 0,
		reorderLevel: 0,
		restockLevel: 0,
		averageMonthlyUsage: 0,
		lastPrice: 0,
		lastOrderDate: new Date(),
		lastVendor: '',
		inventoryUnit: '',
	},
	accountCode: '',
	jobCode: '',
	baseSubTotalPrice: 0,
	subTotalPrice: 0,
	baseNetAmount: 0,
	baseDiscAmount: 0,
	baseTaxAmount: 0,
	baseTotalAmount: 0,
};

const ItemDetailsEditForm: React.FC<ItemDetailsFormProps> = ({
	onSave,
	onCancel,
	initialData,
	mode,
}) => {
	const { locations } = useLocation();
	const { products } = useProduct();
	const { units } = useUnit();
	const { vendors } = useVendor();
	const { currencies } = useCurrency();


	console.log('currency', currencies);

	const getProductIdByName = (productName: string): string => {
		const product = products.find((prod) => prod.name === productName);
		return product?.id || '';
	};

	const getLocationIdByName = (locationName: string): string => {
		const location = locations.find((loc) => loc.name === locationName);
		return location?.id || '';
	};

	const getInitialFormData = () => {
		if (!initialData) return defaultValue;

		const formData = { ...defaultValue, ...initialData };

		if (mode === formType.EDIT || mode === formType.VIEW) {
			if (
				formData.location &&
				!locations.some((loc) => loc.id === formData.location)
			) {
				formData.location = getLocationIdByName(formData.location);
			}
			if (
				formData.name &&
				!products.some((prod) => prod.id === formData.name)
			) {
				formData.name = getProductIdByName(formData.name);
			}
			if (formData.unit && !units.some((u) => u.id === formData.unit)) {
				const unit = units.find((u) => u.name === formData.unit);
				if (unit && unit.id) formData.unit = unit.id;
			}
			if (formData.vendor && !vendors.some((v) => v.id === formData.vendor)) {
				const vendor = vendors.find((v) => v.name === formData.vendor);
				if (vendor && vendor.id) formData.vendor = vendor.id;
			}
		}

		return formData;
	};

	const form = useForm<ItemDetailsFormValues>({
		resolver: zodResolver(itemDetailsSchema),
		defaultValues: getInitialFormData(),
		mode: 'onChange',
	});

	useEffect(() => {
		const initialFormData = getInitialFormData();
		form.reset(initialFormData);
	}, [initialData, locations, products, form]);

	const getLocationNameById = (locationId: string) => {
		const location = locations.find((loc) => loc.id === locationId);
		return location ? location.name : '';
	};

	const getUnitNameById = (unitId: string) => {
		const unit = units.find((u) => u.id === unitId);
		return unit ? unit.name : unitId;
	};

	const getVendorNameById = (vendorId: string) => {
		const vendor = vendors.find((v) => v.id === vendorId);
		return vendor ? vendor.name : vendorId;
	};

	const getProductNameById = (productId: string) => {
		const product = products.find((p) => p.id === productId);
		return product ? product.name : productId;
	};

	const handleSubmit = (data: ItemDetailsFormValues) => {
		onSave(data as PurchaseRequestItem);
	};

	return (
		<div className="w-full max-w-full mx-auto p-3">
			<div className="flex flex-row items-center justify-between">
				<h2 className="text-xl sm:text-2xl font-bold px-3">
					{mode === formType.ADD ? 'Add New Item' : 'Item Details'}
				</h2>
				<div className="flex items-center gap-2">
					{mode === formType.VIEW && (
						<Button variant="outline" size="sm">
							<Edit />
							Edit
						</Button>
					)}
					<div className="flex flex-wrap justify-end gap-2 mt-4">
						{mode === formType.VIEW ? (
							<Button variant="outline" size="sm" onClick={onCancel}>
								Close
							</Button>
						) : (
							<>
								<Button variant="outline" size="sm" onClick={onCancel}>
									Cancel
								</Button>
								<Button
									type="submit"
									size="sm"
									onClick={form.handleSubmit(handleSubmit)}
								>
									Save
								</Button>
							</>
						)}
					</div>
					<Button variant="ghost" size="icon" onClick={onCancel}>
						<X className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<ScrollArea className="h-[calc(100vh-200px)]">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-2 p-3"
					>
						<BasicInformation
							form={form}
							mode={mode}
							locations={locations.map((location) => ({
								id: location.id || '',
								name: location.name,
							}))}
							products={products.map((product) => ({
								id: product.id || '',
								name: product.name,
							}))}
							getLocationNameById={getLocationNameById}
							getProductNameById={getProductNameById}
						/>

						<Separator className="my-2" />

						<QuantityAndDelivery
							form={form}
							mode={mode}
							units={units.map((unit) => ({
								id: unit.id || '',
								name: unit.name,
							}))}
							getUnitNameById={getUnitNameById}
						/>

						<Separator className="my-2" />

						<VendorInformation
							form={form}
							mode={mode}
							vendors={vendors.map((vendor) => ({
								id: vendor.id || '',
								name: vendor.name,
							}))}
							getVendorNameById={getVendorNameById}
						/>

						<Separator className="my-2" />

						<PricingInformation
							form={form}
							mode={mode}
							currencies={currencies.map(currency => ({
								id: currency.id || '',
								code: currency.code,
								name: currency.name
							}))}
						/>

						<Separator className="my-2" />
					</form>
				</Form>
			</ScrollArea>
		</div>
	);
};

export default ItemDetailsEditForm;
