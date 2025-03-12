'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Form from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { productFormSchema, ProductFormType } from '@/dtos/product.dto';
import BasicInformation from './BasicInformation';
import Attributes from './Attributes';
import Locations from './Locations';
import OrderUnits from './OrderUnits';
import { Save } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';
import { PD_STATUS } from '@/lib/util/status';
import { save_text } from '@/paraglide/messages';
import { useUnit } from '@/hooks/useUnit';
import IngredientsUnits from './IngredientsUnits';
export default function ProductForm() {
	const { accessToken, tenantId } = useAuth();
	const token = accessToken || '';
	const { units } = useUnit();

	// Add state to store selected unit from BasicInformation
	const [selectedUnit, setSelectedUnit] = useState<{ id: string; name: string } | null>(null);

	const form = useForm<ProductFormType>({
		resolver: zodResolver(productFormSchema),
		defaultValues: {
			name: '',
			local_name: '',
			description: '',
			primary_unit_id: '',
			product_item_group_id: '',
			price: 0,
			tax_type: 'vat',
			tax_rate: 7,
			is_ingredients: false,
			price_deviation_limit: 20,
			product_status_type: PD_STATUS.ACTIVE,
			info: [{ attribute: [] }],
			locations: { add: [] },
			orderUnits: { add: [] },
			ingredientsUnits: { add: [] },
		},
	});

	// Watch for changes to primary_unit_id and update selectedUnit accordingly
	useEffect(() => {
		const subscription = form.watch((value, { name }) => {
			if (name === 'primary_unit_id' && value.primary_unit_id) {
				const unitId = value.primary_unit_id as string;
				const unit = units.find(u => u.id === unitId);
				if (unit) {
					setSelectedUnit({
						id: unit.id ?? '',
						name: unit.name ?? ''
					});
				}
			}
		});

		return () => subscription.unsubscribe();
	}, [form, units]);

	// เพิ่ม event listener สำหรับอัพเดท orderUnits
	useEffect(() => {
		const handleUpdateOrderUnit = (e: CustomEvent) => {
			const { index, item } = e.detail;
			// อัพเดทค่า orderUnits ตามที่ได้รับมาจาก OrderUnits component
			const currentOrderUnits = form.getValues('orderUnits.add') || [];
			if (currentOrderUnits[index]) {
				// ตรวจสอบว่าค่าเปลี่ยนแปลงจริงหรือไม่ก่อนทำการอัพเดท
				const currentToUnitId = currentOrderUnits[index].to_unit_id;
				if (currentToUnitId !== item.to_unit_id) {
					currentOrderUnits[index].to_unit_id = item.to_unit_id;
					form.setValue('orderUnits.add', currentOrderUnits, {
						shouldDirty: true,
						shouldTouch: true,
						shouldValidate: true
					});
				}
			}
		};

		// เพิ่ม event listener
		window.addEventListener('update-order-unit', handleUpdateOrderUnit as EventListener);

		// ลบ event listener เมื่อ component unmount
		return () => {
			window.removeEventListener('update-order-unit', handleUpdateOrderUnit as EventListener);
		};
	}, [form]);

	const onSubmit = (data: ProductFormType) => {
		console.log('Form submitted with data:', data);
	};

	return (
		<Form.Form {...form} data-id="product-form">
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="container mx-auto p-4 space-y-4"
				data-id="product-form"
			>
				<div className="flex items-center justify-between" data-id="product-form-header">
					<h1 className="font-semibold" data-id="product-form-title">Products Infomation</h1>
					<Button type="submit" size={'sm'} variant={'default'} data-id="product-form-save-button">
						<Save /> {save_text()}
					</Button>
				</div>

				<div className="grid grid-cols-1 gap-4 md:grid-cols-12">
					<div className="col-span-full">
						<BasicInformation
							control={form.control}
							token={token}
							tenantId={tenantId}
							data-id="product-form-basic-information"
							selectedUnit={selectedUnit}
							setSelectedUnit={setSelectedUnit}
						/>
					</div>

					<div className="md:col-span-6 col-span-full">
						<Attributes control={form.control} data-id="product-form-attributes" />
					</div>

					<div className="md:col-span-6 col-span-full">
						<Locations control={form.control} data-id="product-form-locations" />
					</div>

					<div className="md:col-span-6 col-span-full">
						<OrderUnits control={form.control} data-id="product-form-order-units" selectedUnit={selectedUnit} />
					</div>
					<div className="md:col-span-6 col-span-full">
						<IngredientsUnits control={form.control} data-id="product-form-ingredients-units" selectedUnit={selectedUnit} />
					</div>
				</div>
			</form>
		</Form.Form>
	);
}
