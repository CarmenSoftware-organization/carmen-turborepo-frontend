import { toast } from 'sonner';

type ToastProps = {
    message: string;
    description?: string;
};

type ToastOptions = {
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
};

const defaultOptions: ToastOptions = {
    duration: 5000,
    position: 'top-right'
};

export const toastSuccess = ({ message, description }: ToastProps, options?: ToastOptions) => {
    toast.success(message, {
        ...defaultOptions,
        ...options,
        className: 'bg-green-50 text-green-900 shadow-lg rounded-md border border-green-200',
        description,
    });
};

export const toastError = ({ message, description }: ToastProps, options?: ToastOptions) => {
    toast.error(message, {
        ...defaultOptions,
        ...options,
        className: 'bg-red-50 text-red-900 shadow-lg rounded-md border border-red-200',
        description,
    });
};

export const toastWarning = ({ message, description }: ToastProps, options?: ToastOptions) => {
    toast.warning(message, {
        ...defaultOptions,
        ...options,
        className: 'bg-yellow-50 text-yellow-900 shadow-lg rounded-md border border-yellow-200',
        description,
    });
};

export const toastInfo = ({ message, description }: ToastProps, options?: ToastOptions) => {
    toast.info(message, {
        ...defaultOptions,
        ...options,
        className: 'bg-blue-50 text-blue-900 shadow-lg rounded-md border border-blue-200',
        description,
    });
};
