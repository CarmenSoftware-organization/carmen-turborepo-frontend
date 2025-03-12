import { formType } from '@/constants/enums';
import { DeliveryPointCreateModel } from '@/dtos/delivery-point.dto';

export const fetchDeliveryPoints = async (
	token: string,
	tenantId: string,
	params: {
		search?: string;
		status?: string;
		page?: string;
		pages?: string;
		sort?: string;
	} = {}
) => {
	try {
		const query = new URLSearchParams();

		if (params.search) {
			query.append('search', params.search);
		}

		if (params.status) {
			query.append('filter[is_active:bool]', params.status);
		}

		if (params.page) {
			query.append('page', params.page);
		}

		if (params.sort) {
			query.append('sort', params.sort);
		}

		const url = `/api/configuration/delivery-point?${query}`;

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
			throw new Error('Failed to fetch delivery points');
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error('Error fetching delivery points:', error);
		throw error;
	}
};

export const fetchListDP = async (token: string, tenantId: string) => {
	try {
		const perpage = 99;
		const url = `/api/configuration/delivery-point?perpage=${perpage}`;
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
			throw new Error('Failed to fetch delivery points');
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error('Error fetching delivery points:', error);
		throw error;
	}
};

export const deleteDeliveryPoint = async (
	id: string,
	token: string,
	tenantId: string
) => {
	const response = await fetch(`/api/configuration/delivery-point/${id}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
		},
	});

	if (response.status === 401) {
		throw new Error('Unauthorized');
	}

	if (!response.ok) {
		throw new Error('Failed to delete delivery point');
	}

	return response;
};

export const submitDeliveryPoint = async (
	data: DeliveryPointCreateModel,
	mode: formType,
	token: string,
	tenantId: string,
	id: string
) => {
	const url =
		mode === formType.ADD
			? '/api/configuration/delivery-point'
			: `/api/configuration/delivery-point/${id}`;

	const method = mode === formType.ADD ? 'POST' : 'PATCH';

	const response = await fetch(url, {
		method,
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(errorData.message || `Failed to ${mode} Currency`);
	}

	const result = await response.json();
	return result;
};
