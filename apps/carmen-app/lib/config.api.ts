import { ParamsGetDto } from "@/dtos/param.dto";
import axios from "axios";

export const requestHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAllApiRequest = async (
  API_URL: string,
  token: string,
  errorContext: string,
  params?: ParamsGetDto
) => {
  try {
    const query = new URLSearchParams();

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, String(value));
      }
    });

    const queryString = query.toString();
    const URL = queryString ? `${API_URL}?${queryString}` : API_URL;

    const response = await axios.get(URL, {
      headers: requestHeaders(token),
    });

    return response.data;
  } catch (error) {
    console.error(`❌ ${errorContext}:`, error);
    throw error;
  }
};

export const getByIdApiRequest = async (
  API_URL: string,
  token: string,
  errorContext: string
) => {
  try {
    const response = await axios.get(API_URL, {
      headers: requestHeaders(token),
    });

    return response.data;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    throw error;
  }
};

export const postApiRequest = async <T = unknown, R = unknown>(
  API_URL: string,
  token: string,
  data: T,
  errorContext: string
) => {
  try {
    const response = await axios.post<R>(API_URL, data, {
      headers: requestHeaders(token),
    });

    return response.data;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    throw error;
  }
};

export const updateApiRequest = async <T = unknown, R = unknown>(
  API_URL: string,
  token: string,
  data: T,
  errorContext: string,
  method: "PUT" | "PATCH"
) => {
  try {
    const response =
      method === "PUT"
        ? await axios.put<R>(API_URL, data, {
          headers: requestHeaders(token),
        })
        : await axios.patch<R>(API_URL, data, {
          headers: requestHeaders(token),
        });

    return response.data;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    throw error;
  }
};

export const deleteApiRequest = async (
  API_URL: string,
  token: string,
  id: string,
  errorContext: string
) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: requestHeaders(token),
    });

    return response.data;
  } catch (error) {
    console.error(`${errorContext}:`, error);
    throw error;
  }
};

