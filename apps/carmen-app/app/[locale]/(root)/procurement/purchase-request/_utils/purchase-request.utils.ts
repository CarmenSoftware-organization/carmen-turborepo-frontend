import { removeEmptyFields, convertFieldsToNumbers } from "./object.utils";
import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

const QUANTITY_FIELDS = ["requested_qty", "approved_qty", "foc_qty"] as const;

type PurchaseRequestDetailInput = Record<string, unknown> & {
  readonly id?: string;
};

type CreatePrDto = {
  details: {
    purchase_request_detail?: {
      add?: PurchaseRequestDetailInput[];
      update?: PurchaseRequestDetailInput[];
      remove?: { id: string }[];
    };
  };
};

/** Clean PR detail item: remove id, empty fields, convert quantities to numbers */
export const cleanPurchaseRequestDetail = (
  item: PurchaseRequestDetailInput
): Omit<PurchaseRequestDetailInput, "id"> => {
  const { id, ...itemWithoutId } = item;
  return itemWithoutId as Omit<PurchaseRequestDetailInput, "id">;
};

/** Check if PR has details to process */
export const hasPurchaseRequestDetails = (data: CreatePrDto): boolean => {
  const details = data.details.purchase_request_detail?.add;
  return Boolean(details && details.length > 0);
};

/** Process all PR details by cleaning each item */
export const processPurchaseRequestDetails = (
  details: PurchaseRequestDetailInput[]
): Array<Omit<PurchaseRequestDetailInput, "id">> => {
  return details.map(cleanPurchaseRequestDetail);
};

/** Prepare data for submission by cleaning PR details */
export const prepareSubmitData = (data: CreatePrDto): CreatePrDto => {
  if (!hasPurchaseRequestDetails(data)) {
    return data;
  }

  const originalDetails = data.details.purchase_request_detail?.add;
  if (!originalDetails) {
    return data;
  }

  const processedDetails = processPurchaseRequestDetails(originalDetails);

  return {
    ...data,
    details: {
      ...data.details,
      purchase_request_detail: {
        ...data.details.purchase_request_detail,
        add: processedDetails,
      },
    },
  };
};

export const validateItemForApproval = (item: PurchaseRequestDetail, index?: number): boolean => {
  const logError = (field: string, value: any) => {
    console.log(
      `[Validation Failed] Item ${index !== undefined ? index + 1 : "?"}: ${field} is missing or invalid (Value: ${value})`
    );
  };

  if (!item.tax_profile_id) {
    logError("tax_profile_id", item.tax_profile_id);
    return false;
  }
  if (!item.tax_profile_name) {
    logError("tax_profile_name", item.tax_profile_name);
    return false;
  }
  if (!item.currency_id) {
    logError("currency_id", item.currency_id);
    return false;
  }
  if (!item.exchange_rate_date) {
    logError("exchange_rate_date", item.exchange_rate_date);
    return false;
  }
  if (!item.vendor_id) {
    logError("vendor_id", item.vendor_id);
    return false;
  }
  if (!item.foc_unit_id) {
    logError("foc_unit_id", item.foc_unit_id);
    return false;
  }

  if (Number(item.tax_rate || 0) <= 0) {
    logError("tax_rate", item.tax_rate);
    return false;
  }
  if (Number(item.tax_amount || 0) <= 0) {
    logError("tax_amount", item.tax_amount);
    return false;
  }
  if (Number(item.base_tax_amount || 0) <= 0) {
    logError("base_tax_amount", item.base_tax_amount);
    return false;
  }

  if (Number(item.discount_rate || 0) < 0) {
    logError("discount_rate", item.discount_rate);
    return false;
  }
  if (Number(item.discount_rate || 0) < 0) {
    logError("discount_rate", item.discount_rate);
    return false;
  }

  if (Number(item.total_price || 0) <= 0) {
    logError("total_price", item.total_price);
    return false;
  }
  if (Number(item.net_amount || 0) <= 0) {
    logError("net_amount", item.net_amount);
    return false;
  }
  if (Number(item.base_total_price || 0) <= 0) {
    logError("base_total_price", item.base_total_price);
    return false;
  }
  if (Number(item.base_net_amount || 0) <= 0) {
    logError("base_net_amount", item.base_net_amount);
    return false;
  }

  return true;
};

/** Prepare data for Purchase Approve action with full details */
export const preparePurchaseApproveData = (
  items: PurchaseRequestDetail[],
  prId: string,
  defaultMessage: string = "Approved by purchasing department"
) => {
  return {
    state_role: "purchase",
    details: items.map((item) => ({
      id: item.id,
      purchase_request_id: prId,
      state_status: "approve",
      state_message: defaultMessage,
      description: item.description,
      approved_qty: Number(item.approved_qty || 0),
      approved_unit_id: item.approved_unit_id,
      approved_base_qty: Number(item.approved_base_qty || 0),
      approved_unit_conversion_factor: Number(item.approved_unit_conversion_factor || 0),
      tax_profile_id: item.tax_profile_id,
      tax_profile_name: item.tax_profile_name,
      tax_rate: Number(item.tax_rate || 0),
      tax_amount: Number(item.tax_amount || 0),
      is_tax_adjustment: Boolean(item.is_tax_adjustment),
      base_tax_amount: Number(item.base_tax_amount || 0),
      discount_rate: Number(item.discount_rate || 0),
      discount_amount: Number(item.discount_amount || 0),
      is_discount_adjustment: Boolean(item.is_discount_adjustment),
      base_discount_amount: Number(item.base_discount_amount || 0),
      currency_id: item.currency_id,
      exchange_rate: Number(item.exchange_rate || 0),
      exchange_rate_date: item.exchange_rate_date,
      vendor_id: item.vendor_id,
      total_price: Number(item.total_price || 0),
      sub_total_price: Number(item.sub_total_price || 0),
      net_amount: Number(item.net_amount || 0),
      base_sub_total_price: Number(item.base_sub_total_price || 0),
      base_total_price: Number(item.base_total_price || 0),
      base_net_amount: Number(item.base_net_amount || 0),
      base_price: Number(item.base_price || 0),
      foc_qty: Number(item.foc_qty || 0),
      foc_base_qty: Number(item.foc_base_qty || 0),
      foc_unit_id: item.foc_unit_id,
      foc_unit_conversion_factor: Number(item.foc_unit_conversion_factor || 0),
    })),
  };
};
