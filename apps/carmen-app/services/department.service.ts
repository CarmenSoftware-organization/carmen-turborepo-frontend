import { backendApi } from "@/lib/backend-api";
import { DepartmentDto } from "@/dtos/config.dto";

export const getAllDepartments = async (token: string, tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
    } = {}
) => {
    const query = new URLSearchParams();

    if (params.search) {
        query.append('search', params.search);
    }

    if (params.page) {
        query.append('page', params.page);
    }

    if (params.perPage) {
        query.append('perPage', params.perPage);
    }

    if (params.sort) {
        query.append('sort', params.sort);
    }

    const url = `${backendApi}/api/config/departments?${query}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};

export const createDepartment = async (token: string, tenantId: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
    });
    const data = await response.json();
    return data;
};

export const updateDepartment = async (token: string, tenantId: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments/${department.id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
    });
    const data = await response.json();
    return data;
};

export const deleteDepartment = async (token: string, tenantId: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments/${department.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': tenantId,
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();
    return data;
};

