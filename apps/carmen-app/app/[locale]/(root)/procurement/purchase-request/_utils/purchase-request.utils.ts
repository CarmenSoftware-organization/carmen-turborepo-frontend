import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

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

export const preparePurchaseApproveData = (
  items: PurchaseRequestDetail[],
  prId: string,
  stateRole: string = "purchase",
  defaultMessage: string = "Approved by purchasing department"
) => {
  return {
    state_role: stateRole,
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
      exchange_rate_date: item.exchange_rate_date || new Date().toISOString(),
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
