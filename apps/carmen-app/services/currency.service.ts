import { backendApi } from "@/lib/backend-api";

export const getAllCurrencies = async (token: string) => {
    const url = `${backendApi}/api/config/currencies`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    const data = await response.json();
    return data;
}