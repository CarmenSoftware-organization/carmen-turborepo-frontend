import { toast } from 'sonner';

type ToastProps = {
    message: string;
};

export const toastSuccess = ({ message }: ToastProps) => {
    toast.success(message, {
        className: 'bg-green-500 text-white shadow-lg rounded-md',
    });
};


export const toastError = ({ message }: ToastProps) => {
    toast.error(message, {
        className: 'bg-red-500 text-white shadow-lg rounded-md',
    });
};
