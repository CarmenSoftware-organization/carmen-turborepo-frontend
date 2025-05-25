import { backendApi } from "@/lib/backend-api";
import { DepartmentDto } from "@/dtos/config.dto";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/config/departments`;

export const getAllDepartments = async (
    token: string,
    tenantId: string,
    params: ParamsGetDto
) => {
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
        return response.data;
    } catch (error) {
        return error;
    }
};

export const getDepartmentById = async (token: string, tenantId: string, id: string) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to fetch department by id:', error);
        return error;
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
    try {
        const response = await axios.patch(`${API_URL}/${department.id}`, department, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to update department:', error);
    }
};

export const deleteDepartment = async (token: string, tenantId: string, department: DepartmentDto) => {
    try {
        const response = await axios.delete(`${API_URL}/${department.id}`, {
            headers: requestHeaders(token, tenantId)
        });
        return response.data;
    } catch (error) {
        console.error('Failed to delete department:', error);
    }
};
