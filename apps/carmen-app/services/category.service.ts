import { CategoryDto } from "@/dtos/category.dto";
import { backendApi } from "@/lib/backend-api";

export const getCategoryService = async (
  token: string,
  buCode: string,
  params?: {
    page?: number;
    perpage?: number;
    search?: string;
    sort?: string;
    order?: string;
  }
) => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.perpage) queryParams.append("perpage", params.perpage.toString());
  if (params?.search) queryParams.append("search", params.search);
  if (params?.sort) queryParams.append("sort", params.sort);
  if (params?.order) queryParams.append("order", params.order);

  const response = await fetch(
    `${backendApi}/api/config/${buCode}/products/category?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
};

export const createCategoryService = async (
  token: string,
  buCode: string,
  category: CategoryDto
) => {
  const response = await fetch(`${backendApi}/api/config/${buCode}/products/category`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
  const data = await response.json();
  return data;
};

export const updateCategoryService = async (
  token: string,
  buCode: string,
  category: CategoryDto
) => {
  const response = await fetch(
    `${backendApi}/api/config/${buCode}/products/category/${category.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    }
  );
  const data = await response.json();
  return data;
};

export const deleteCategoryService = async (token: string, buCode: string, categoryId: string) => {
  const response = await fetch(
    `${backendApi}/api/config/${buCode}/products/category/${categoryId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  // Handle empty response (204 No Content)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return { statusCode: response.status, data: null };
  }

  // Try to parse JSON, handle empty responses gracefully
  try {
    const data = await response.json();
    return { statusCode: response.status, ...data };
  } catch (error) {
    if (response.ok) {
      return { statusCode: response.status, data: null };
    }
    throw error;
  }
};
