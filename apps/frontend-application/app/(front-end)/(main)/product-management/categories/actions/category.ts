import { ProductCategoryCreateModel } from '@/dtos/product-category.dto';
import { formType } from '@/constants/enums';

export const fetchCategoryList = async (token: string, tenantId: string) => {
	try {
		const url = `/api/product-management/category/category-list`;

		const options = {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized access - Invalid or expired token');
			}
			throw new Error(
				`Failed to fetch data: ${response.status} ${response.statusText}`
			);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching product item group:', error);
		throw error;
	}
};

export const submitCategory = async (
	values: ProductCategoryCreateModel,
	token: string,
	mode: formType,
	id: string
) => {
	try {
		const url =
			mode === formType.ADD
				? '/api/product-management/category/category-list'
				: `/api/product-management/category/category-list/${id}`;

		const method = mode === formType.ADD ? 'POST' : 'PATCH';

		const options = {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized access - Invalid or expired token');
			}
		}
		const result = await response.json();
		const returnData = mode === formType.ADD ? result : { id: id };
		return returnData;
	} catch (error) {
		console.error('Error add category:', error);
		throw error;
	}
};

export const deleteCategory = async (id: string, token: string) => {
	try {
		const response = await fetch(
			`/api/product-management/category/category-list/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			throw new Error('Failed to delete category');
		}
		return response;
	} catch (error) {
		console.error('Error deleting category:', error);
		throw error;
	}
};
