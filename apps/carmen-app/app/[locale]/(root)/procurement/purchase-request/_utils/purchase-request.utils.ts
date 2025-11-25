import { removeEmptyFields, convertFieldsToNumbers } from "./object.utils";

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
