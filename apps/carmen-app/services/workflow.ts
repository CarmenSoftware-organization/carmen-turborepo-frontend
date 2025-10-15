import { formType } from "@/dtos/form.dto";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { backendApi } from "@/lib/backend-api";

// Helper function to build workflow API URL
const getWorkflowApiUrl = (buCode: string, path: string = "") => {
  const baseUrl = `${backendApi}/api/config/${buCode}/workflows`;
  return path ? `${baseUrl}/${path}` : baseUrl;
};

export const getWorkflowList = async (
  accessToken: string,
  buCode: string,
  params: {
    search?: string;
    page?: number | string;
    perpage?: number | string;
    sort?: string;
    filter?: string;
  } = {}
) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  const url = queryString
    ? `${getWorkflowApiUrl(buCode)}?${queryString}`
    : getWorkflowApiUrl(buCode);

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();

  return data;
};

export const getWorkflowId = async (accessToken: string, buCode: string, id: string) => {
  const url = getWorkflowApiUrl(buCode, id);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

export const createWorkflow = async (
  values: WorkflowCreateModel,
  token: string,
  buCode: string
): Promise<WorkflowCreateModel | null> => {
  try {
    const response = await fetch(getWorkflowApiUrl(buCode), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Failed to create workflow`);
    }

    const result = await response.json();
    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  } catch (error) {
    console.error("Error submitting workflows:", error);
    return null;
  }
};

export const handleSubmit = async (
  values: WorkflowCreateModel,
  token: string,
  buCode: string,
  mode: formType
): Promise<WorkflowCreateModel | null> => {
  try {
    const url = values?.id
      ? getWorkflowApiUrl(buCode, values.id)
      : getWorkflowApiUrl(buCode);

    const method = mode === formType.ADD ? "POST" : "PUT";
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${mode} workflow`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }
    return result;
  } catch (error) {
    console.error("Error submitting workflow:", error);
    return null;
  }
};

export const deleteWorkflow = async (token: string, buCode: string, id: string) => {
  const response = await fetch(getWorkflowApiUrl(buCode, id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    throw new Error("Failed to delete workflow");
  }

  return response;
};
