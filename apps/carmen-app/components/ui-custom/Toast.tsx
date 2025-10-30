import { toast } from "sonner";

type ToastProps = {
  message: string;
};

export const toastSuccess = ({ message }: ToastProps) => {
  toast.success(message);
};

export const toastError = ({ message }: ToastProps) => {
  toast.error(message);
};
