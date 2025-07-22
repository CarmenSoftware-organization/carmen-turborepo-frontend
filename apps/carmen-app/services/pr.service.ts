import { backendApi } from "@/lib/backend-api";
import axios from "axios";
import {
  getAllApiRequest,
  getByIdApiRequest,
  requestHeaders,
} from "@/lib/config.api";
import { PrSchemaV2Dto } from "@/dtos/pr.dto";
import {
  PurchaseRequestCreateFormDto,
  PurchaseRequestUpdateFormDto,
} from "@/dtos/purchase-request.dto";
import { ParamsGetDto } from "@/dtos/param.dto";

const API_URL = `${backendApi}/api/purchase-request`;

export const getAllPrService = async (
  token: string,
  tenantId: string,
  params?: ParamsGetDto
) => {
  return getAllApiRequest(
    API_URL,
    token,
    tenantId,
    "Failed to fetch purchase requests",
    params
  );
};

export const getPrByIdService = async (
  token: string,
  tenantId: string,
  id: string
) => {
  const API_URL_BY_ID = `${API_URL}/${id}`;
  return getByIdApiRequest(
    API_URL_BY_ID,
    token,
    tenantId,
    "Failed to fetch purchase request"
  );
};

// Transformation function สำหรับแปลง DTO ใหม่ไปเป็น format เก่าที่ API คาดหวัง
const transformCreateFormToApiFormat = (data: PurchaseRequestCreateFormDto): any => {
  return {
    pr_date: data.pr_date.toISOString(),
    requestor_id: data.requestor_id,
    department_id: data.department_id,
    workflow_id: data.workflow_id,
    description: data.description,
    note: data.note,
    info: data.info,
    dimension: data.dimension,
    purchase_request_detail: data.purchase_request_detail,
  };
};

const transformUpdateFormToApiFormat = (data: PurchaseRequestUpdateFormDto): any => {
  return {
    pr_date: data.pr_date.toISOString(),
    requestor_id: data.requestor_id,
    department_id: data.department_id,
    workflow_id: data.workflow_id,
    description: data.description,
    note: data.note,
    info: data.info,
    dimension: data.dimension,
    doc_version: data.doc_version,
    purchase_request_detail: data.purchase_request_detail,
  };
};

// Overloaded function signatures
export async function createPrService(
  token: string,
  tenantId: string,
  data: PurchaseRequestCreateFormDto
): Promise<any>;
export async function createPrService(
  token: string,
  tenantId: string,
  data: PrSchemaV2Dto
): Promise<any>;
export async function createPrService(
  token: string,
  tenantId: string,
  data: PurchaseRequestCreateFormDto | PrSchemaV2Dto
): Promise<any> {
  console.log("data createPrService", data);

  let apiData: any;

  // Check if it's the new DTO format
  if ('pr_date' in data && data.pr_date instanceof Date) {
    // New DTO format - transform it
    apiData = transformCreateFormToApiFormat(data as PurchaseRequestCreateFormDto);
  } else {
    // Old DTO format - use as is
    apiData = data;
  }

  try {
    const response = await axios.post(API_URL, apiData, {
      headers: requestHeaders(token, tenantId),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

// Overloaded function signatures
export async function updatePrService(
  token: string,
  tenantId: string,
  id: string,
  data: PurchaseRequestUpdateFormDto
): Promise<any>;
export async function updatePrService(
  token: string,
  tenantId: string,
  id: string,
  data: PrSchemaV2Dto
): Promise<any>;
export async function updatePrService(
  token: string,
  tenantId: string,
  id: string,
  data: PurchaseRequestUpdateFormDto | PrSchemaV2Dto
): Promise<any> {
  console.log("id", id);
  console.log("data", data);

  let apiData: any;

  // Check if it's the new DTO format
  if ('pr_date' in data && data.pr_date instanceof Date) {
    // New DTO format - transform it
    apiData = transformUpdateFormToApiFormat(data as PurchaseRequestUpdateFormDto);
  } else {
    // Old DTO format - use as is
    apiData = data;
  }

  try {
    const response = await axios.put(`${API_URL}/${id}`, apiData, {
      headers: requestHeaders(token, tenantId),
    });

    return response.data;
  } catch (error) {
    console.log("error updatePrService", error);
    throw error;
  }
}

export const deletePrService = async (
  token: string,
  tenantId: string,
  id: string
) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: requestHeaders(token, tenantId),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
