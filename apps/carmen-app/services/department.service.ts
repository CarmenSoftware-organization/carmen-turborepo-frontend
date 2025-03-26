import { backendApi } from "@/lib/backend-api";
import { DepartmentDto } from "@/dtos/config.dto";

export const getAllDepartments = async (token: string) => {
    const url = `${backendApi}/api/config/departments`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
};

export const createDepartment = async (token: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
    });
    const data = await response.json();
    return data;
};

export const updateDepartment = async (token: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments/${department.id}`;
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
    });
    const data = await response.json();
    return data;
};

export const deleteDepartment = async (token: string, department: DepartmentDto) => {
    const url = `${backendApi}/api/config/departments/${department.id}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
};

