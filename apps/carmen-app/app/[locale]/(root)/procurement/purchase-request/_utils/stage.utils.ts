import { PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

/** Create stage detail item for workflow actions */
export const createStageDetail = (
  itemId: string,
  stageStatus: string,
  stageMessage: string,
  defaultMessage: string
): { id: string; stage_status: string; stage_message: string } => {
  return {
    id: itemId,
    stage_status: stageStatus,
    stage_message: stageMessage || defaultMessage,
  };
};

/**
 * Helper to map purchase items to stage details for workflow actions
 */
export const prepareStageDetails = (
  items: PurchaseRequestDetail[],
  getItemValue: (item: PurchaseRequestDetail, field: string) => any,
  action: string,
  defaultMessage: string
) => {
  return items.map((item) => {
    const stageMessage =
      (getItemValue(item, "stage_message") as string) || item.stage_message || "";
    return createStageDetail(item.id, action, stageMessage, defaultMessage);
  });
};
