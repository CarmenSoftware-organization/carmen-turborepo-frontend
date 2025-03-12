import { UnitCreateModel } from '@/dtos/unit.dto';
import { formType } from '@/constants/enums';
interface UnitComment {
	id: string;
	message: string;
}

export const fetchUnits = async (
	token: string,
	tenantId: string,
	params: {
		search?: string;
		status?: string;
		page?: string;
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

		const url = `/api/product-management/unit?${query}`;

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
			throw new Error('Failed to fetch store locations');
		}
		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error('Error fetching store locations:', error);
		throw error;
	}
};

export const deleteUnit = async (
	id: string,
	token: string,
	tenantId: string
) => {
	try {
		const response = await fetch(`/api/product-management/unit/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
			},
		});
		if (!response.ok) {
			throw new Error('Failed to delete store location');
		}
		return response;
	} catch (error) {
		console.error('Error deleting store location:', error);
		throw error;
	}
};

export const submitUnit = async (
	values: UnitCreateModel,
	mode: formType,
	token: string,
	tenantId: string,
	id: string
) => {
	try {
		const url =
			mode === formType.ADD
				? '/api/product-management/unit'
				: `/api/product-management/unit/${id}`;

		const method = mode === formType.ADD ? 'POST' : 'PATCH';

		const response = await fetch(url, {
			method,
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `Failed to ${mode} store location`);
		}
		const result = await response.json();
		const returnData = mode === formType.ADD ? result : { id: id };
		return returnData;
	} catch (error) {
		console.error('Error submitting store location:', error);
		throw error;
	}
};

export const fetchUnitList = async (token: string, tenantId: string) => {
	try {
		const perpage = 99;
		const url = `/api/product-management/unit?perpage=${perpage}`;

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
			throw new Error('Failed to fetch list unit');
		}
		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error('Error fetching list unit:', error);
		throw error;
	}
};

export const fetchUnitComments = async (
	token: string,
	tenantId: string
): Promise<{ data: UnitComment[] }> => {
	if (!token || !tenantId) {
		throw new Error('Missing required authentication parameters');
	}

	const response = await fetch('/api/comment/unit', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
			'x-tenant-id': tenantId,
			'Content-Type': 'application/json',
		},
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}

	return await response.json();
};
