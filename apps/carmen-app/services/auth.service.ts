import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import { requestHeaders } from "@/lib/config.api";

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
  buId: string
) => {
  const url = `${backendApi}/api/business-unit/default`;
  console.log("accessToken", accessToken);
  console.log("buId", buId);

  try {
    const response = await axios.post(url, {
      headers: requestHeaders(accessToken, buId),
    });
    return response.data;
  } catch (error) {
    console.error("Failed to update user business unit:", error);
  }
};
