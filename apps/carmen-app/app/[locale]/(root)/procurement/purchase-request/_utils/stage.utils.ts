import { StageStatus } from "@/dtos/purchase-request.dto";

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
