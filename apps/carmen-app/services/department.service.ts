import { backendApi } from "@/lib/backend-api";
import { DepartmentDto } from "@/dtos/config.dto";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

const API_URL = `${backendApi}/api/config/departments`;

export const getAllDepartments = async (token: string, tenantId: string,
    params: {
        search?: string;
        page?: string;
        perPage?: string;
        sort?: string;
        filter?: string;
    } = {}
) => {
    if (!token || !tenantId) {
        console.error('Token or tenantId is missing');
        // ส่งค่ากลับเป็น object ว่างเพื่อให้สามารถใช้งานต่อได้โดยไม่เกิด error
        return {
            data: [],
            paginate: { pages: 1 },
            message: 'Token or tenantId is missing'
        };
    }

    try {
        const query = new URLSearchParams();

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                query.append(key, String(value));
            }
        });

        const queryString = query.toString();
        const url = queryString ? `${API_URL}?${queryString}` : API_URL;

        const response = await axios.get(url, {
            headers: requestHeaders(token, tenantId)
        });
        console.log('response', response);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch departments:', error);
        // ส่งค่ากลับเป็น object ว่างเพื่อให้สามารถใช้งานต่อได้โดยไม่เกิด error
        return {
            data: [],
            paginate: { pages: 1 },
            error: error
        };
    }
};

export const createDepartment = async (token: string, tenantId: string, department: DepartmentDto) => {
    try {
        const response = await axios.post(API_URL, department, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create department:', error);
    }
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

