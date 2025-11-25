import { StageStatus, PurchaseRequestDetail } from "@/dtos/purchase-request.dto";

type StagesStatusValue = string | StageStatus[] | undefined;

/** Extract last stage message from stages status array */
export const getLastStageMessage = (stagesStatusValue: StagesStatusValue): string => {
  if (Array.isArray(stagesStatusValue) && stagesStatusValue.length > 0) {
    const lastStage = stagesStatusValue[stagesStatusValue.length - 1];
    return lastStage?.message || "";
  }
  return "";
};

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
    const stagesStatusValue = (getItemValue(item, "stages_status") ||
      item.stages_status) as StagesStatusValue;
    const stageMessage = getLastStageMessage(stagesStatusValue);
    return createStageDetail(item.id, action, stageMessage, defaultMessage);
  });
};
