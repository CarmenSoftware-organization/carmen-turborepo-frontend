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
    } catch (error: any) {
        console.error("Get business unit failed:", error.response?.data ?? error.message);
        return error;
    }
}
