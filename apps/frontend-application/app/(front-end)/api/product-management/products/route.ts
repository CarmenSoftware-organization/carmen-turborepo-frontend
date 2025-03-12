
import { API_URL } from '@/lib/util/api';
import { extractRequest } from '@/lib/util/auth';
import { PRODUCT_STATUS_FILTER } from '@/lib/util/status';
import { fetchData } from '@/services/client';
import { fetchProductCategory, fetchProductItemGroup, fetchProductSubcategory } from '@/services/products';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
		brand: string;
	};
	created_at: string;
	created_by_id: string;
	updated_at: string;
	updated_by_id: string;
}

export interface Product {
	id: string;
	code: string;
	name: string;
	local_name: string | null;
	description: string;
	primary_unit_id: string;
	product_status_type: string;
	created_at: string;
	created_by_id: string;
	updated_at: string;
	updated_by_id: string;
	tb_product_info: ProductInfo;
	item_group_name: string;
	sub_category_name: string;
	category_name: string;
}

export const GET = async (request: NextRequest) => {
	try {
		const { token, tenantId } = extractRequest(request);

		if (!token || !tenantId) {
			return NextResponse.json(
				{ error: 'Unauthorized access - Invalid or expired token' },
				{ status: 401 }
			);
		}

		const { searchParams } = new URL(request.url);

		const search = searchParams.get('search') || '';
		const page = searchParams.get('page') || '1';
		const sort = searchParams.get('sort') || '';
		const status =
			(searchParams.get('status') as PRODUCT_STATUS_FILTER) ||
			PRODUCT_STATUS_FILTER.ALL_STATUS;

		let productUrl = `${API_URL}/v1/products?search=${search}&page=${page}&sort=${sort}`;

		if (status !== PRODUCT_STATUS_FILTER.ALL_STATUS) {
			productUrl += `&filter[product_status_type:enum]=${status}`;
		}

		const productResponse = await fetchData(productUrl, token, tenantId);

		const data = await getProducts(productResponse.data, token, tenantId);

		return NextResponse.json({ data, pagination: productResponse.pagination });
	} catch (error) {
		console.error('Error occurred:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error', error },
			{ status: 500 }
		);
	}
};

const fetchCategoryHierarchy = async (productId: string, token: string, tenantId: string) => {
	try {
		const groupData = await fetchProductItemGroup(productId, token, tenantId);
		const subCategoryData = await fetchProductSubcategory(groupData.data.product_subcategory_id, token, tenantId);
		const categoryData = await fetchProductCategory(subCategoryData.data.product_category_id, token, tenantId);

		return {
			item_group_name: groupData.data.name,
			sub_category_name: subCategoryData.data.name,
			category_name: categoryData.data.name,
		};
	} catch (error) {
		console.error(`Error fetching category data for product ${productId}:`, error);
		return {
			item_group_name: 'Unknown',
			sub_category_name: 'Unknown',
			category_name: 'Unknown',
		};
	}
};

const getProducts = async (products: Product[], token: string, tenantId: string) => {
	const results = await Promise.allSettled(
		products.map(async (product) => {
			const categoryData = await fetchCategoryHierarchy(product.tb_product_info.product_item_group_id, token, tenantId);
			return { ...product, ...categoryData };
		})
	);

	return results.map((result) =>
		result.status === 'fulfilled' ? result.value : { error: 'Failed to fetch product data' }
	);
};
