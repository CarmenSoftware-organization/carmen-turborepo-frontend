import { PD_STATUS } from '@/lib/util/status';
import { z } from 'zod';

export enum enum_product_status_type {
	active = 'active',
	inactive = 'inactive',
	discontinued = 'discontinued',
}

export const product_location_item_schema = z.object({
	location_id: z.string().uuid(),
});

export type ProductLocationModel = z.infer<typeof product_location_item_schema>;
export class product_location_item implements ProductLocationModel {
	location_id!: string;
}

// export class product_location_list {
// 	locations : product_location_item[] = [];
// }

export const Product_OrderUnit_item_schema = z.object({
	unit_id: z.string().uuid(),
});

export type ProductOrderUnitModel = z.infer<
	typeof Product_OrderUnit_item_schema
>;
export class Product_OrderUnit_item implements ProductOrderUnitModel {
	unit_id!: string;
}
// export class Product_OrderUnit_list {
// 	units : Product_OrderUnit_item[] = [];
// }

export const Product_RecipeUnit_item_schema = z.object({
	unit_id: z.string().uuid(),
});

export type ProductRecipeUnitModel = z.infer<
	typeof Product_RecipeUnit_item_schema
>;
export class Product_RecipeUnit_item implements ProductRecipeUnitModel {
	unit_id!: string;
}
// export class Product_RecipeUnit_list {
// 	units : Product_OrderUnit_item[] = [];
// }

export const ProductCreateSchema = z.object({
	id: z.string().uuid().optional(),
	code: z.string().min(1, 'code must be at least 1 character'),
	name: z.string().min(1, 'name must be at least 1 character'),
	local_name: z.string().optional(),
	description: z.string().nullable().optional(),
	is_active: z.boolean().default(true).nullable().optional(),
	primary_unit_id: z.string().uuid().optional(),
	product_status_type: z.enum(
		Object.values(enum_product_status_type) as [string, ...string[]]
	),
	product_item_group_id: z
		.string()
		.uuid()
		.min(1, 'item group must be at least 1 character'),
	price: z.number().optional(),
	tax_type: z.string().optional(),
	tax_rate: z.number().optional(),
	is_ingredients: z.boolean().default(false).optional(),
	price_deviation_limit: z.number().optional(),
	info: z.object({}).optional(),
});

export type ProductCreateModel = z.infer<typeof ProductCreateSchema>;

export enum enum_tax_type {
	none = 'NONE',
	vat = 'VAT',
}

export class ProductCreateDto implements ProductCreateModel {
	id?: string;
	code!: string;
	name!: string;
	local_name?: string;
	product_status_type!: enum_product_status_type;
	product_item_group_id!: string;
	description?: string | null;
	is_active?: boolean | null;
	primary_unit_id?: string;
	price?: number;
	tax_type?: enum_tax_type;
	tax_rate?: number;
	is_ingredients?: boolean;
	price_deviation_limit?: number;
	info?: Product_info;
	locations?: {
		add?: product_location_item[];
		remove?: product_location_item[];
	};
	orderUnits?: {
		add?: Product_OrderUnit_item[];
		remove?: Product_OrderUnit_item[];
	};
	recipeUnit?: {
		add?: Product_RecipeUnit_item[];
		remove?: Product_RecipeUnit_item[];
	};
}

export const ProductUpdateSchema = ProductCreateSchema.extend({
	id: z.string().uuid(),
});

export type ProductUpdateModel = z.infer<typeof ProductUpdateSchema>;

export class ProductUpdateDto implements ProductUpdateModel {
	id!: string;
	code!: string;
	name!: string;
	local_name?: string;
	product_status_type!: enum_product_status_type;
	product_item_group_id!: string;
	description?: string | null;
	is_active?: boolean | null;
	primary_unit_id?: string;
	price?: number;
	tax_type?: enum_tax_type;
	tax_rate?: number;
	is_ingredients?: boolean;
	price_deviation_limit?: number;
	info?: Product_info;
	locations?: {
		add?: product_location_item[];
		remove?: product_location_item[];
	};
	orderUnits?: {
		add?: Product_OrderUnit_item[];
		remove?: Product_OrderUnit_item[];
	};
	recipeUnit?: {
		add?: Product_RecipeUnit_item[];
		remove?: Product_RecipeUnit_item[];
	};
}

export type Product_info = {
	brand?: string;
	uom?: string;
	packSize?: number;
	minStock?: number;
	maxStock?: number;
	reorderPoint?: number;
	currentStock?: number;
	value?: number;
	supplier?: string;
	expiryDate?: Date;
	lastCountDate?: Date;
};

export const ProductInfoCreateSchema = z.object({
	id: z.string().uuid().optional(),
	product_id: z.string().uuid(),
	price: z.number().nullable().optional(),
	info: z
		.object({
			brand: z.string().nullable().optional(),
			uom: z.string().nullable().optional(),
			packSize: z.number().nullable().optional(),
			minStock: z.number().nullable().optional(),
			maxStock: z.number().nullable().optional(),
			reorderPoint: z.number().nullable().optional(),
			currentStock: z.number().nullable().optional(),
			value: z.number().nullable().optional(),
			supplier: z.string().nullable().optional(),
			expiryDate: z.date().nullable().optional(),
			lastCountDate: z.date().nullable().optional(),
		})
		.optional(),
});

