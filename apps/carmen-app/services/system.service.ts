import { SystemBuFormValue } from "@/dtos/system.dto";
import { backendApi } from "@/lib/backend-api";
import axios from "axios";

const API_SYSTEM_USER_BU = `${backendApi}/api-system/business-unit`;
export const getAllSystemUnitBu = async (token: string) => {
    try {
        const response = await axios.get(API_SYSTEM_USER_BU, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const createSystemUnitBu = async (token: string, data: SystemBuFormValue) => {
    try {
        if (!token) {
            throw new Error("Authentication token is required");
        }

        if (!data) {
            throw new Error("Form data is required");
        }

        const response = await axios.post(API_SYSTEM_USER_BU, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Create business unit failed:", error);
        throw error;
    }
}