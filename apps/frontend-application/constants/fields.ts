import { enum_location_type, LocationCreateModel } from '@/dtos/location.dto';
import { UnitCreateModel } from '@/dtos/unit.dto';
import { VendorCreateModel } from '@/dtos/vendor.dto';
import { GoodsReceiveNote, PrType, PurchaseOrderType } from '@/lib/types';
import { FieldConfig } from '@/lib/util/uiConfig';
import * as m from '@/paraglide/messages.js';
import {
	GOOD_RECIEIVE_NOTE_FIELDS,
	LocationField,
	PoField,
	PrField,
	ProductField,
	UnitField,
	VendorFields,
} from './enums';
import { ProductCreateModel } from '@/dtos/product.dto';

export const grnSortFields: FieldConfig<GoodsReceiveNote>[] = [
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.DATE, label: 'Date' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.REF, label: 'Code' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.VENDOR, label: 'Vendor' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.INVOICE_NUMBER, label: 'Invoice Number' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.INVOICE_DATE, label: 'Invoice Date' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.TOTAL_AMOUNT, label: 'Total Amount' },
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.STATUS, label: 'Status', type: 'badge' },
];

export const goodsReceiveNoteFields: FieldConfig<GoodsReceiveNote>[] = [
	...grnSortFields,
	{ key: GOOD_RECIEIVE_NOTE_FIELDS.DESCRIPTION, label: 'Description' },
];

export const prSortFields: FieldConfig<PrType>[] = [
	{ key: PrField.Type, label: 'Type' },
	{ key: PrField.Requestor, label: 'Requestor' },
	{ key: PrField.Department, label: 'Department' },
	{ key: PrField.Date, label: 'Date', type: 'date' },
	{ key: PrField.Status, label: 'Status', type: 'badge' },
	{ key: PrField.Amount, label: 'Amount', type: 'amount' },
	{ key: PrField.CurrentStage, label: 'Current Stage' },
];

export const poSortFields: FieldConfig<PurchaseOrderType>[] = [
	{ key: PoField.Number, label: 'Number' },
	{ key: PoField.VendorName, label: 'Vendor Name' },
	{ key: PoField.OrderDate, label: 'Order Date', type: 'date' },
	{ key: PoField.DeliveryDate, label: 'Delivery Date', type: 'date' },
	{ key: PoField.Status, label: 'Status', type: 'badge' },
	{ key: PoField.TotalAmount, label: 'Total Amount', type: 'amount' },
	{ key: PoField.CurrencyCode, label: 'Currency' },
	{ key: PoField.ExchangeRate, label: 'Exchange Rate', type: 'decimal' },
	{ key: PoField.BaseCurrencyCode, label: 'Base Currency' },
	{ key: PoField.ApprovalDate, label: 'Approval Date', type: 'date' },
];

export const unitSortFields: FieldConfig<UnitCreateModel>[] = [
	{
		key: UnitField.Name,
		label: `${m.unit_name_label()}`,
		className: 'w-24',
	},
];

export const unitFields: FieldConfig<UnitCreateModel>[] = [
	...unitSortFields,
	{
		key: UnitField.Status,
		label: `${m.status_text()}`,
		type: 'badge',
		className: 'w-24',
	},
	{
		key: UnitField.Description,
		label: `${m.unit_des_label()}`,
	},
];

export const vendorSortFields: FieldConfig<VendorCreateModel>[] = [
	{
		key: VendorFields.Name,
		label: m.vendor_name_label(),
	},
	{
		key: VendorFields.Description,
		label: m.description(),
	},
	{
		key: VendorFields.IsActive,
		label: m.status_text(),
	},
];

export const locationSortFields: FieldConfig<LocationCreateModel>[] = [
	{
		key: LocationField.Name,
		label: m.store_location_name_label(),
		className: 'w-24',
	},
	{
		key: LocationField.Description,
		label: m.description(),
		className: 'w-40',
	},
	{
		key: LocationField.LocationType,
		label: m.location_type_label(),
		className: 'w-10',
	},
	{
		key: LocationField.isActive,
		label: m.status_text(),
		type: 'badge',
		className: 'w-10',
	},
];

export const locationField = [
	{ label: 'Inventory', value: enum_location_type.inventory },
	{ label: 'Direct', value: enum_location_type.direct },
	{ label: 'Consignment', value: enum_location_type.consignment },
];

export const sortProductFields: FieldConfig<ProductCreateModel>[] = [
	{ key: ProductField.NAME as keyof ProductCreateModel, label: 'Name' },
	{ key: ProductField.CODE as keyof ProductCreateModel, label: 'Code' },
];

export const productFields: FieldConfig<ProductCreateModel>[] = [
	...sortProductFields,
	{
		key: ProductField.DESCRIPTION as keyof ProductCreateModel,
		label: 'Description',
	},
	{ key: ProductField.CATEGORY as keyof ProductCreateModel, label: 'Category' },
	{
		key: ProductField.SUBCATEGORY as keyof ProductCreateModel,
		label: 'Subcategory',
	},
	{
		key: ProductField.ITEM_GROUP as keyof ProductCreateModel,
		label: 'Item Group',
	},
	{ key: ProductField.STATUS as keyof ProductCreateModel, label: 'Status' },
];
