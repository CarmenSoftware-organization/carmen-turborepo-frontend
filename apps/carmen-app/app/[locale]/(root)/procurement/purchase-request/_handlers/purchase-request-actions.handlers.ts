import { QueryClient } from "@tanstack/react-query";
import { STAGE_ROLE } from "@/dtos/purchase-request.dto";
import { PR_ERROR_MESSAGES } from "../_constants/error-messages";

type ToastConfig = {
  message: string;
};

type ActionFunction = (
  data: any,
  options?: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
  }
) => void;

type StageDetailItem = {
  id: string;
  stage_status: string;
  stage_message: string;
};

/** Handle successful workflow action and invalidate queries */
export const handleActionSuccess = (
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  messageKey: string
): void => {
  toastSuccess({ message: tPR(messageKey) });
  queryClient.invalidateQueries({
    queryKey: ["purchase-request", buCode, prId],
  });
};

/** Handle workflow action error */
export const handleActionError = (
  tPR: (key: string) => string,
  toastError: (config: ToastConfig) => void,
  messageKey: string
): void => {
  toastError({ message: tPR(messageKey) });
};

/** Submit PR for workflow approval */
export const submitPurchaseRequest = (
  details: StageDetailItem[],
  submit: ActionFunction,
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  toastError: (config: ToastConfig) => void
): void => {
  const submitData = {
    state_role: STAGE_ROLE.CREATE,
    details,
  };

  submit(submitData, {
    onSuccess: () =>
      handleActionSuccess(
        queryClient,
        buCode,
        prId,
        tPR,
        toastSuccess,
        PR_ERROR_MESSAGES.SUCCESS.SUBMITTED
      ),
    onError: () => handleActionError(tPR, toastError, PR_ERROR_MESSAGES.API.SUBMIT_FAILED),
  });
};

/** Reject PR items */
export const rejectPurchaseRequest = (
  details: StageDetailItem[],
  reject: ActionFunction,
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  toastError: (config: ToastConfig) => void
): void => {
  const rejectData = {
    state_role: STAGE_ROLE.APPROVE,
    details,
  };

  reject(rejectData, {
    onSuccess: () =>
      handleActionSuccess(
        queryClient,
        buCode,
        prId,
        tPR,
        toastSuccess,
        PR_ERROR_MESSAGES.SUCCESS.REJECTED
      ),
    onError: () => handleActionError(tPR, toastError, PR_ERROR_MESSAGES.API.REJECT_FAILED),
  });
};

/** Send back PR items for revision */
export const sendBackPurchaseRequest = (
  details: StageDetailItem[],
  sendBack: ActionFunction,
  queryClient: QueryClient,
  buCode: string,
  prId: string | undefined,
  tPR: (key: string) => string,
  toastSuccess: (config: ToastConfig) => void,
  toastError: (config: ToastConfig) => void
): void => {
  const sendBackData = {
    state_role: STAGE_ROLE.ISSUE,
    details,
  };

  sendBack(sendBackData, {
    onSuccess: () =>
      handleActionSuccess(
        queryClient,
        buCode,
        prId,
        tPR,
        toastSuccess,
        PR_ERROR_MESSAGES.SUCCESS.SENT_BACK
      ),
    onError: () => handleActionError(tPR, toastError, PR_ERROR_MESSAGES.API.SEND_BACK_FAILED),
  });
};
