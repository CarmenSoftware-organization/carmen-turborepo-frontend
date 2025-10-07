import { backendApi } from "@/lib/backend-api";
import axios from "axios";

export const signInService = async (email: string, password: string) => {
  const url = `${backendApi}/api/auth/login`;
  try {
    const response = await axios.post(url, { email, password });
    return response.data;
  } catch (error) {
    console.error("Failed to sign in:", error);
  }
};

export const getUserProfileService = async (accessToken: string) => {
  const url = `${backendApi}/api/user/profile`;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    // TODO: Remove mock permissions when backend is ready
    // Mock permissions for testing
    const mockPermissions = {
      configuration: {
        delivery_point: ["view_all", "create", "delete"],
        currency: ["view_all", "create", "update"],
        exchange_rates: ["view"],
        store_location: ["view_all", "create"],
        department: ["view_all"],
        tax_profile: ["view"],
        extra_cost: ["view"],
        business_type: ["view"],
      },
      product_management: {
        product: ["view_all", "create", "update", "delete"],
        category: ["view_all", "create"],
        report: ["view"],
        unit: ["view"],
      },
    };

    return {
      ...response.data,
      permissions: response.data.permissions || mockPermissions, // ใช้จาก API ถ้ามี, ไม่งั้นใช้ mock
    };
  } catch (error) {
    console.error("Failed to get user profile:", error);
  }
};

export const updateUserBusinessUnitService = async (
  accessToken: string,
  buCode: string
) => {
  const url = `${backendApi}/api/business-unit/default`;
  try {
    const response = await axios.post(url, {
      tenant_id: buCode
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update user business unit:", error);
    throw error;
  }
};
