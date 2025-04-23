import { formType } from "@/dtos/form.dto";
import { WorkflowCreateModel } from "@/dtos/workflows.dto";
import { backendApi } from "@/lib/backend-api";

export const getWorkflowList = async (
  accessToken: string,
  tenantId: string,
  params: {
    search?: string;
    page?: string;
    perPage?: string;
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

  const url = queryString ? `${backendApi}/api/config/workflows?${queryString}` : `${backendApi}/api/config/workflows`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-tenant-id": tenantId,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

export const getWorkflowId = async (accessToken: string, tenantId: string, id: string) => {
  const url = `${backendApi}/api/config/workflows/${id}`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-tenant-id": tenantId,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return data;
};

export const createWorkflow = async (
  values: WorkflowCreateModel,
  token: string,
  tenantId: string
): Promise<WorkflowCreateModel | null> => {
  try {
    const response = await fetch(`${backendApi}/api/config/workflows`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
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
  tenantId: string,
  mode: formType
): Promise<WorkflowCreateModel | null> => {
  try {
    const url = values?.id ? `${backendApi}/api/config/workflows/${values.id}` : `${backendApi}/api/config/workflows`;

    const method = mode === formType.ADD ? "POST" : "PUT";
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-tenant-id": tenantId,
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

export const deleteWorkflow = async (token: string, tenantId: string, id: string) => {
  const response = await fetch(`${backendApi}/api/config/workflows/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-tenant-id": tenantId,
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
