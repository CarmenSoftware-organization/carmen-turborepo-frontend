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
    return response.data;
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
    const response = await axios.post(
      url,
      {
        tenant_id: buCode
      },
      {
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
