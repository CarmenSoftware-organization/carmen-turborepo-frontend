import { ProductItemGroupCreateModel } from '@/dtos/product-item-group.dto';
import { formType } from '@/constants/enums';

export const fetchItemGroup = async (token: string, tenantId: string) => {
	try {
		const url = `/api/product-management/category/product-item-group`;

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

export const deleteItemGroup = async (token: string, id: string) => {
	try {
		const response = await fetch(
			`/api/product-management/category/product-item-group/${id}`,
			{
				method: 'DELETE',
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (!response.ok) {
			throw new Error('Failed to delete item group');
		}
		return response;
	} catch (error) {
		console.error('Error deleting item group:', error);
		throw error;
	}
};

export const submitItemGroup = async (
	token: string,
	payload: ProductItemGroupCreateModel,
	mode: formType,
	id?: string
) => {
	try {
		const url =
			mode === formType.ADD
				? '/api/product-management/category/product-item-group'
				: `/api/product-management/category/product-item-group/${id || ''}`;

		const method = mode === formType.ADD ? 'POST' : 'PATCH';

		const options = {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(payload),
		};

		const response = await fetch(url, options);

		if (!response.ok) {
			if (response.status === 401) {
				throw new Error('Unauthorized access - Invalid or expired token');
			}
			throw new Error(
				`Failed to ${mode} item group: ${response.status} ${response.statusText}`
			);
		}

		const res = await response.json();
		const returnData = mode === formType.ADD ? res.result : { id: id || '' };
		return returnData;
	} catch (error) {
		console.error('Error submitting form:', error);
		throw error;
	}
};
