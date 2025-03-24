import { formType } from "@/dtos/form.dto";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";

export const fetchWorkflow = async (
	token: string,
	tenantId: string,
	wfId: string
) => {
	try {
		const url = `/api/system-administration/workflow/${wfId}`;
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
			throw new Error('Failed to fetch workflow');
		}
		const data = await response.json();
		return data.data;
	} catch (error) {
		throw new Error(
			error instanceof Error ? error.message : 'Failed to fetch workflow data'
		);
	}
};

export const fetchWorkflowList = async (
	token: string,
	tenantId: string,
	params: {
		search?: string;
		status?: string;
		page?: string;
		perpage?: string;
		sort?: string;
	} = {}
) => {
	try {
		const query = new URLSearchParams();
		if (params.search) {
			query.append('search', params.search);
		}

		if (params.status) {
			query.append('status', params.status);
		}

		if (params.page) {
			query.append('page', params.page);
		}

		if (params.sort) {
			query.append('sort', params.sort);
		}

		const url = `/api/system-administration/workflow/?${query}`;

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
			throw new Error('Failed to fetch workflows');
		}

		const result = await response.json();

		return result;
	} catch (error) {
		console.error('Error fetching workflows:', error);
		throw error;
	}
};

export const createWorkflow = async (
	values: WorkflowCreateModel,
	token: string,
	tenantId: string
): Promise<WorkflowCreateModel | null> => {
	try {
		const response = await fetch(`/api/system-administration/workflow/`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'x-tenant-id': tenantId,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(values),
		});

		if (!response.ok) {
			throw new Error(`Failed to create workflow`);
		}

		const result = await response.json();
		if (result.error) {
			throw new Error(result.error);
		}
		return result;
	} catch (error) {
		console.error('Error submitting workflows:', error);
		return null;
	}
};

export const handleSubmit = async (
	values: WorkflowCreateModel,
	token: string,
	tenantId: string,
	mode: formType
): Promise<WorkflowCreateModel | null> => {
	try {
		const url = values?.id
			? `/api/system-administration/workflow/${values.id}`
			: '/api/system-administration/workflow';

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
			throw new Error(`Failed to ${mode} workflow`);
		}

		const result = await response.json();

		if (result.error) {
			throw new Error(result.error);
		}
		return result;
	} catch (error) {
		console.error('Error submitting workflow:', error);
		return null;
	}
};

export const deleteWorkflow = async (
	token: string,
	tenantId: string,
	id: string
) => {
	const response = await fetch(`/api/system-administration/workflow/${id}`, {
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
		throw new Error('Failed to delete workflow');
	}

	return response;
};