export type ProductInfoCreateModel = z.infer<typeof ProductInfoCreateSchema>;

export class ProductInfoCreateDto implements ProductInfoCreateModel {
	id?: string;
	product_id!: string;
	price?: number | null;
	info?: Product_info;
}

export const ProductInfoUpdateSchema = ProductInfoCreateSchema.extend({
	id: z.string().uuid(),
});

export type ProductInfoUpdateModel = z.infer<typeof ProductInfoUpdateSchema>;

export class ProductInfoUpdateDto implements ProductInfoUpdateModel {
	id!: string;
	product_id!: string;
	price?: number | null;
	info?: Product_info;
}
type ProductStatusType = "active" | "inactive" | "discontinued";

type ProductUnit = {
	id: string;
	name: string;
};

type ProductGroup = {
	id: string;
	name: string;
};


type ProductSubCat = {
	id: string;
	name: string;
};

type ProductCategory = {
	id: string;
	name: string;
};

export interface InfoProduct {
	name: string;
	local_name: string;
	status: ProductStatusType;
	description: string;
	item_group: ProductGroup,
	sub_cat: ProductSubCat,
	category: ProductCategory,
}

export interface ProductData {
	id: string;
	code: string;
	name: string;
	local_name: string;
	description: string;
	primary_unit_id: string;
	product_status_type: string;
	tb_product_info: ProductInfo;
	product_info: ProductInfo;
	product_primary_unit: ProductUnit;
	product_item_group: ProductGroup;
	product_subcategory: ProductGroup;
	product_category: ProductCategory;
}

export interface ProductData {
	data: {
		id: string;
		code: string;
		name: string;
		local_name: string;
		description: string;
		product_status_type: ProductStatusType;
		product_info: ProductInfo;
		product_primary_unit: ProductUnit;
		product_item_group: ProductGroup;
		product_subcategory: ProductGroup;
		product_category: ProductCategory;
	}
}

export interface CategoryData {
	item_group_name: string;
	sub_category_name: string;
	category_name: string;
}

export interface ProductInfo {
	id: string;
	product_id: string;
	product_item_group_id: string;
	is_ingredients: boolean;
	price: string;
	tax_type: string;
	tax_rate: string;
	price_deviation_limit: string;
	info: {
		attribute: {
			label: string;
			value: string;
		}[];
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		something: any[];
	};
	created_at: string;
	created_by_id: string;
	updated_at: string;
	updated_by_id: string;
}

export type ProductInfoDto = {
	price: string;
	tax_type: string;
	tax_rate: string;
	price_deviation_limit: string;
	info?: AttributesDTO;
};

export type PriceDTO = {
	price: string;
	tax_type: string;
	tax_rate: string;
	price_deviation_limit: string;
};

export type AttributesDTO = {
	info: {
		attribute: {
			label?: string;
			value?: string;
		}[];
	};
};

export interface ProductInfoClient {
	data: {
		id: string;
		code: string;
		name: string;
		description: string;
		tb_product_info?: ProductInfoDto;
		product_status_type: string;
	};
	name: string;
	item_group_name: string;
	sub_category_name: string;
	category_name: string;
	description: string;
}

export interface ProductModel {
	data: ProductData;
	item_group_name: string;
	sub_category_name: string;
	category_name: string;
}

export const productFormSchema = z.object({
	name: z.string(),
	local_name: z.string(),
	description: z.string(),
	primary_unit_id: z.string(),
	product_item_group_id: z.string(),
	price: z.number(),
	tax_type: z.enum(['vat', 'non_vat']),
	tax_rate: z.number(),
	is_ingredients: z.boolean(),
	price_deviation_limit: z.number(),
	product_status_type: z.enum([
		PD_STATUS.ACTIVE,
		PD_STATUS.IN_ACTIVE,
		PD_STATUS.DISCONTINUED,
	]),
	info: z
		.array(
			z.object({
				attribute: z.array(
					z.object({
						label: z.string(),
						value: z.string(),
					})
				),
			})
		)
		.optional(),

	locations: z
		.object({
			add: z.array(
				z.object({
					location_id: z.string(),
					name: z.string(),
					location_type: z.string(),
					is_active: z.boolean(),
				})
			),
		})
		.optional(),
	orderUnits: z
		.object({
			add: z.array(
				z.object({
					unit_id: z.string(),
					unit_quantity: z.number(),
					to_unit_id: z.string(),
					to_unit_quantity: z.number().optional(),
				})
			),
		})
		.optional(),

	recipeUnits: z
		.object({
			add: z.array(
				z.object({
					unit_id: z.string(),
					unit_quantity: z.number(),
					to_unit_id: z.string(),
					to_unit_quantity: z.number(),
				})
			),
		})
		.optional(),
	countUnits: z
		.object({
			add: z.array(
				z.object({
					unit_id: z.string(),
					unit_quantity: z.number(),
					to_unit_id: z.string(),
					to_unit_quantity: z.number(),
				})
			),
		})
		.optional(),
	ingredientsUnits: z
		.object({
			add: z.array(
				z.object({
					unit_id: z.string(),
					unit_quantity: z.number(),
					to_unit_id: z.string(),
					to_unit_quantity: z.number(),
				})
			),
		})
		.optional(),
});

export type ProductFormType = z.infer<typeof productFormSchema>;
