import { ProductSubCategoryCreateModel } from '@/dtos/product-sub-category.dto';
import { formType } from '@/constants/enums';

export const fetchSubProduct = async (token: string, tenantId: string) => {
	try {
		const url = `/api/product-management/category/product-sub-category`;

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

export const deleteSubCategory = async (id: string, token: string) => {
	try {
		const response = await fetch(
			`/api/product-management/category/product-sub-category/${id}`,
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

export const submitSubCategory = async (
	values: ProductSubCategoryCreateModel,
	token: string,
	mode: formType,
	id: string
) => {
	try {
		const url =
			mode === formType.ADD
				? '/api/product-management/category/product-sub-category'
				: `/api/product-management/category/product-sub-category/${id}`;
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
		console.log('mode >>>', mode);
		console.log('returnData >>>', returnData);

		return returnData;
	} catch (error) {
		console.error('Error submitting form:', error);
		throw error;
	}
};
