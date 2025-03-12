import { LocationCreateModel } from '@/dtos/location.dto';
import { formType } from '@/constants/enums';
export const fetchStoreLocations = async (
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
		if (!token) {
			throw new Error('Access token is required');
		}

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

		const url = `/api/configuration/locations?${query}`;

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
		return result;
	} catch (error) {
		console.error('Error fetching store locations:', error);
		throw error;
	}
};

export const deleteStoreLocation = async (
	id: string,
	token: string,
	tenantId: string
) => {
	try {
		const response = await fetch(`/api/configuration/locations/${id}`, {
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

export const submitStoreLocation = async (
	values: LocationCreateModel,
	mode: formType,
	token: string,
	tenantId: string,
	id: string
) => {
	try {
		const url =
			mode === formType.ADD
				? '/api/configuration/locations'
				: `/api/configuration/locations/${id}`;

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
		console.error(`Error ${mode} store location`, error);
		throw error;
	}
};

export const fetchLocationByID = async (
	id: string,
	token: string,
	tenantId: string
) => {
	try {
		const response = await fetch(`/api/configuration/locations/${id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch location data: ${response.status}`);
		}

		const data = await response.json();
		return data.data;
	} catch (err) {
		console.error('Error fetching location data:', err);
		return null;
	}
};
